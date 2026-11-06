# Mobile UI & Auth Flow Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menetapkan mode light sebagai default, mengubah navigasi mobile menjadi sidebar drawer vertikal yang dapat dibuka/tutup dari logo maupun tombol menu, merapikan seluruh teks dan layout card di perangkat mobile, serta mengubah alur registrasi agar redirect ke login alih-alih auto-login.

**Architecture:** 
- Theme: Update `theme-provider.tsx` and inline `ThemeScript` to default to `light` when no storage value exists.
- Mobile Nav: Replace dropdown in `site-header.tsx` with a slide-over mobile sidebar drawer featuring vertical navigation, accessible via both the Logo and the hamburger icon, complete with backdrop, escape key handler, and body scroll lock.
- Responsive Cards: Audit and refine card padding, `min-w-0`, `break-words`, and typography scaling on `stat-card.tsx`, `facility-card.tsx`, `feedback-card.tsx`, and public pages (`tentang`, `layanan-publik`, `lacak`, `page.tsx`).
- Auth Flow: Modify `registerAction` in `actions.ts` to redirect to `/login?registered=1` without setting session cookies, and display a success banner in `login-form.tsx`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, TypeScript.

---

### Task 1: Default Theme Mode Light

**Files:**
- Modify: `frontend/src/components/theme/theme-provider.tsx`
- Modify: `frontend/src/app/layout.tsx`

- [x] Update `readTheme()` in `frontend/src/components/theme/theme-provider.tsx` so default fallback is `"light"` instead of `"system"`.
- [x] Update `ThemeProvider` initial sync store value to `"light"`.
- [x] Update `ThemeScript` inline JS so that if `saved` is empty or invalid, `value` defaults to `"light"` and `dark` is false.
- [x] Verify light theme is active by default when no local storage is present.

---

### Task 2: Mobile Navbar as Vertical Sidebar Drawer (Toggle via Logo & Menu Icon)

**Files:**
- Modify: `frontend/src/components/layout/site-header.tsx`

- [x] Refactor mobile navigation container in `site-header.tsx` to be a fixed slide-over sidebar drawer (`fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 bg-surface border-r border-border shadow-2xl flex flex-col p-5`) with animated backdrop (`fixed inset-0 bg-black/60 backdrop-blur-xs z-40`).
- [x] Connect the Logo in the mobile header so tapping it toggles open/close the mobile sidebar.
- [x] Ensure the hamburger button also toggles open/close the mobile sidebar.
- [x] Inside the sidebar drawer:
  - Header row with Logo and close (`X`) button.
  - Vertical list of navigation links with distinct icons/labels (`Beranda`, `Data & Anggaran`, `Layanan Publik`, `Analitik Wilayah`, `Lacak Aduan`, `Tentang Kami`, `Asisten AI`).
  - Account info or Masuk / Daftar buttons.
  - Footer with ThemeToggle and LanguageSwitcher.
- [x] Add body scroll locking when mobile sidebar is open (`document.body.style.overflow = "hidden"`).
- [x] Ensure Escape key and clicking the backdrop close the sidebar.

---

### Task 3: Ensure Card Typography & Clean Text across Mobile Views

**Files:**
- Modify: `frontend/src/components/ui/stat-card.tsx`
- Modify: `frontend/src/components/facilities/facility-card.tsx`
- Modify: `frontend/src/components/feedback/feedback-card.tsx`
- Modify: `frontend/src/app/(public)/tentang/page.tsx`
- Modify: `frontend/src/app/(public)/layanan-publik/page.tsx`
- Modify: `frontend/src/app/(public)/lacak/page.tsx`

- [x] In `stat-card.tsx`: add `min-w-0 flex-1 break-words` to title and hint containers, adjust mobile padding to `p-4 sm:p-5`.
- [x] In `facility-card.tsx`: add `break-words` and `min-w-0` to facility names and address strings, ensure badges wrap neatly.
- [x] In `feedback-card.tsx`: add `break-words` to title, description, and admin responses; adjust mobile padding to `p-4 sm:p-5`.
- [x] In `tentang/page.tsx`: adjust metric ribbon cards padding `p-3.5 sm:p-5`, font `text-xl sm:text-2xl`, and principle cards padding `p-5 sm:p-7`.
- [x] In `layanan-publik/page.tsx`: add `flex-wrap gap-2` to `ServiceCard` footer so accessible badge and link don't collide on 360px screens.
- [x] In `lacak/page.tsx`: ensure stage timeline labels are formatted with `text-[9px] sm:text-[11px] leading-tight break-words text-center`.

---

### Task 4: Registration Redirect to Login (No Auto-Login)

**Files:**
- Modify: `frontend/src/lib/auth/actions.ts`
- Modify: `frontend/src/app/(auth)/login/page.tsx`
- Modify: `frontend/src/components/auth/login-form.tsx`

- [x] In `frontend/src/lib/auth/actions.ts`: in `registerAction`, remove `setSessionCookie(...)`, remove `revalidatePath(...)`, and redirect to `/login?registered=1`.
- [x] In `frontend/src/app/(auth)/login/page.tsx`: read `registered` from search parameters and pass it to `LoginForm`.
- [x] In `frontend/src/components/auth/login-form.tsx`: receive `registered` prop and render an informative success alert when true: "Pendaftaran berhasil! Silakan masuk dengan akun yang baru Anda buat."

---

### Task 5: Verification & Quality Assurance

- [x] Run `npm run lint` in `frontend/`.
- [x] Run `npm run build` in `frontend/`.
- [x] Verify there are no TypeScript or build regression errors.
- [x] Inspect git diff to ensure changes are surgical and accurate.
