"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { login, logout, register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { AuthActionState } from "@/types/auth";
import { safeNextPath } from "@/lib/utils";
import { clearSessionCookie, getSession, setSessionCookie } from "./session";

function fieldErrorsFrom(error: ApiError): Record<string, string> | undefined {
  if (!error.errors) return undefined;
  return Object.fromEntries(
    Object.entries(error.errors).map(([field, messages]) => [field, messages[0] ?? "Nilai tidak valid."]),
  );
}

function stringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = stringValue(formData, "email");
  const password = stringValue(formData, "password");
  const nextPath = safeNextPath(stringValue(formData, "next"), "/");

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Format email tidak valid.";
  if (!password) fieldErrors.password = "Kata sandi wajib diisi.";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali data yang Anda masukkan.", fieldErrors };
  }

  try {
    const response = await login({ email, password });
    await setSessionCookie(response.data.access_token);
    revalidatePath("/", "layout");
    const destination =
      nextPath !== "/" ? nextPath : response.data.user.role === "admin" ? "/admin" : "/aduan/saya";
    redirect(destination);
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message,
        fieldErrors: fieldErrorsFrom(error),
      };
    }
    throw error;
  }
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = stringValue(formData, "name");
  const email = stringValue(formData, "email");
  const password = stringValue(formData, "password");
  const confirmation = stringValue(formData, "password_confirmation");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Nama lengkap wajib diisi.";
  if (!email) fieldErrors.email = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Format email tidak valid.";
  if (password.length < 8) fieldErrors.password = "Kata sandi minimal 8 karakter.";
  if (password !== confirmation) fieldErrors.password_confirmation = "Konfirmasi kata sandi tidak sama.";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali data yang Anda masukkan.", fieldErrors };
  }

  try {
    const response = await register({
      name,
      email,
      password,
      password_confirmation: confirmation,
    });
    await setSessionCookie(response.data.access_token);
    revalidatePath("/", "layout");
    redirect("/aduan/saya");
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message,
        fieldErrors: fieldErrorsFrom(error),
      };
    }
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  if (session) {
    try {
      await logout(session.token);
    } catch {
      // Token tetap dihapus dari cookie meskipun backend tidak dapat dijangkau.
    }
  }
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
}
