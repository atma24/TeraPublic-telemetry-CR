"use client";

import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { registerAction } from "@/lib/auth/actions";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = { ok: false };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-danger/25 bg-danger/5 px-3.5 py-3 text-xs leading-relaxed text-danger"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

      <Field label="Nama lengkap" htmlFor="name" error={state.fieldErrors?.name} required>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Nama sesuai identitas"
          className={inputClass}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          required
        />
      </Field>

      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email} required>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nama@email.com"
          className={inputClass}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Kata sandi"
          htmlFor="password"
          hint="Minimal 8 karakter."
          error={state.fieldErrors?.password}
          required
        >
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Buat kata sandi"
              className={`${inputClass} pr-11`}
              aria-invalid={Boolean(state.fieldErrors?.password)}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-muted hover:text-text"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        <Field
          label="Ulangi kata sandi"
          htmlFor="password_confirmation"
          error={state.fieldErrors?.password_confirmation}
          required
        >
          <input
            id="password_confirmation"
            name="password_confirmation"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Ulangi kata sandi"
            className={inputClass}
            aria-invalid={Boolean(state.fieldErrors?.password_confirmation)}
            required
          />
        </Field>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Membuat akun…
          </>
        ) : (
          <>
            <UserPlus className="size-4" aria-hidden="true" />
            Daftar sebagai warga
          </>
        )}
      </Button>

      <p className="text-center text-[11px] leading-relaxed text-muted">
        Dengan mendaftar, akun Anda digunakan untuk mengirim aduan dan mengakses asisten data.
      </p>

      <p className="text-center text-xs text-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-interactive hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
