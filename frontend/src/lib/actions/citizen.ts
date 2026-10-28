"use server";

import { revalidatePath } from "next/cache";

import { askAssistant, createFeedback } from "@/lib/api/citizen";
import { ApiError } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import type { AssistantActionResult, FeedbackActionState } from "@/types/actions";
import type { CitizenFeedback } from "@/types/public";

const FEEDBACK_CATEGORIES = new Set<CitizenFeedback["category"]>([
  "damage",
  "disability_access",
  "project_delay",
  "cleanliness",
]);

function value(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function optionalCoordinate(input: string): number | undefined {
  if (!input) return undefined;
  const value = Number(input);
  return Number.isFinite(value) ? value : undefined;
}

function mapFieldErrors(error: ApiError): Record<string, string> | undefined {
  if (!error.errors) return undefined;
  return Object.fromEntries(
    Object.entries(error.errors).map(([field, messages]) => [field, messages[0] ?? "Nilai tidak valid."]),
  );
}

export async function createFeedbackAction(
  _previousState: FeedbackActionState,
  formData: FormData,
): Promise<FeedbackActionState> {
  const session = await requireSession("/aduan/buat");

  const title = value(formData, "title");
  const description = value(formData, "description");
  const category = value(formData, "category") as CitizenFeedback["category"];
  const facilityIdRaw = value(formData, "facility_id");
  const citizenName = value(formData, "citizen_name") || session.user.name;
  const citizenEmail = value(formData, "citizen_email") || session.user.email;
  const photoUrl = value(formData, "photo_url");
  const latitude = optionalCoordinate(value(formData, "latitude"));
  const longitude = optionalCoordinate(value(formData, "longitude"));

  const fieldErrors: Record<string, string> = {};
  if (title.length < 5) fieldErrors.title = "Judul minimal 5 karakter.";
  if (title.length > 150) fieldErrors.title = "Judul maksimal 150 karakter.";
  if (description.length < 20) fieldErrors.description = "Uraian minimal 20 karakter.";
  if (!FEEDBACK_CATEGORIES.has(category)) fieldErrors.category = "Pilih kategori aduan.";
  if (!citizenName) fieldErrors.citizen_name = "Nama pelapor wajib diisi.";
  if (citizenEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(citizenEmail)) {
    fieldErrors.citizen_email = "Format email tidak valid.";
  }
  if (photoUrl && !/^https?:\/\//i.test(photoUrl)) {
    fieldErrors.photo_url = "Tautan foto harus diawali http:// atau https://.";
  }
  if ((latitude !== undefined && longitude === undefined) || (latitude === undefined && longitude !== undefined)) {
    fieldErrors.latitude = "Isi lintang dan bujur sekaligus, atau kosongkan keduanya.";
  }
  if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
    fieldErrors.latitude = "Lintang harus berada di antara -90 dan 90.";
  }
  if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
    fieldErrors.longitude = "Bujur harus berada di antara -180 dan 180.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Periksa kembali data aduan Anda.", fieldErrors };
  }

  try {
    const response = await createFeedback(session.token, {
      facility_id: facilityIdRaw ? Number(facilityIdRaw) : null,
      citizen_name: citizenName,
      citizen_email: citizenEmail || undefined,
      title,
      description,
      category,
      photo_url: photoUrl || undefined,
      latitude,
      longitude,
    });

    revalidatePath("/aduan/saya");
    revalidatePath("/admin/aduan");

    return {
      ok: true,
      message: response.message,
      trackingCode: response.data.tracking_code,
      feedbackId: response.data.id,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message,
        fieldErrors: mapFieldErrors(error),
      };
    }
    throw error;
  }
}

export async function askAssistantAction(message: string): Promise<AssistantActionResult> {
  const session = await requireSession("/chatbot");
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return { ok: false, message: "Tulis pertanyaan terlebih dahulu." };
  }
  if (cleanMessage.length > 1000) {
    return { ok: false, message: "Pertanyaan maksimal 1.000 karakter." };
  }

  try {
    const response = await askAssistant(session.token, cleanMessage);
    return {
      ok: true,
      answer: response.answer,
      citations: response.citations,
      matchedRegion: response.matched_region,
      source: response.source,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }
}
