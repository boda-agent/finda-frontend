"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1">
      {[
        { code: "uk" as const, label: "🇺🇦", name: "Українська" },
        { code: "en" as const, label: "🇬🇧", name: "English" },
      ].map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            locale === lang.code
              ? "bg-[var(--accent-light)] text-[var(--accent)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]"
          }`}
          title={lang.name}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
