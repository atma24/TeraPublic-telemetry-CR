import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { firstParam, safeNextPath } from "@/lib/utils";
import type { SearchParams } from "@/types/api";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun warga TeraPublic untuk mengirim aduan dan memantau tindak lanjut.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(firstParam(params.next), "/");

  return (
    <div>
      <p className="eyebrow">Selamat datang kembali</p>
      <h1 className="display-3 mt-3 text-text">Masuk ke TeraPublic</h1>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">
        Gunakan akun warga untuk mengirim aduan, memantau tindak lanjut, dan bertanya pada asisten data.
      </p>

      <div className="mt-8">
        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
