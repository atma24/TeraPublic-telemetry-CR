import type { Metadata, Viewport } from "next";

import { LanguageProvider } from "@/components/i18n/language-provider";
import { ThemeProvider, ThemeScript } from "@/components/theme/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, TEAM_NAME } from "@/lib/constants";
import "leaflet/dist/leaflet.css";
import "./globals.css";



const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "TeraPublic",
    "fasilitas publik",
    "transparansi anggaran",
    "DKI Jakarta",
    "data terbuka",
    "sekolah",
    "pasar",
    "aksesibilitas",
  ],
  authors: [{ name: SITE_NAME }, { name: TEAM_NAME }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/brand/logo-horizontal.png", width: 1600, height: 510, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/brand/logo-horizontal.png"],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#081724" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Plus+Jakarta+Sans:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <ThemeScript />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <a href="#main-content" className="skip-link">
              Lewati ke konten utama
            </a>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
