"use client";

import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";
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
          className="flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-xs leading-relaxed text-danger shadow-2xs"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

      <Field label="Alamat Email" htmlFor="email" error={state.fieldErrors?.email} required>
        <div className="relative group">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted transition-colors duration-200 group-focus-within:text-interactive" aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="nama@email.com"
            className={`${inputClass} rounded-xl pl-10 pr-4 transition-all duration-200`}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            required
          />
        </div>
      </Field>

      <Field label="Kata Sandi" htmlFor="password" error={state.fieldErrors?.password} required>
        <div className="relative group">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted transition-colors duration-200 group-focus-within:text-interactive" aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan kata sandi"
            className={`${inputClass} rounded-xl pl-10 pr-11 transition-all duration-200`}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-muted transition-colors hover:text-text"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </Field>

      <Button
        type="submit"
        className="relative w-full h-11 rounded-xl text-sm font-bold shadow-md shadow-interactive/15 transition-all duration-200 hover:shadow-lg hover:shadow-interactive/25 active:scale-[0.99]"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Memeriksa akun…
          </>
        ) : (
          <>
            <LogIn className="size-4" aria-hidden="true" />
            Masuk ke Akun
          </>
        )}
      </Button>

      <div className="relative flex items-center justify-center pt-2">
        <div className="absolute inset-x-0 h-px bg-border/70" />
        <span className="relative bg-surface px-3 text-[11px] font-medium text-muted">
          atau
        </span>
      </div>

      <p className="text-center text-xs text-muted">
        Belum memiliki akun warga?{" "}
        <Link href="/register" className="font-semibold text-interactive transition-colors hover:underline">
          Daftar akun warga baru
        </Link>
      </p>
    </form>
  );
}
