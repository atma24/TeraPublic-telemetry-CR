# Mobile Responsiveness & Performance Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menuntaskan seluruh masalah responsivitas mobile di ponsel: menghilangkan card terpotong setengah, memperbaiki teks yang terpotong/glitch, mengoptimalkan bobot render/performa agar ringan dan cepat, serta merapikan tipografi dan tata letak CTA di layar sempit.

**Architecture:** Menerapkan prinsip `antislop-layoutmobile` (mobile reflow, bukan sekadar desktop yang dikecilkan). Mengatur ulang layout kartu stepper dan ledger agar pas dalam viewport mobile tanpa clipping `overflow-y`, memperbaiki layout grid yang merusak border `divide-y`, mengurangi filter GPU berat (blur-3xl) dan animasi continuous pada mobile, serta merestrukturisasi CTA card agar teks dan tombol tertata rapi.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4, Lucide React, TypeScript.

---

## Global Constraints
- Bahasa kode & commit: English. Bahasa komunikasi: Bahasa Indonesia ringkas.
- Tetap menjaga keaslian konten data, tidak mengubah logika bisnis API atau seeder.
- Verifikasi wajib dijalankan (`npm run lint`, `npm run build`) dengan bukti bebas error sebelum dinyatakan selesai.

---

## Tasks

### Task 1: CSS Base & Typography Scale Fixes (`globals.css`)
**Files:**
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Inspect and adjust `.display-1` & `.display-2` fluid typography**
  Ganti clamp minimum `.display-1` dari `2.75rem` (44px, terlalu besar di layar 360px) menjadi `clamp(1.85rem, 5.2vw, 5.6rem)` agar tidak memaksa teks terpotong di HP.
- [ ] **Step 2: Add global horizontal overflow prevention**
  Tambahkan `overflow-x: clip;` pada `body` agar scroll horizontal liar tidak terjadi di ponsel tanpa merusak `sticky`.
- [ ] **Step 3: Add mobile performance utilities**
  Pastikan animasi float hanya berjalan pada layar `sm:` ke atas untuk menghemat GPU/baterai ponsel.

---

### Task 2: Refactor Civic Journey Stepper (`civic-journey-stepper.tsx`)
**Files:**
- Modify: `frontend/src/components/home/civic-journey-stepper.tsx`

- [ ] **Step 1: Fix Visual Stage container height & overflow on mobile**
  Ubah `min-h-[460px] overflow-hidden` menjadi responsive `min-h-[380px] sm:min-h-[460px] lg:min-h-[480px]`.
- [ ] **Step 2: Fix Stage 1 (Accessibility Inspector)**
  Ubah 3 kartu metrik menjadi compact `grid-cols-3 gap-2 sm:gap-4` dengan padding terukur (`p-2.5 sm:p-4`) sehingga ketiga kartu muat dalam 1 baris tanpa terpotong setengah atau overflow vertikal di ponsel.
- [ ] **Step 3: Fix Stage 2 (APBD Budget Ledger)**
  Di mobile tampilkan ringkasan 3 kota utama (`slice(0, 3)` di mobile, 5 di tablet/desktop) dengan padding compact `p-2.5 sm:p-3` agar tidak terpotong setengah di bagian bawah stage.
- [ ] **Step 4: Fix Stage 3 (Citizen Ticket Simulator)**
  Kompakkan timeline spacing di mobile (`space-y-2 sm:space-y-3`, padding `p-3.5 sm:p-5`) sehingga seluruh alur tiket terlihat utuh tanpa terpotong.
- [ ] **Step 5: Fix Stage 0 (Leaflet Map touch scroll trap)**
  Atur tinggi peta di mobile menjadi `h-[320px] sm:h-[420px] lg:h-full` dengan scroll margin yang aman agar pengguna tidak terjebak saat menggeser layar ke bawah.
- [ ] **Step 6: Fix Stepper Bottom Buttons**
  Perbaiki 2-col tab buttons di mobile agar label panjang seperti "Audit Aksesibilitas" tidak terpotong (`text-[11px] sm:text-xs md:text-sm`).

---

### Task 3: Refactor Reusable Civic CTA Card (`civic-cta-card.tsx`)
**Files:**
- Modify: `frontend/src/components/feedback/civic-cta-card.tsx`

- [ ] **Step 1: Optimize container padding & blur background**
  Ubah padding container dari `p-6` menjadi `p-5 sm:p-8 md:p-10 lg:p-12`. Kurangi ukuran dan blur orbs di mobile (`size-44 blur-xl sm:size-72 sm:blur-3xl`).
- [ ] **Step 2: Clean up CTA heading & copy**
  Ubah heading menjadi `text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-[40px]`.
- [ ] **Step 3: Clean up feature badge list**
  Ubah tata letak badge di mobile menjadi `grid grid-cols-1 sm:flex sm:flex-wrap items-start sm:items-center gap-2.5 sm:gap-x-5` dengan icon `shrink-0` agar tidak wrap berantakan.
- [ ] **Step 4: Mobile-friendly buttons**
  Ubah tombol di mobile menjadi `w-full sm:w-auto` dengan tap target `h-11` yang nyaman dan rapi.
- [ ] **Step 5: Clean up simulated ticket preview**
  Gunakan `flex-wrap items-center justify-between gap-2` pada header tiket, progress bar 3 langkah dengan `grid grid-cols-3 text-center`, dan footer pelacakan yang tidak saling dorong.

---

### Task 4: Fix Landing Page Layout, Grids & Performance (`page.tsx`)
**Files:**
- Modify: `frontend/src/app/(public)/page.tsx`

- [ ] **Step 1: Hero Section typography & Quick Access chips**
  Ubah heading `h1` di mobile agar fluid (`text-3xl sm:text-5xl lg:display-1`), ubah `max-w-[13ch]` menjadi `md:max-w-[14ch]`, ubah chips kategori menjadi `flex flex-wrap items-center gap-1.5` agar tidak terpotong di tepi kanan.
- [ ] **Step 2: Optimize Hero Right Ledger Widget**
  Hapus `divide-x` pada `grid-cols-2` yang merusak border baris kedua di HP, ganti dengan border individual yang presisi. Nonaktifkan `animate-float-soft` di mobile (`sm:animate-float-soft`).
- [ ] **Step 3: Fix Stats Ribbon Banner 2-column grid glitch**
  Hapus `divide-y divide-border/60` di `grid-cols-2`. Ganti dengan kartu mini terpisah di mobile (`rounded-lg border border-border/50 bg-surface/50 p-3 sm:border-0 sm:bg-transparent sm:p-0`).
- [ ] **Step 4: Integrate CivicCtaCard into page.tsx**
  Ganti markup duplikat CTA di section 7 dengan `<CivicCtaCard />` yang sudah dioptimalkan.
- [ ] **Step 5: Fix truncate without min-w-0 on priority ranking list**
  Tambahkan `min-w-0` pada container flex ranking wilayah agar teks fasilitas tidak terdorong keluar kartu.

---

### Task 5: Verification & Quality Assurance
- [ ] **Step 1: Run `npm run lint`**
- [ ] **Step 2: Run `npm run build`**
- [ ] **Step 3: Review git diff**
