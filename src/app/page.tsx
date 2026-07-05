"use client";

import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import ServicesGrid from "@/components/search/ServicesGrid";
import SpecialistCarousel from "@/components/master/SpecialistCarousel";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f0f1a] via-[#1a1a3e] to-[#2d1b69] p-8 md:p-12 mb-10">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500 rounded-full blur-[100px]" />
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-pink-500 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse-dot" />
              <span className="text-xs text-white/80 font-medium">150+ майстрів онлайн</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
              Знайди свого
              <span className="block gradient-text" style={{WebkitTextFillColor: 'transparent'}}>beauty-майстра</span>
            </h1>
            <p className="text-sm md:text-base text-white/60 mb-8 leading-relaxed max-w-md">
              Тисячі перевірених спеціалістів поруч. Шукай за мовою, послугою та локацією. Бронюй в один клік.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/catalog" className="inline-flex items-center justify-center gap-2 bg-white text-[var(--text)] font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-purple-500/20">
                🔍 Знайти майстра
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium text-sm px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all">
                Стати майстром →
              </Link>
            </div>
          </div>
          {/* Floating stats */}
          <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3">
            {[
              { num: '150+', label: 'Майстрів' },
              { num: '8', label: 'Країн' },
              { num: '4.8', label: 'Рейтинг' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl px-5 py-3 text-center min-w-[100px]">
                <div className="text-xl font-bold text-white">{s.num}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Категорії</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Знайдіть потрібну послугу</p>
            </div>
            <Link href="/catalog" className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors">
              Всі послуги →
            </Link>
          </div>
          <ServicesGrid />
        </section>

        {/* Top Masters */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Топ майстри</h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Найкращі спеціалісти за рейтингом</p>
            </div>
            <Link href="/catalog" className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors">
              Всі →
            </Link>
          </div>
          <SpecialistCarousel />
        </section>

        {/* Language Banner */}
        <section className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 p-6 md:p-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-[60px]" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">🗣️ Майстер твоєю мовою</h3>
            <p className="text-sm text-white/70 mb-5 max-w-md">
              Знаходьте спеціалістів, які говорять українською, російською, англійською та іншими мовами
            </p>
            <div className="flex flex-wrap gap-2">
              {['🇺🇦 Українська', '🇬🇧 English', '🇷🇺 Русский', '🇵🇱 Polski', '🇩🇪 Deutsch', '🇫🇷 Français', '🇮🇱 עברית', '🇹🇷 Türkçe'].map((lang) => (
                <Link key={lang} href={`/catalog`} className="text-xs font-medium bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-full hover:bg-white/30 transition-all border border-white/10">
                  {lang}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[var(--text)] mb-6 text-center">Як це працює</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🔍', title: 'Знайдіть', desc: 'Оберіть послугу, місто та мову майстра' },
              { icon: '💬', title: 'Напишіть', desc: 'Зв\'яжіться напряму та домовтеся про візит' },
              { icon: '✨', title: 'Насолоджуйтесь', desc: 'Отримайте якісний сервіс від професіонала' },
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
