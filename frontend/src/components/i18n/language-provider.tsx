"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { translations, type Language, type TranslationKey } from "@/lib/i18n/translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const STORAGE_KEY = "tp-locale";
const LANGUAGE_EVENT = "tp-locale-change";
const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "id";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "id" || stored === "en") return stored;
    const match = document.cookie.match(/tp-locale=(id|en)/);
    if (match?.[1]) return match[1] as Language;
  } catch {
    return "id";
  }
  return "id";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_EVENT, callback);
  };
}

function getSnapshot(): Language {
  return getInitialLanguage();
}

function getServerSnapshot(): Language {
  return "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback(
    (nextLang: Language) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, nextLang);
        document.cookie = `${STORAGE_KEY}=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        void 0;
      }
      document.documentElement.lang = nextLang;
      window.dispatchEvent(new Event(LANGUAGE_EVENT));
      router.refresh();
    },
    [router],
  );

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const dict = translations[language] ?? translations.id;
      const val = (dict as Record<string, string>)[key];
      return val ?? fallback ?? key;
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage harus dipakai di dalam LanguageProvider.");
  }
  return context;
}
