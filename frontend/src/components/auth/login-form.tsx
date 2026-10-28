"use client";

import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/form";
import { loginAction } from "@/lib/auth/actions";
import type { AuthActionState } from "@/types/auth";

const initialState: AuthActionState = { ok: false };

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      {state.message ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-danger/25 bg-danger/5 px-3.5 py-3 text-xs leading-relaxed text-danger"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

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

      <Field label="Kata sandi" htmlFor="password" error={state.fieldErrors?.password} required>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            className={`${inputClass} pr-11`}
            aria-invalid={Boolean(state.fieldErrors?.password)}
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

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Memeriksa akun…
          </>
        ) : (
          <>
            <LogIn className="size-4" aria-hidden="true" />
            Masuk
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-interactive hover:underline">
          Daftar sebagai warga
        </Link>
      </p>
    </form>
  );
}
