"use client";

import { POPULAR_SERVICES } from "@/types";

export default function ServicesGrid() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {POPULAR_SERVICES.map((svc) => (
          <button
            key={svc.id}
            className="flex flex-col items-center gap-1 py-3 px-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <span className="text-2xl">{svc.icon}</span>
            <span className="text-[10px] font-medium text-[var(--text-secondary)] leading-tight text-center">
              {svc.label}
            </span>
          </button>
        ))}
      </div>

      <p className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
        Країни
      </p>
      <div className="flex flex-wrap gap-2">
        {["Україна", "Польща", "Узбекистан", "Вірменія", "Казахстан", "Туреччина"].map((country) => (
          <span
            key={country}
            className="text-xs font-medium bg-white py-1.5 px-3 rounded-full border border-[var(--border)] text-[var(--text-secondary)] cursor-pointer hover:border-[var(--accent)] transition-colors"
          >
            {country === "Україна" ? "🇺🇦" : country === "Польща" ? "🇵🇱" : country === "Узбекистан" ? "🇺🇿" : country === "Вірменія" ? "🇦🇲" : country === "Казахстан" ? "🇰🇿" : "🇹🇷"} {country}
          </span>
        ))}
      </div>
    </div>
  );
}
