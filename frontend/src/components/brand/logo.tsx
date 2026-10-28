import Image from "next/image";
import Link from "next/link";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
  imageClassName,
  showTagline = false,
  priority = false,
  compact = false,
  tone = "auto",
}: {
  href?: string;
  className?: string;
  imageClassName?: string;
  showTagline?: boolean;
  priority?: boolean;
  compact?: boolean;
  tone?: "auto" | "inverse";
}) {
  const imageClassNameValue = cn(
    "h-9 w-auto object-contain md:h-10",
    compact && "h-8 md:h-8",
    imageClassName,
  );

  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {tone === "inverse" ? (
        <Image
          src="/brand/logo-horizontal-dark.png"
          alt={SITE_NAME}
          width={1600}
          height={517}
          priority={priority}
          sizes={compact ? "132px" : "190px"}
          className={imageClassNameValue}
        />
      ) : (
        <>
          <Image
            src="/brand/logo-horizontal.png"
            alt={SITE_NAME}
            width={1600}
            height={510}
            priority={priority}
            sizes={compact ? "132px" : "190px"}
            className={cn(imageClassNameValue, "dark:hidden")}
          />
          <Image
            src="/brand/logo-horizontal-dark.png"
            alt=""
            width={1600}
            height={517}
            priority={priority}
            sizes={compact ? "132px" : "190px"}
            className={cn(imageClassNameValue, "hidden dark:block")}
          />
        </>
      )}
      {showTagline ? (
        <span className="hidden border-l border-border pl-3 text-[10px] font-semibold uppercase leading-tight tracking-[0.13em] text-muted lg:block">
          {SITE_TAGLINE}
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label={`${SITE_NAME} — ${SITE_TAGLINE}`} className="inline-flex">
      {content}
    </Link>
  );
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/app-icon-512.png"
      alt=""
      width={512}
      height={512}
      sizes="48px"
      className={cn("size-10 rounded-md object-contain", className)}
    />
  );
}
