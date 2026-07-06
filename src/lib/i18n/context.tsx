"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import uk from "./uk.json";
import en from "./en.json";

type Locale = "uk" | "en";

const messages: Record<Locale, any> = { uk, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "uk",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uk");

  useEffect(() => {
    const stored = localStorage.getItem("finda_locale") as Locale;
    if (stored && (stored === "uk" || stored === "en")) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("finda_locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: any = messages[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    if (typeof value !== "string") return key;
    if (params) {
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(`{${k}}`, String(v)),
        value
      );
    }
    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
