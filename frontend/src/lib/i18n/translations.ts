export type Language = "id" | "en";

export const translations = {
  id: {
    // Navigation & Header
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
    "nav.register": "Daftar",
    "nav.logout": "Keluar",
    "nav.public_site": "Situs publik",
    "nav.main_menu": "Menu Utama",
    "nav.citizen_account": "Akun Warga",
    "nav.settings": "Pengaturan",

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

    // Hero Section
    "hero.badge": "Data Terbuka · DKI Jakarta",
    "hero.title_p1": "Fasilitas publik yang ",
    "hero.title_highlight": "terlihat.",
    "hero.title_p2": " Anggaran yang bisa ditelusuri.",
    "hero.desc":
      "TeraPublic menyatukan data fasilitas pendidikan dan pasar, proyek anggaran, serta suara warga dalam satu ruang baca yang bisa diperiksa.",
    "hero.explore": "Jelajahi data",
    "hero.services": "Lihat layanan",
    "hero.quick_access": "Akses Cepat:",
    "hero.schools": "Sekolah",
    "hero.markets": "Pasar Tradisional",
    "hero.budget_projects": "1.731 Proyek APBD",
    "hero.district_clusters": "Klaster Wilayah",
    "hero.trust_sources": "Sumber data terverifikasi (APBD & BPS)",
    "hero.trust_participation": "Partisipasi warga transparan",

    // Hero Right Ledger Card
    "ledger.title": "Buku Besar Publik",
    "ledger.sync": "Terakhir sinkronisasi",
    "ledger.monitored_facilities": "Fasilitas Dipantau",
    "ledger.total_budget": "Total APBD Terdata",
    "ledger.mapped_districts": "Kecamatan Terpetakan",
    "ledger.avg_inclusion": "Indeks Inklusi Rata-rata",
    "ledger.verified_pipeline": "Jalur Terverifikasi",
    "ledger.audit_cta": "Cek audit fasilitas lengkap",

    // Stats Ribbon
    "stats.facilities_title": "Fasilitas Terdata",
    "stats.facilities_desc": "Sekolah & pasar terpetakan",
    "stats.districts_title": "Wilayah DKI",
    "stats.districts_desc": "Cakupan seluruh kecamatan",
    "stats.budget_title": "Alokasi APBD",
    "stats.budget_desc": "Alokasi infrastruktur",
    "stats.reports_title": "Aduan Ditangani",
    "stats.reports_desc": "Suara warga terverifikasi",

    // Three Reading Rooms
    "rooms.eyebrow": "Tiga ruang baca",
    "rooms.title": "Satu platform, tiga sudut pandang",
    "rooms.r1_title": "Fasilitas & akses",
    "rooms.r1_desc":
      "Telusuri sekolah dan pasar tradisional, lalu lihat apakah bangunannya ramah bagi pengguna kursi roda dan disabilitas.",
    "rooms.r1_action": "Buka direktori",
    "rooms.r2_title": "Anggaran & proyek",
    "rooms.r2_desc":
      "Bandingkan alokasi dengan realisasi, lacak proyek per wilayah, dan temukan daerah yang perlu perhatian lebih awal.",
    "rooms.r2_action": "Telusuri anggaran",
    "rooms.r3_title": "Suara warga",
    "rooms.r3_desc":
      "Laporkan kerusakan atau hambatan akses. Setiap laporan mendapat kode pelacakan dan ruang tindak lanjut.",
    "rooms.r3_action": "Kirim aduan",

    // Snapshot Section
    "snapshot.eyebrow": "Potret hari ini",
    "snapshot.title": "Yang bisa dibaca dari data",
    "snapshot.desc":
      "Angka di bawah berasal langsung dari layanan TeraPublic. Gunakan sebagai pintu masuk, lalu periksa detail per wilayah dan per proyek.",
    "snapshot.schools": "Sekolah",
    "snapshot.markets": "Pasar",
    "snapshot.districts": "Kecamatan",
    "snapshot.projects": "Paket Proyek",
    "snapshot.all_districts": "Cakupan seluruh DKI",
    "snapshot.total_allocated": "Total Alokasi APBD",
    "snapshot.inclusion_rate": "Tingkat Inklusi Fasilitas",
    "snapshot.reported_complaints": "Aduan Warga Terverifikasi",

    // Priority Clusters Section
    "clusters.eyebrow": "Klaster wilayah",
    "clusters.title": "Prioritas intervensi berbasis data",
    "clusters.desc":
      "K-Means mengelompokkan 44 kecamatan berdasarkan rasio fasilitas per kapita, dukungan akses disabilitas, dan alokasi anggaran.",
    "clusters.card_title": "Kecamatan Prioritas Intervensi",
    "clusters.card_subtitle": "Berdasarkan defisit rasio fasilitas publik",
    "clusters.ratio_label": "fasilitas per 10rb jiwa",
    "clusters.view_analytics": "Buka peta & analitik lengkap",

    // Regional Highlights
    "regional.eyebrow": "Sorotan per wilayah",
    "regional.title": "Realisasi anggaran di 6 kota/kabupaten",
    "regional.districts_count": "Kecamatan",
    "regional.facilities": "Fasilitas",
    "regional.budget_allocated": "Alokasi APBD",
    "regional.realization_rate": "Tingkat Realisasi",
    "regional.budget_realized": "Realisasi:",
    "regional.view_details": "Lihat detail",

    // FAQ Section
    "faq.eyebrow": "FAQ",
    "faq.title": "Pertanyaan yang sering diajukan",
    "faq.desc": "Jawaban seputar independensi data, validitas laporan, dan transparansi sistem.",
    "faq.q1": "Dari mana asal data fasilitas dan anggaran di TeraPublic?",
    "faq.a1":
      "Seluruh data fasilitas bersumber dari direktori resmi Kemendikbudristek dan Perumda Pasar Jaya, sedangkan data anggaran disinkronkan langsung dari dokumen APBD DKI Jakarta yang dipublikasikan secara terbuka.",
    "faq.q2": "Apakah laporan aduan warga langsung ditindaklanjuti oleh pemerintah?",
    "faq.a2":
      "TeraPublic memverifikasi laporan awal dan memetakan kode unik pelacakan. Laporan yang valid diagregasikan ke dalam data terbuka wilayah serta diteruskan ke dinas terkait untuk tindak lanjut lapangan.",
    "faq.q3": "Bagaimana algoritma K-Means menentukan wilayah prioritas?",
    "faq.a3":
      "Algoritma memproses 5 variabel: kepadatan penduduk, rasio fasilitas per 10.000 jiwa, ketersediaan fasilitas ramah disabilitas, alokasi anggaran, dan tingkat realisasi proyek untuk mengelompokkan kecamatan ke dalam 3 tier urgensi.",
    "faq.q4": "Apakah data warga pelapor dijamin kerahasiaannya?",
    "faq.a4":
      "Ya. TeraPublic menerapkan enkripsi pada data pribadi pelapor. Di ruang publik, laporan hanya menampilkan inisial atau status anonim beserta ringkasan temuan infrastruktur fisik.",

    // Civic CTA Card
    "cta.badge": "Aduan Warga Transparan",
    "cta.title": "Punya temuan di sekitar Anda?",
    "cta.highlight": "Jadikan data.",
    "cta.desc":
      "Setiap laporan yang masuk diverifikasi dan diagregasikan ke dalam data terbuka. Tindak lanjut perbaikan fasilitas bisa dipantau bersama tanpa birokrasi berbelit.",
    "cta.btn_report": "Kirim aduan warga",
    "cta.btn_assistant": "Tanya asisten data",
    "cta.feat_bureaucracy": "Tanpa birokrasi berbelit",
    "cta.feat_privacy": "Privasi identitas terlindungi",
    "cta.feat_tracking": "Pantau langsung status penanganan",
    "cta.ticket_title": "Simulasi Tiket Warga",
    "cta.ticket_sample_title": "Ramp Rusak di Halte & Akses Trotoar",
    "cta.ticket_sample_meta": "Kecamatan Gambir · Dilaporkan 2 jam lalu",
    "cta.ticket_received": "Diterima",
    "cta.ticket_verified": "Verifikasi",
    "cta.ticket_followup": "Tindak Lanjut",
    "cta.ticket_verified_badge": "Laporan fisik terverifikasi",
    "cta.ticket_resolved_status": "Selesai",

    // Stepper
    "stepper.eyebrow": "Alur interaktif warga",
    "stepper.title": "Empat cara menguji keterbukaan data Jakarta",
    "stepper.desc":
      "Pilih tahapan di bawah untuk melihat bagaimana data fasilitas, anggaran APBD, dan laporan warga saling terhubung menjadi satu sistem yang dapat dipertanggungjawabkan.",
    "stepper.step1_label": "Jelajahi Peta",
    "stepper.step1_desc": "Temukan sekolah dan pasar di 44 kecamatan.",
    "stepper.step2_label": "Audit Aksesibilitas",
    "stepper.step2_desc": "Periksa atribut inklusi fisik fasilitas publik.",
    "stepper.step3_label": "Buku Besar APBD",
    "stepper.step3_desc": "Pantau alokasi vs realisasi anggaran proyek.",
    "stepper.step4_label": "Simulasi Aduan",
    "stepper.step4_desc": "Kirim temuan lapangan dan lacak progresnya.",

    // Footer
    "footer.desc":
      "Ruang baca terbuka untuk fasilitas publik, anggaran, dan suara warga Jakarta. Setiap angka ditautkan ke sumber data yang dapat diperiksa.",
    "footer.explore_title": "Jelajahi",
    "footer.participation_title": "Partisipasi",
    "footer.sources_title": "Sumber Data",
    "footer.facilities_directory": "Direktori fasilitas",
    "footer.submit_report": "Buat aduan warga",
    "footer.track_reports": "Pantau aduan saya",
    "footer.track_code": "Lacak dengan kode",
    "footer.ask_assistant": "Tanya asisten data",
    "footer.login": "Masuk ke akun",
    "footer.copyright": "Hak Cipta Dilindungi.",
  },
  en: {
    // Navigation & Header
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
    "nav.register": "Register",
    "nav.logout": "Log Out",
    "nav.public_site": "Public site",
    "nav.main_menu": "Main Menu",
    "nav.citizen_account": "Citizen Account",
    "nav.settings": "Settings",

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

    // Hero Section
    "hero.badge": "Open Data · DKI Jakarta",
    "hero.title_p1": "Public facilities that are ",
    "hero.title_highlight": "visible.",
    "hero.title_p2": " Budgets that can be traced.",
    "hero.desc":
      "TeraPublic unifies educational and market facility data, budget projects, and citizen voices in one transparent portal.",
    "hero.explore": "Explore data",
    "hero.services": "View services",
    "hero.quick_access": "Quick Access:",
    "hero.schools": "Schools",
    "hero.markets": "Traditional Markets",
    "hero.budget_projects": "1,731 APBD Projects",
    "hero.district_clusters": "District Clusters",
    "hero.trust_sources": "Verified data sources (APBD & BPS)",
    "hero.trust_participation": "Transparent citizen participation",

    // Hero Right Ledger Card
    "ledger.title": "Public Ledger",
    "ledger.sync": "Last synchronized",
    "ledger.monitored_facilities": "Monitored Facilities",
    "ledger.total_budget": "Recorded APBD Budget",
    "ledger.mapped_districts": "Mapped Districts",
    "ledger.avg_inclusion": "Avg Inclusion Index",
    "ledger.verified_pipeline": "Verified Pipeline",
    "ledger.audit_cta": "View full facility audit",

    // Stats Ribbon
    "stats.facilities_title": "Recorded Facilities",
    "stats.facilities_desc": "Mapped schools & markets",
    "stats.districts_title": "DKI Districts",
    "stats.districts_desc": "Covering all districts",
    "stats.budget_title": "APBD Allocation",
    "stats.budget_desc": "Infrastructure allocation",
    "stats.reports_title": "Reports Handled",
    "stats.reports_desc": "Verified citizen reports",

    // Three Reading Rooms
    "rooms.eyebrow": "Three reading rooms",
    "rooms.title": "One platform, three perspectives",
    "rooms.r1_title": "Facilities & access",
    "rooms.r1_desc":
      "Browse schools and traditional markets, and verify whether buildings accommodate wheelchair users and people with disabilities.",
    "rooms.r1_action": "Open directory",
    "rooms.r2_title": "Budgets & projects",
    "rooms.r2_desc":
      "Compare allocations with expenditures, track projects by district, and identify areas requiring early attention.",
    "rooms.r2_action": "Explore budget",
    "rooms.r3_title": "Citizen voices",
    "rooms.r3_desc":
      "Report physical damage or accessibility obstacles. Every submission receives a tracking code and follow-up timeline.",
    "rooms.r3_action": "Submit report",

    // Snapshot Section
    "snapshot.eyebrow": "Today's snapshot",
    "snapshot.title": "Insights from the data",
    "snapshot.desc":
      "The numbers below reflect verified TeraPublic services. Use them as an entry point, then explore district and project breakdowns.",
    "snapshot.schools": "Schools",
    "snapshot.markets": "Markets",
    "snapshot.districts": "Districts",
    "snapshot.projects": "Project Packages",
    "snapshot.all_districts": "Covering all of DKI",
    "snapshot.total_allocated": "Total APBD Allocation",
    "snapshot.inclusion_rate": "Facility Inclusion Rate",
    "snapshot.reported_complaints": "Verified Citizen Reports",

    // Priority Clusters Section
    "clusters.eyebrow": "District clusters",
    "clusters.title": "Data-driven intervention priorities",
    "clusters.desc":
      "K-Means clusters all 44 districts based on per-capita facility ratios, disability access support, and budget allocations.",
    "clusters.card_title": "Priority Districts for Intervention",
    "clusters.card_subtitle": "Ranked by public facility ratio deficit",
    "clusters.ratio_label": "facilities per 10k residents",
    "clusters.view_analytics": "Open map & full analytics",

    // Regional Highlights
    "regional.eyebrow": "Regional highlights",
    "regional.title": "Budget execution across 6 administrative areas",
    "regional.districts_count": "Districts",
    "regional.facilities": "Facilities",
    "regional.budget_allocated": "APBD Allocation",
    "regional.realization_rate": "Execution Rate",
    "regional.budget_realized": "Executed:",
    "regional.view_details": "View details",

    // FAQ Section
    "faq.eyebrow": "FAQ",
    "faq.title": "Frequently asked questions",
    "faq.desc": "Answers regarding data independence, report validation, and system transparency.",
    "faq.q1": "Where do the facility and budget data in TeraPublic come from?",
    "faq.a1":
      "All facility data is sourced from official directories of the Ministry of Education and Perumda Pasar Jaya, while budget records are synchronized directly from openly published DKI Jakarta APBD documents.",
    "faq.q2": "Are citizen reports directly addressed by the government?",
    "faq.a2":
      "TeraPublic validates initial reports and assigns a unique tracking code. Validated submissions are aggregated into regional open data and routed to relevant agencies for field follow-up.",
    "faq.q3": "How does the K-Means algorithm determine priority districts?",
    "faq.a3":
      "The algorithm analyzes 5 variables: population density, facility ratios per 10,000 residents, disability inclusion support, budget allocations, and execution rates to classify districts into 3 urgency tiers.",
    "faq.q4": "Is the personal identity of reporting citizens kept confidential?",
    "faq.a4":
      "Yes. TeraPublic encrypts personal reporter data. Public dashboards display only initials or anonymous status alongside physical infrastructure findings.",

    // Civic CTA Card
    "cta.badge": "Transparent Citizen Feedback",
    "cta.title": "Have findings in your neighborhood?",
    "cta.highlight": "Turn it into data.",
    "cta.desc":
      "Every report is verified and aggregated into open public data. Follow up on repairs and help build more accountable public services.",
    "cta.btn_report": "Submit citizen report",
    "cta.btn_assistant": "Ask data assistant",
    "cta.feat_bureaucracy": "No convoluted bureaucracy",
    "cta.feat_privacy": "Reporter identity protected",
    "cta.feat_tracking": "Real-time tracking of repair status",
    "cta.ticket_title": "Citizen Ticket Simulation",
    "cta.ticket_sample_title": "Damaged Ramp at Bus Stop & Sidewalk Access",
    "cta.ticket_sample_meta": "Gambir District · Reported 2 hours ago",
    "cta.ticket_received": "Received",
    "cta.ticket_verified": "Verification",
    "cta.ticket_followup": "Follow-Up",
    "cta.ticket_verified_badge": "Verified physical infrastructure report",
    "cta.ticket_resolved_status": "Resolved",

    // Stepper
    "stepper.eyebrow": "Interactive Citizen Flow",
    "stepper.title": "Four ways to examine Jakarta's open data",
    "stepper.desc":
      "Select the steps below to see how facility data, APBD budgets, and citizen feedback connect into one accountable system.",
    "stepper.step1_label": "Explore Map",
    "stepper.step1_desc": "Find schools & markets across 44 districts.",
    "stepper.step2_label": "Accessibility Audit",
    "stepper.step2_desc": "Check physical inclusion attributes of public facilities.",
    "stepper.step3_label": "APBD Budget Ledger",
    "stepper.step3_desc": "Track allocation vs execution of infrastructure projects.",
    "stepper.step4_label": "Citizen Report",
    "stepper.step4_desc": "Submit field findings and track their progress.",

    // Footer
    "footer.desc":
      "An open reading room for Jakarta's public facilities, budgets, and citizen voices. Every figure is linked to verifiable sources.",
    "footer.explore_title": "Explore",
    "footer.participation_title": "Participation",
    "footer.sources_title": "Official Sources",
    "footer.facilities_directory": "Facility directory",
    "footer.submit_report": "Submit citizen report",
    "footer.track_reports": "Track my reports",
    "footer.track_code": "Track with code",
    "footer.ask_assistant": "Ask data assistant",
    "footer.login": "Sign in to account",
    "footer.copyright": "All Rights Reserved.",
  },
} as const;

export type TranslationKey = keyof typeof translations.id;
