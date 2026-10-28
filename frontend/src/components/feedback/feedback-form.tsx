"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Crosshair,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";
import { useActionState, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Field,
  FieldHint,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/ui/form";
import { createFeedbackAction } from "@/lib/actions/citizen";
import { FEEDBACK_CATEGORIES } from "@/lib/constants";
import type { FeedbackActionState } from "@/types/actions";
import type { PublicFacility } from "@/types/public";

const initialState: FeedbackActionState = { ok: false };

export function FeedbackForm({
  facilities,
  defaultName,
  defaultEmail,
  defaultFacilityId,
  facilitiesUnavailable,
}: {
  facilities: PublicFacility[];
  defaultName: string;
  defaultEmail: string;
  defaultFacilityId?: number;
  facilitiesUnavailable?: boolean;
}) {
  const [state, formAction, pending] = useActionState(createFeedbackAction, initialState);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const grouped = facilities.reduce<Record<string, PublicFacility[]>>((groups, facility) => {
    const key = facility.category?.name ?? "Fasilitas lain";
    groups[key] = [...(groups[key] ?? []), facility];
    return groups;
  }, {});

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Perangkat ini tidak mendukung deteksi lokasi.");
      return;
    }
    setLocating(true);
    setLocationMessage(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationMessage("Koordinat lokasi saat ini berhasil diisi.");
        setLocating(false);
      },
      () => {
        setLocationMessage("Izin lokasi tidak diberikan. Anda dapat mengisi koordinat secara manual.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  if (state.ok && state.trackingCode) {
    return (
      <div className="rounded-lg border border-success/25 bg-surface p-6 md:p-8">
        <span className="inline-flex size-11 items-center justify-center rounded-md bg-success/10 text-success">
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold tracking-[-0.03em] text-text">
          Aduan berhasil dikirim
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
          Simpan kode pelacakan berikut. Anda dapat memantau status dan tanggapan admin dari halaman
          aduan saya.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface-2 px-4 py-3">
          <code className="font-mono text-lg font-bold tracking-wide text-text">{state.trackingCode}</code>
          <CopyButton value={state.trackingCode} label="Salin kode" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <ButtonLink href={`/aduan/saya?baru=${encodeURIComponent(state.trackingCode)}`} size="sm">
            Lihat aduan saya
          </ButtonLink>
          <ButtonLink href="/aduan/buat" variant="secondary" size="sm">
            Buat aduan lain
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-danger/25 bg-danger/5 px-3.5 py-3 text-xs leading-relaxed text-danger"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

      <section className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h2 className="font-display text-sm font-semibold text-text">Tentang laporan</h2>
          <p className="mt-0.5 text-[11px] text-muted">
            Pilih kategori yang paling dekat dengan temuan Anda.
          </p>
        </div>
        <div className="space-y-5 p-5">
          <Field label="Kategori aduan" htmlFor="category" error={state.fieldErrors?.category} required>
            <select
              id="category"
              name="category"
              className={selectClass}
              defaultValue="damage"
              aria-invalid={Boolean(state.fieldErrors?.category)}
              required
            >
              {Object.entries(FEEDBACK_CATEGORIES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Judul aduan" htmlFor="title" error={state.fieldErrors?.title} required>
            <input
              id="title"
              name="title"
              type="text"
              className={inputClass}
              placeholder="Contoh: Ramp sekolah rusak sejak dua minggu"
              maxLength={150}
              aria-invalid={Boolean(state.fieldErrors?.title)}
              required
            />
          </Field>

          <Field
            label="Uraian"
            htmlFor="description"
            hint="Jelaskan kondisi, lokasi, dan dampaknya. Minimal 20 karakter."
            error={state.fieldErrors?.description}
            required
          >
            <textarea
              id="description"
              name="description"
              className={textareaClass}
              placeholder="Tuliskan apa yang Anda temukan, kapan terjadi, dan siapa yang terdampak."
              minLength={20}
              maxLength={2000}
              aria-invalid={Boolean(state.fieldErrors?.description)}
              required
            />
          </Field>

          <Field
            label="Fasilitas terkait"
            htmlFor="facility_id"
            hint={
              facilitiesUnavailable
                ? "Daftar fasilitas tidak dapat dimuat saat ini. Aduan tetap dapat dikirim tanpa fasilitas."
                : "Opsional. Pilih fasilitas jika laporan terkait lokasi tertentu."
            }
            error={state.fieldErrors?.facility_id}
          >
            <select
              id="facility_id"
              name="facility_id"
              className={selectClass}
              defaultValue={defaultFacilityId ? String(defaultFacilityId) : ""}
            >
              <option value="">Tidak terkait fasilitas tertentu</option>
              {Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b, "id"))
                .map(([category, items]) => (
                  <optgroup key={category} label={category}>
                    {items
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name, "id"))
                      .map((facility) => (
                        <option key={facility.id} value={facility.id}>
                          {facility.name}
                          {facility.region ? ` — ${facility.region.name}` : ""}
                        </option>
                      ))}
                  </optgroup>
                ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h2 className="font-display text-sm font-semibold text-text">Data pelapor</h2>
          <p className="mt-0.5 text-[11px] text-muted">Diisi otomatis dari akun Anda, dapat disesuaikan.</p>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <Field label="Nama pelapor" htmlFor="citizen_name" error={state.fieldErrors?.citizen_name} required>
            <input
              id="citizen_name"
              name="citizen_name"
              type="text"
              className={inputClass}
              defaultValue={defaultName}
              aria-invalid={Boolean(state.fieldErrors?.citizen_name)}
              required
            />
          </Field>
          <Field label="Email" htmlFor="citizen_email" error={state.fieldErrors?.citizen_email}>
            <input
              id="citizen_email"
              name="citizen_email"
              type="email"
              className={inputClass}
              defaultValue={defaultEmail}
              aria-invalid={Boolean(state.fieldErrors?.citizen_email)}
            />
          </Field>
          <Field
            label="Tautan foto"
            htmlFor="photo_url"
            hint="Opsional. Tempel tautan foto publik, bukan unggahan file."
            error={state.fieldErrors?.photo_url}
            className="sm:col-span-2"
          >
            <input
              id="photo_url"
              name="photo_url"
              type="url"
              className={inputClass}
              placeholder="https://…"
              aria-invalid={Boolean(state.fieldErrors?.photo_url)}
            />
          </Field>
        </div>
      </section>

      <details className="group rounded-lg border border-border bg-surface">
        <summary className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm font-semibold text-text">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-muted" aria-hidden="true" />
            Koordinat lokasi
            <span className="text-[10px] font-normal text-muted">(opsional)</span>
          </span>
          <span className="text-[10px] text-muted group-open:hidden">Buka</span>
          <span className="hidden text-[10px] text-muted group-open:inline">Tutup</span>
        </summary>
        <div className="space-y-4 border-t border-border p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lintang" htmlFor="latitude" error={state.fieldErrors?.latitude}>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                min={-90}
                max={90}
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                className={inputClass}
                placeholder="-6.200000"
              />
            </Field>
            <Field label="Bujur" htmlFor="longitude" error={state.fieldErrors?.longitude}>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                min={-180}
                max={180}
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                className={inputClass}
                placeholder="106.816666"
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={useCurrentLocation} disabled={locating}>
              {locating ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Crosshair className="size-3.5" aria-hidden="true" />
              )}
              Gunakan lokasi saat ini
            </Button>
            {locationMessage ? <FieldHint>{locationMessage}</FieldHint> : null}
          </div>
        </div>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-md text-[11px] leading-relaxed text-muted">
          Dengan mengirim, Anda menyatakan laporan dapat diverifikasi dan ditindaklanjuti oleh admin.
        </p>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Mengirim aduan…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Kirim aduan
            </>
          )}
        </Button>
      </div>

      <p className="text-[11px] text-muted">
        Ingin melihat aduan sebelumnya?{" "}
        <Link href="/aduan/saya" className="font-semibold text-interactive hover:underline">
          Buka aduan saya
        </Link>
        .
      </p>
    </form>
  );
}
