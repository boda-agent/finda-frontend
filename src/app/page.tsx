"use client";

import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import ServicesGrid from "@/components/search/ServicesGrid";
import SpecialistCarousel from "@/components/master/SpecialistCarousel";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Greeting */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">✨</span>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Доброго ранку!
          </p>
        </div>

        {/* Hero section — style from first draft, added to top */}
        <div className="mb-8">
          <h1 className="text-[32px] md:text-[42px] font-extrabold leading-[1.1] tracking-tight mb-3">
            Знайди beauty-майстра,{" "}
            <span className="text-[var(--accent-dark)]">
              який говорить твоєю мовою
            </span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed mb-5">
            Тисячі майстрів поруч із тобою. Шукай за мовою, послугою та
            локацією. Напиши майстру та домовся про візит.
          </p>

          {/* Search */}
          <Link href="/catalog">
            <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3.5 transition-shadow hover:shadow-sm cursor-pointer">
              <span className="text-lg opacity-50">🔍</span>
              <span className="text-sm text-[var(--text-tertiary)] flex-1">
                Що ви шукаєте?
              </span>
              <span className="text-xs font-semibold bg-[var(--accent)] text-[var(--text)] px-4 py-1.5 rounded-lg">
                Знайти
              </span>
            </div>
          </Link>
        </div>

        {/* Popular Services */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Популярні послуги та країни
            </h2>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-[var(--accent-dark)]"
            >
              Всі
            </Link>
          </div>
          <ServicesGrid />
        </section>

        {/* Recommended */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Рекомендовано для вас
            </h2>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-[var(--accent-dark)]"
            >
              Всі
            </Link>
          </div>
          <SpecialistCarousel />
        </section>

        {/* Language filter prompt */}
        <section className="mb-8 bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent)]/40 rounded-2xl p-5">
          <h3 className="text-base font-bold mb-1.5">
            🗣️ Оберіть мову майстра
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Знаходьте спеціалістів, які говорять вашою мовою
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Українська",
              "Англійська",
              "Узбецька",
              "Вірменська",
              "Польська",
            ].map((lang) => (
              <span
                key={lang}
                className="text-xs font-medium bg-white py-1.5 px-3 rounded-full border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition-colors"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
