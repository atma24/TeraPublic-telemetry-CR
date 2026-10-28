import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "amber";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-interactive text-bg hover:bg-interactive-strong shadow-sm",
  secondary:
    "border border-border bg-surface text-text hover:border-interactive/45 hover:bg-surface-2",
  outline:
    "border border-interactive/40 bg-transparent text-interactive hover:border-interactive hover:bg-interactive/8",
  ghost: "border border-transparent bg-transparent text-muted hover:bg-surface-2 hover:text-text",
  danger: "border border-transparent bg-danger text-bg hover:opacity-90",
  amber: "border border-transparent bg-highlight text-brand-navy hover:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-md px-3 text-xs font-semibold",
  md: "h-11 gap-2 rounded-md px-4 text-sm font-semibold",
  lg: "h-12 gap-2 rounded-md px-5 text-sm font-semibold",
  icon: "size-10 rounded-md",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-[color,background-color,border-color,opacity,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button type={type} className={buttonStyles(variant, size, className)} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <Link className={buttonStyles(variant, size, className)} {...props} />;
}
