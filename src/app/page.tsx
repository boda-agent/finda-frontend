"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import ServicesGrid from "@/components/search/ServicesGrid";
import SpecialistCarousel from "@/components/master/SpecialistCarousel";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();
  const [city, setCity] = useState("");
  const [service, setService] = useState("");

  const cities = [
    "Київ", "Львів", "Одеса", "Варшава", "Краків", "Вроцлав", "Ґданськ",
    "Берлін", "Мюнхен", "Гамбург", "Париж", "Ліон", "Марсель",
    "Мадрид", "Барселона", "Валенсія", "Рим", "Мілан",
    "Лондон", "Манчестер", "Нью-Йорк", "Лос-Анджелес",
    "Прага", "Брно", "Відень", "Стамбул", "Анталія", "Дубай",
  ];

  const services = [
    "Манікюр", "Педикюр", "Стрижка", "Фарбування", "Укладка",
    "Балаяж", "Макіяж", "Брови", "Вії", "Масаж", "Чистка обличчя",
    "Пілінг", "Татуювання", "Пірсинг", "Нарощування нігтів",
  ];

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (service) params.set("q", service);
    window.location.href = `/catalog?${params.toString()}`;
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero — Split 55/45 */}
        <section className="relative rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row">
            {/* Left — Text + Search */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-[var(--accent-light)] rounded-full px-4 py-1.5 mb-5 w-fit">
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full pulse-dot" />
                <span className="text-xs text-[var(--accent-dark)] font-medium">110+ майстрів онлайн</span>
              </div>

              <h1 className="text-3xl md:text-[3rem] font-extrabold text-[var(--text)] leading-[1.1] tracking-tight mb-4">
                Знайди свого
                <span className="block text-[var(--accent)]">beauty-майстра</span>
              </h1>

              <p className="text-sm md:text-base text-[var(--text-secondary)] mb-8 leading-relaxed max-w-md">
                Тисячі перевірених спеціалістів поруч. Шукай за мовою, послугою та локацією. Бронюй в один клік.
              </p>

              {/* SearchBar */}
              <div
                role="search"
                aria-label="Пошук б'юті-послуг"
                className="flex flex-col sm:flex-row items-stretch bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)] hover:shadow-md transition-all mb-6"
              >
                <div className="flex-1 flex items-center gap-2 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-[var(--border)]">
                  <span className="text-[var(--text-tertiary)]">📍</span>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="Місто"
                    className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Місто</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 py-3.5">
                  <span className="text-[var(--text-tertiary)]">✂️</span>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    aria-label="Послуга"
                    className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Послуга</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  aria-label="Знайти майстрів"
                  className="bg-[var(--accent)] text-white font-semibold text-sm px-6 py-3.5 hover:bg-[var(--accent-dark)] transition-all active:scale-[0.98]"
                >
                  Найти →
                </button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span> 4.8
                </span>
                <span>·</span>
                <span>2000+ відгуків</span>
                <span>·</span>
                <span>110+ майстрів</span>
              </div>
            </div>

            {/* Right — Photo */}
            <div className="hidden md:block md:w-[45%] relative">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"
                  alt="Майстер робить клієнту манікюр у салоні краси"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
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
              {t("home.all_services")}
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
              {t("home.all")}
            </Link>
          </div>
          <SpecialistCarousel />
        </section>

        {/* Language Banner */}
        <section className="mb-10 relative overflow-hidden rounded-2xl bg-[var(--accent-light)] border border-[var(--accent)]/20 p-6 md:p-8">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-[var(--text)] mb-2">🗣️ Майстер твоєю мовою</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-md">
              Знаходьте спеціалістів, які говорять українською, російською, англійською та іншими мовами
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { flag: "🇺🇦", name: "Українська" },
                { flag: "🇬🇧", name: "English" },
                { flag: "🇷🇺", name: "Русский" },
                { flag: "🇵🇱", name: "Polski" },
                { flag: "🇩🇪", name: "Deutsch" },
                { flag: "🇫🇷", name: "Français" },
                { flag: "🇹🇷", name: "Türkçe" },
                { flag: "🇰🇿", name: "Қазақша" },
              ].map((l) => (
                <Link
                  key={l.name}
                  href={`/catalog?lang=${l.name}`}
                  className="text-xs font-medium bg-white text-[var(--text)] py-2 px-4 rounded-full hover:bg-[var(--accent)] hover:text-white transition-all border border-[var(--border)]"
                >
                  {l.flag} {l.name}
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
              { icon: "🔍", step: "1", title: "Знайдіть", desc: "Оберіть послугу, місто та мову майстра" },
              { icon: "💬", step: "2", title: "Напишіть", desc: "Зв'яжіться напряму та домовтеся про візит" },
              { icon: "✨", step: "3", title: "Насолоджуйтесь", desc: "Отримайте якісний сервіс від професіонала" },
            ].map((item) => (
              <div key={item.step} className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 text-center card-hover">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider mb-2">Крок {item.step}</div>
                <h3 className="font-bold text-[var(--text)] mb-1">{item.title}</h3>
                <p className="text-xs text-[var(--text-tertiary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
