import { RefreshCw } from "lucide-react";

import { RegionsManager } from "@/components/admin/regions-manager";
import { ErrorState } from "@/components/ui/states";
import { getRegionsForAdmin } from "@/lib/api/admin";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Wilayah" };

export default async function AdminRegionsPage() {
  const session = await requireAdmin("/admin/wilayah");
  const result = await getRegionsForAdmin(session.token)
    .then((response) => response.data)
    .catch(() => null);

  if (!result) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-5">
        <div>
          <p className="eyebrow">Referensi wilayah</p>
          <h1 className="display-3 mt-2 text-text">Wilayah</h1>
        </div>
        <ErrorState
          title="Daftar wilayah belum dapat dimuat"
          description="Backend menolak atau tidak merespons permintaan data wilayah admin."
          action={
            <a
              href="/admin/wilayah"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-text hover:bg-surface-2"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Muat ulang
            </a>
          }
        />
      </div>
    );
  }

  const regions = [...result].sort((a, b) => a.name.localeCompare(b.name, "id"));

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <div>
        <p className="eyebrow">Referensi wilayah</p>
        <h1 className="display-3 mt-2 text-text">Wilayah</h1>
        <p className="mt-1.5 text-sm text-muted">
          {regions.length.toLocaleString("id-ID")} kecamatan. Hanya jumlah penduduk dan luas wilayah yang dapat
          diperbarui dari panel ini.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface-2/60 px-4 py-3 text-[11px] leading-relaxed text-muted">
        Perubahan populasi memengaruhi rasio fasilitas per 10.000 penduduk dan indeks pemerataan. Nilai luas digunakan
        sebagai konteks, bukan dasar skor utama.
      </div>

      <RegionsManager regions={regions} />
    </div>
  );
}
