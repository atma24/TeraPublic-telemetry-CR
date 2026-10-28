import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getMe } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { Session, UserRole } from "@/types/auth";
import { safeNextPath } from "@/lib/utils";

export const SESSION_COOKIE = "tp_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const response = await getMe(token);
    return { token, user: response.data };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    return null;
  }
});

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function loginRedirectPath(nextPath?: string | null): string {
  return `/login?next=${encodeURIComponent(safeNextPath(nextPath, "/"))}`;
}

export async function requireSession(nextPath?: string): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(loginRedirectPath(nextPath));
  return session;
}

export async function requireRole(role: UserRole, nextPath?: string): Promise<Session> {
  const session = await requireSession(nextPath);
  if (session.user.role !== role) redirect("/");
  return session;
}

export async function requireAdmin(nextPath = "/admin"): Promise<Session> {
  return requireRole("admin", nextPath);
}
