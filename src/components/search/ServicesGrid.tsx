"use client";

import Link from "next/link";

const CATEGORIES = [
  { slug: 'manicure', icon: '💅', label: 'Манікюр', color: 'from-green-500 to-emerald-500' },
  { slug: 'hair', icon: '💇', label: 'Волосся', color: 'from-amber-500 to-orange-500' },
  { slug: 'lashes', icon: '👁️', label: 'Вії', color: 'from-green-500 to-teal-500' },
  { slug: 'makeup', icon: '💄', label: 'Макіяж', color: 'from-green-500 to-lime-500' },
  { slug: 'massage', icon: '💆', label: 'Масаж', color: 'from-teal-500 to-cyan-500' },
  { slug: 'skincare', icon: '🧴', label: 'Шкіра', color: 'from-emerald-500 to-green-500' },
  { slug: 'brows', icon: '✨', label: 'Брови', color: 'from-indigo-500 to-blue-500' },
  { slug: 'spa', icon: '🧖', label: 'Спа', color: 'from-green-500 to-cyan-500' },
];

export default function ServicesGrid() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
      {CATEGORIES.map((cat) => (
        <Link key={cat.slug} href={`/catalog`}
          className="group flex flex-col items-center gap-2 py-4 px-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-lg transition-all cursor-pointer">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm`}>
            {cat.icon}
          </div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text)] transition-colors text-center leading-tight">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
