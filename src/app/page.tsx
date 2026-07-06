"use client";

import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import ServicesGrid from "@/components/search/ServicesGrid";
import SpecialistCarousel from "@/components/master/SpecialistCarousel";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] p-8 md:p-12 mb-10">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-72 h-72 bg-[var(--accent)] rounded-full blur-[100px]" />
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-[var(--accent)] rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[var(--accent-light)] rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full pulse-dot" />
              <span className="text-xs text-[var(--accent-dark)] font-medium">{t("home.hero_badge", { count: 150 })}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text)] leading-[1.1] tracking-tight mb-4">
              {t("home.hero_title")}
              <span className="block text-[var(--accent)]">{t("home.hero_subtitle")}</span>
            </h1>
            <p className="text-sm md:text-base text-[var(--text-secondary)] mb-8 leading-relaxed max-w-md">
              {t("home.hero_description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/catalog" className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-[var(--accent-dark)] transition-all">
                {t("home.cta_find")}
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-[var(--bg-elevated)] text-[var(--text)] font-medium text-sm px-6 py-3.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                {t("home.cta_become")}
              </Link>
            </div>
          </div>
          <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3">
            {[
              { num: "150+", label: t("home.stats_masters") },
              { num: "8", label: t("home.stats_countries") },
              { num: "4.8", label: t("home.stats_rating") },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-5 py-3 text-center min-w-[100px]">
                <div className="text-xl font-bold text-[var(--text)]">{s.num}</div>
                <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{t("home.categories_title")}</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{t("home.categories_subtitle")}</p>
            </div>
            <Link href="/catalog" className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors">
              {t("home.categories_all")}
            </Link>
          </div>
          <ServicesGrid />
        </section>

        {/* Top Masters */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{t("home.top_masters")}</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{t("home.top_masters_subtitle")}</p>
            </div>
            <Link href="/catalog" className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors">
              {t("home.top_masters_all")}
            </Link>
          </div>
          <SpecialistCarousel />
        </section>

        {/* Language Banner */}
        <section className="mb-10 relative overflow-hidden rounded-2xl bg-[var(--accent-light)] border border-[var(--accent)]/20 p-6 md:p-8">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-[var(--text)] mb-2">{t("home.language_title")}</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-md">
              {t("home.language_description")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["🇺🇦 Українська", "🇬🇧 English", "🇷🇺 Русский", "🇵🇱 Polski", "🇩🇪 Deutsch", "🇫🇷 Français", "🇮🇱 עברית", "🇹🇷 Türkçe"].map((lang) => (
                <Link key={lang} href="/catalog" className="text-xs font-medium bg-white text-[var(--text)] py-2 px-4 rounded-full hover:bg-[var(--accent)] hover:text-white transition-all border border-[var(--border)]">
                  {lang}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[var(--text)] mb-6 text-center">{t("home.how_it_works")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🔍", title: t("home.step_find"), desc: t("home.step_find_desc") },
              { icon: "💬", title: t("home.step_contact"), desc: t("home.step_contact_desc") },
              { icon: "✨", title: t("home.step_enjoy"), desc: t("home.step_enjoy_desc") },
            ].map((step, i) => (
              <div key={i} className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 text-center card-hover">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider mb-2">Крок {i + 1}</div>
                <h3 className="font-bold text-[var(--text)] mb-1">{step.title}</h3>
                <p className="text-xs text-[var(--text-tertiary)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
