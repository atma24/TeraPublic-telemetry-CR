import { RefreshCw } from "lucide-react";

import { FacilityAdminTable } from "@/components/admin/facility-admin-table";
import { ErrorState } from "@/components/ui/states";
import { getAdminFacilities, getRegionsForAdmin, type AdminListParams } from "@/lib/api/admin";
import { getAllFacilities } from "@/lib/api/public";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Fasilitas" };

const PER_PAGE = 20;

export default async function AdminFacilitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category_id?: string; baru?: string }>;
}) {
  const session = await requireAdmin("/admin/fasilitas");
  const params = await searchParams;
  const page = Math.max(1, Number(params.page || 1) || 1);
  const search = params.search?.trim() ?? "";
  const categoryId = Number(params.category_id || 0) || undefined;

  const query: AdminListParams = {
    page,
    per_page: PER_PAGE,
    search: search || undefined,
    category_id: categoryId,
  };

  const [facilitiesResult, regionsResult, allFacilitiesResult] = await Promise.allSettled([
    getAdminFacilities(session.token, query),
    getRegionsForAdmin(session.token),
    getAllFacilities(),
  ]);

  if (facilitiesResult.status === "rejected") {
    return (
      <div className="mx-auto max-w-[1400px] space-y-5">
        <div>
          <p className="eyebrow">Manajemen data</p>
          <h1 className="display-3 mt-2 text-text">Fasilitas</h1>
        </div>
        <ErrorState
          title="Daftar fasilitas belum dapat dimuat"
          description="Backend menolak atau tidak merespons permintaan daftar fasilitas admin."
          action={
            <a
              href="/admin/fasilitas"
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

  const response = facilitiesResult.value;
  const facilities = response.data;
  const total = response.meta.total;
  const lastPage = response.meta.last_page ?? Math.max(1, Math.ceil(total / PER_PAGE));

  const regionPool =
    regionsResult.status === "fulfilled"
      ? regionsResult.value.data
      : facilities.map((facility) => facility.region).filter((region): region is NonNullable<typeof region> => Boolean(region));
  const regions = [...new Map(regionPool.map((region) => [region.id, region])).values()].sort((a, b) =>
    a.name.localeCompare(b.name, "id"),
  );

  const facilityPool =
    allFacilitiesResult.status === "fulfilled" ? allFacilitiesResult.value : facilities;
  const categories = [
    ...new Map(
      facilityPool
        .map((facility) => facility.category)
        .filter((category): category is NonNullable<typeof category> => Boolean(category))
        .map((category) => [category.id, { id: category.id, name: category.name }]),
    ).values(),
  ].sort((a, b) => a.name.localeCompare(b.name, "id"));

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Manajemen data</p>
          <h1 className="display-3 mt-2 text-text">Fasilitas</h1>
          <p className="mt-1.5 text-sm text-muted">
            {total > 0 ? `${total.toLocaleString("id-ID")} fasilitas tercatat.` : "Belum ada fasilitas."} Perubahan
            langsung memengaruhi halaman publik.
          </p>
        </div>
      </div>

      {categories.length === 0 || regions.length === 0 ? (
        <div className="rounded-lg border border-highlight/35 bg-highlight/8 px-4 py-3 text-[11px] leading-relaxed text-muted">
          Opsi kategori atau kecamatan belum lengkap karena sebagian data referensi gagal dimuat. Form tambah/edit
          mungkin tidak dapat digunakan sampai backend merespons.
        </div>
      ) : null}

      <FacilityAdminTable
        facilities={facilities}
        categories={categories}
        regions={regions}
        currentPage={page}
        lastPage={lastPage}
        query={{ search, category_id: params.category_id }}
        initialOpen={params.baru === "1"}
      />
    </div>
  );
}
