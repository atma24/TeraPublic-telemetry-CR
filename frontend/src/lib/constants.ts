import type { UserRole } from "@/types/auth";

export const SITE_NAME = "TeraPublic";
export const TEAM_NAME = "Telemetry-CR";
export const SITE_TAGLINE = "Public Facilities & Accessibility";
export const SITE_DESCRIPTION =
  "Platform data publik untuk memahami persebaran fasilitas, anggaran, dan laporan warga di DKI Jakarta.";

export const NAV_LINKS = [
  { href: "/data", label: "Data Publik" },
  { href: "/layanan-publik", label: "Layanan & Fasilitas" },
  { href: "/insight", label: "Insight" },
  { href: "/tentang", label: "Tentang" },
];

export const PORTAL_LINKS = [
  { href: "/aduan/saya", label: "Aduan Saya" },
  { href: "/aduan/buat", label: "Buat Aduan" },
  { href: "/chatbot", label: "Asisten Data" },
];

export const ADMIN_LINKS = [
  { href: "/admin", label: "Ringkasan", icon: "dashboard" },
  { href: "/admin/fasilitas", label: "Fasilitas", icon: "building" },
  { href: "/admin/anggaran", label: "Anggaran", icon: "wallet" },
  { href: "/admin/aduan", label: "Aduan Warga", icon: "message" },
  { href: "/admin/wilayah", label: "Wilayah", icon: "map" },
] as const;

export const FACILITY_CATEGORIES = [
  { slug: "sekolah", label: "Sekolah" },
  { slug: "pasar-tradisional", label: "Pasar Tradisional" },
] as const;

export const FACILITY_STATUS = {
  operational: { label: "Beroperasi", tone: "success" },
  renovation: { label: "Renovasi", tone: "warning" },
  closed: { label: "Tutup", tone: "danger" },
} as const;

export const FEEDBACK_CATEGORIES = {
  damage: "Kerusakan fasilitas",
  disability_access: "Akses disabilitas",
  project_delay: "Keterlambatan proyek",
  cleanliness: "Kebersihan",
} as const;

export const FEEDBACK_STATUS = {
  submitted: { label: "Diajukan", tone: "neutral" },
  verified: { label: "Terverifikasi", tone: "info" },
  in_review: { label: "Ditindaklanjuti", tone: "warning" },
  resolved: { label: "Selesai", tone: "success" },
  rejected: { label: "Ditolak", tone: "danger" },
} as const;

export const PROJECT_STATUS = {
  planning: { label: "Perencanaan", tone: "neutral" },
  procurement: { label: "Pengadaan", tone: "info" },
  tender: { label: "Tender", tone: "info" },
  in_progress: { label: "Dikerjakan", tone: "warning" },
  completed: { label: "Selesai", tone: "success" },
} as const;

export const RISK_LEVEL = {
  HIGH_RISK: { label: "Risiko tinggi", tone: "danger" },
  MEDIUM_RISK: { label: "Risiko sedang", tone: "warning" },
  LOW_RISK: { label: "Risiko rendah", tone: "success" },
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  Sekolah: "Sekolah",
  "Pasar Tradisional": "Pasar Tradisional",
  sekolah: "Sekolah",
  "pasar-tradisional": "Pasar Tradisional",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  citizen: "Warga",
};

export const DATA_SOURCES = [
  "BPS Provinsi DKI Jakarta 2024",
  "Dapodik Kemendikbudristek",
  "Perumda Pasar Jaya",
  "APBD DKI Jakarta 2024–2026",
];
