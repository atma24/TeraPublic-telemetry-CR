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

import { translations, type Language, type TranslationKey } from "@/lib/i18n/translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const STORAGE_KEY = "tp-locale";
const LANGUAGE_EVENT = "tp-locale-change";
const LanguageContext = createContext<LanguageContextValue | null>(null);

function readLanguage(): Language {
  if (typeof window === "undefined") return "id";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "id" || stored === "en") return stored;
  } catch {
    return "id";
  }
  return "id";
}

function subscribeLanguage(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LANGUAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LANGUAGE_EVENT, callback);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribeLanguage, readLanguage, () => "id" as Language);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((nextLang: Language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLang);
      document.cookie = `${STORAGE_KEY}=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      void 0;
    }
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  }, []);

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
