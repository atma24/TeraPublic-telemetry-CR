import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { ChatPanel } from "@/components/assistant/chat-panel";
import { PageHeader } from "@/components/ui/page-header";
import { requireSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Asisten Data",
  description: "Tanyakan data fasilitas, anggaran, dan pemerataan wilayah TeraPublic.",
};

export default async function ChatbotPage() {
  const session = await requireSession("/chatbot");

  return (
    <>
      <PageHeader
        eyebrow="Portal warga"
        title="Asisten data"
        description="Ajukan pertanyaan dalam bahasa sehari-hari. Asisten akan membaca data TeraPublic dan menyertakan sumber yang dipakai."
        breadcrumbs={[{ label: "Asisten data" }]}
        widget={
          <div className="rounded-xl border border-border/80 bg-surface/90 p-3.5 shadow-soft backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                <Sparkles className="size-3.5 text-interactive" />
                RAG Engine Asisten
              </span>
              <span className="rounded-full bg-interactive/10 px-2 py-0.5 text-[10px] font-bold text-interactive">
                Online & Siap
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Didukung basis data agregat TeraPublic 2026. Menjawab fasilitas, APBD, dan sebaran 44 kecamatan.
            </p>
          </div>
        }
      />
      <div className="container-page py-6 md:py-8">
        <ChatPanel userName={session.user.name} />
      </div>
    </>
  );
}
