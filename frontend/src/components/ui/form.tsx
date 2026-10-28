import type { HTMLAttributes, LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const inputClass =
  "h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-text shadow-sm outline-none transition-colors placeholder:text-muted/70 hover:border-border focus:border-interactive focus:ring-2 focus:ring-interactive/15 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted";

export const textareaClass =
  "min-h-28 w-full resize-y rounded-md border border-border bg-surface px-3.5 py-3 text-sm leading-relaxed text-text shadow-sm outline-none transition-colors placeholder:text-muted/70 hover:border-border focus:border-interactive focus:ring-2 focus:ring-interactive/15 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted";

export const selectClass =
  "h-11 w-full appearance-none rounded-md border border-border bg-surface px-3.5 text-sm text-text shadow-sm outline-none transition-colors hover:border-border focus:border-interactive focus:ring-2 focus:ring-interactive/15 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-semibold leading-5 text-text", className)}
      {...props}
    />
  );
}

export function FieldError({
  message,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
  if (!message) return null;
  return (
    <p className={cn("text-xs font-medium text-danger", className)} {...props}>
      {message}
    </p>
  );
}

export function FieldHint({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-[11px] leading-relaxed text-muted", className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </Label>
      {children}
      {error ? <FieldError message={error} /> : hint ? <FieldHint>{hint}</FieldHint> : null}
    </div>
  );
}
