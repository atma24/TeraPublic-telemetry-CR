import { RefreshCw } from "lucide-react";

import { BudgetAdminTable } from "@/components/admin/budget-admin-table";
import { ErrorState } from "@/components/ui/states";
import { getAdminBudgetProjects, getRegionsForAdmin } from "@/lib/api/admin";
import { getAllFacilities } from "@/lib/api/public";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Anggaran" };

const PER_PAGE = 20;

export default async function AdminBudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; baru?: string }>;
}) {
  const session = await requireAdmin("/admin/anggaran");
  const params = await searchParams;
  const page = Math.max(1, Number(params.page || 1) || 1);
  const status = params.status?.trim() ?? "";

  const [projectsResult, regionsResult, facilitiesResult] = await Promise.allSettled([
    getAdminBudgetProjects(session.token, { page, per_page: PER_PAGE, status: status || undefined }),
    getRegionsForAdmin(session.token),
    getAllFacilities(),
  ]);

  if (projectsResult.status === "rejected") {
    return (
      <div className="mx-auto max-w-[1400px] space-y-5">
        <div>
          <p className="eyebrow">Manajemen data</p>
          <h1 className="display-3 mt-2 text-text">Anggaran</h1>
        </div>
        <ErrorState
          title="Daftar proyek belum dapat dimuat"
          description="Backend menolak atau tidak merespons permintaan daftar proyek anggaran admin."
          action={
            <a
              href="/admin/anggaran"
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

  const response = projectsResult.value;
  const projects = response.data;
  const total = response.meta.total;
  const lastPage = response.meta.last_page ?? Math.max(1, Math.ceil(total / PER_PAGE));

  const regionPool =
    regionsResult.status === "fulfilled"
      ? regionsResult.value.data
      : projects.map((project) => project.region).filter((region): region is NonNullable<typeof region> => Boolean(region));
  const regions = [...new Map(regionPool.map((region) => [region.id, region])).values()].sort((a, b) =>
    a.name.localeCompare(b.name, "id"),
  );

  const facilities =
    facilitiesResult.status === "fulfilled"
      ? facilitiesResult.value
      : projects
          .map((project) => project.facility)
          .filter((facility): facility is NonNullable<typeof facility> => Boolean(facility));

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div>
        <p className="eyebrow">Manajemen data</p>
        <h1 className="display-3 mt-2 text-text">Anggaran</h1>
        <p className="mt-1.5 text-sm text-muted">
          {total.toLocaleString("id-ID")} proyek pada sistem. Perubahan memengaruhi ringkasan publik dan proyeksi.
        </p>
      </div>

      <div className="rounded-lg border border-highlight/30 bg-highlight/8 px-4 py-3 text-[11px] leading-relaxed text-muted">
        Proyeksi insight dihitung ulang dari data anggaran. Setelah mengubah realisasi atau status, halaman insight
        dapat memerlukan waktu singkat untuk menyegarkan cache.
      </div>

      {regions.length === 0 ? (
        <div className="rounded-lg border border-danger/25 bg-danger/5 px-4 py-3 text-[11px] leading-relaxed text-danger">
          Referensi kecamatan gagal dimuat. Form proyek dinonaktifkan sampai data wilayah tersedia.
        </div>
      ) : null}

      <BudgetAdminTable
        projects={projects}
        regions={regions}
        facilities={facilities}
        currentPage={page}
        lastPage={lastPage}
        status={status}
        initialOpen={params.baru === "1"}
      />
    </div>
  );
}
