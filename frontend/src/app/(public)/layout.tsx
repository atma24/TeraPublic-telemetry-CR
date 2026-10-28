import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSession } from "@/lib/auth/session";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader user={session?.user ?? null} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
