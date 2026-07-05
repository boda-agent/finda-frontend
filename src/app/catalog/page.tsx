"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { POPULAR_SERVICES, LANGUAGES } from "@/types";
import Link from "next/link";
import { api } from "@/lib/api";

interface Master {
  id: string;
  name: string;
  city?: { name: string };
  countryOfOrigin?: string;
  isVerified?: boolean;
  description?: string;
  services?: { name: string; price: number }[];
}

export default function CatalogPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMasters();
  }, []);

  async function loadMasters() {
    try {
      const data = await api.getMasters();
      setMasters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load masters:", err);
      setMasters([]);
    } finally {
      setLoading(false);
    }
  }

  const toggleLang = (lang: string) => {
    setSelectedLang((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const filteredMasters = masters.filter((m) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search bar */}
        <div className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3.5 mb-5">
          <span className="text-lg opacity-50">🔍</span>
          <input
            type="text"
            placeholder="Пошук майстра, послуги..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none border-none text-[var(--text)] placeholder:text-[var(--text-tertiary)]"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              showFilters
                ? "bg-[var(--accent)] text-[var(--text)]"
                : "bg-[var(--bg)] text-[var(--text-secondary)]"
            }`}
          >
            Фільтри
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 mb-5">
            <div className="mb-4">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Послуга</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(selectedService === s.id ? "" : s.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      selectedService === s.id
                        ? "bg-[var(--accent)] text-[var(--text)]"
                        : "bg-[var(--bg)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Мова</p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLang(lang)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      selectedLang.includes(lang)
                        ? "bg-[var(--accent)] text-[var(--text)]"
                        : "bg-[var(--bg)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <span className="inline-block w-6 h-6 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        ) : filteredMasters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-[var(--text-secondary)]">Майстрів не знайдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMasters.map((master) => (
              <Link key={master.id} href={`/masters/${master.id}`}>
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-lg font-bold text-[var(--text)]">
                      {master.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold truncate">{master.name}</h3>
                        {master.isVerified && <span className="text-green-500 text-xs">✓</span>}
                      </div>
                      {master.city && (
                        <p className="text-xs text-[var(--text-secondary)]">{master.city.name}</p>
                      )}
                      {master.description && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-2">
                          {master.description}
                        </p>
                      )}
                      {master.services && master.services.length > 0 && (
                        <p className="text-xs font-medium text-[var(--accent-dark)] mt-2">
                          від {Math.min(...master.services.map((s) => s.price))} ₴
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
