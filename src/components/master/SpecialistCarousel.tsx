"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Master {
  id: string; name: string; description?: string; coverImage?: string; isVerified?: boolean;
  city?: { name: string; country?: { flagEmoji?: string } };
  reviews?: { rating: number }[];
}

export default function SpecialistCarousel() {
  const [masters, setMasters] = useState<Master[]>([]);

  useEffect(() => {
    api.getMasters().then(data => setMasters(Array.isArray(data) ? data.slice(0, 8) : [])).catch(() => {});
  }, []);

  if (!masters.length) return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1 -mx-1">
      {[1,2,3,4].map(i => (
        <div key={i} className="min-w-[260px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          <div className="h-40 shimmer" />
          <div className="p-4 space-y-2"><div className="h-4 w-3/4 shimmer rounded" /><div className="h-3 w-1/2 shimmer rounded" /></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1 -mx-1">
      {masters.map(master => {
        const rating = master.reviews?.length ? master.reviews.reduce((a, r) => a + r.rating, 0) / master.reviews.length : 0;
        return (
          <Link key={master.id} href={`/masters/${master.id}`}
            className="group min-w-[260px] bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden card-hover flex-shrink-0">
            <div className="relative h-40 bg-[var(--accent-light)] overflow-hidden">
              {master.coverImage ? (
                <img src={master.coverImage} alt={master.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">👩</div>}
              {master.isVerified && (
                <div className="absolute top-2 right-2 glass rounded-full px-2 py-0.5 text-[10px] font-semibold text-green-600">✓ Перевірений</div>
              )}
              {rating > 0 && (
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                  <span className="text-yellow-400 text-[10px]">★</span>
                  <span className="text-[10px] font-bold text-white">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">{master.name}</h3>
              {master.city && (
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{master.city.country?.flagEmoji} {master.city.name}</p>
              )}
              {master.description && (
                <p className="text-[11px] text-[var(--text-secondary)] mt-2 line-clamp-2">{master.description}</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
