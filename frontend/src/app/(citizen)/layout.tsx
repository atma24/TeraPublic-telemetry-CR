import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireSession } from "@/lib/auth/session";

export default async function CitizenLayout({ children }: { children: ReactNode }) {
  const session = await requireSession("/aduan/saya");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader user={session.user} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
