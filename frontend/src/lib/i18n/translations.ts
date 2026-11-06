export type Language = "id" | "en";

export const translations = {
  id: {
    // Navigation
    "nav.home": "Beranda",
    "nav.data": "Data Publik",
    "nav.services": "Layanan & Fasilitas",
    "nav.analytics": "Analitik",
    "nav.about": "Tentang",
    "nav.my_feedback": "Aduan Saya",
    "nav.create_feedback": "Buat Aduan",
    "nav.assistant": "Asisten Data",
    "nav.admin": "Panel Admin",
    "nav.login": "Masuk",
    "nav.logout": "Keluar",
    "nav.public_site": "Situs publik",

    // Language switcher
    "lang.select": "Pilih Bahasa",
    "lang.id": "Bahasa Indonesia",
    "lang.en": "English",
    "lang.switch_label": "Ganti bahasa",
    "lang.toast_title": "Bahasa diubah",
    "lang.toast_desc": "Bahasa Indonesia aktif",

    // Theme & accessibility
    "theme.toggle": "Ganti tema",
    "menu.open": "Buka menu",
    "menu.close": "Tutup menu",
    "a11y.skip_to_content": "Lewati ke konten utama",

    // Hero
    "hero.badge": "Data Terbuka · DKI Jakarta",
    "hero.title_p1": "Fasilitas publik yang ",
    "hero.title_highlight": "terlihat.",
    "hero.title_p2": " Anggaran yang bisa ditelusuri.",
    "hero.desc":
      "TeraPublic menyatukan data fasilitas pendidikan dan pasar, proyek anggaran, serta suara warga dalam satu ruang baca yang bisa diperiksa.",
    "hero.explore": "Jelajahi data",
    "hero.file_report": "Buat aduan warga",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.data": "Public Data",
    "nav.services": "Services & Facilities",
    "nav.analytics": "Analytics",
    "nav.about": "About",
    "nav.my_feedback": "My Reports",
    "nav.create_feedback": "Submit Report",
    "nav.assistant": "Data Assistant",
    "nav.admin": "Admin Panel",
    "nav.login": "Sign In",
    "nav.logout": "Log Out",
    "nav.public_site": "Public site",

    // Language switcher
    "lang.select": "Select Language",
    "lang.id": "Bahasa Indonesia",
    "lang.en": "English",
    "lang.switch_label": "Switch language",
    "lang.toast_title": "Language updated",
    "lang.toast_desc": "English is now active",

    // Theme & accessibility
    "theme.toggle": "Toggle theme",
    "menu.open": "Open menu",
    "menu.close": "Close menu",
    "a11y.skip_to_content": "Skip to main content",

    // Hero
    "hero.badge": "Open Data · DKI Jakarta",
    "hero.title_p1": "Public facilities that are ",
    "hero.title_highlight": "visible.",
    "hero.title_p2": " Budgets that can be traced.",
    "hero.desc":
      "TeraPublic unifies educational and market facility data, budget projects, and citizen voices in one transparent portal.",
    "hero.explore": "Explore data",
    "hero.file_report": "Submit citizen report",
  },
} as const;

export type TranslationKey = keyof typeof translations.id;
