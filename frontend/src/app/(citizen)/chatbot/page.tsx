import type { Metadata } from "next";

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
      />
      <div className="container-page py-6 md:py-8">
        <ChatPanel userName={session.user.name} />
      </div>
    </>
  );
}
