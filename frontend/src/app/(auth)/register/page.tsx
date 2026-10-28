import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun warga TeraPublic untuk berpartisipasi dalam transparansi layanan publik.",
};

export default function RegisterPage() {
  return (
    <div>
      <p className="eyebrow">Partisipasi warga</p>
      <h1 className="display-3 mt-3 text-text">Buat akun warga</h1>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">
        Satu akun untuk melaporkan kondisi fasilitas, memantau aduan, dan membaca data dengan bantuan
        asisten.
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
