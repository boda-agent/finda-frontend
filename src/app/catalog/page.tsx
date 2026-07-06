"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { api } from "@/lib/api";

const MasterMap = lazy(() => import("@/components/map/MasterMap"));

interface Master {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isVerified?: boolean;
  lat?: number | null;
  lng?: number | null;
  city?: { name: string; country?: { name: string; flagEmoji?: string } };
  languages?: { language: { name: string; code: string } }[];
  reviews?: { rating: number }[];
  portfolio?: { imageUrl: string }[];
}

type ViewMode = "list" | "map" | "split";

export default function CatalogPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);

  useEffect(() => { loadMasters(); }, []);

  async function loadMasters() {
    try {
      const data = await api.getMasters();
      setMasters(Array.isArray(data) ? data : []);
    } catch { setMasters([]); }
    finally { setLoading(false); }
  }

  const cities = [...new Set(masters.map(m => m.city?.name).filter(Boolean))] as string[];

  const filtered = masters.filter(m => {
    if (search) {
      const q = search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.description?.toLowerCase().includes(q)) return false;
    }
    if (selectedCity && m.city?.name !== selectedCity) return false;
    return true;
  });

  function getAvgRating(m: Master) {
    if (!m.reviews?.length) return 0;
    return m.reviews.reduce((a, r) => a + r.rating, 0) / m.reviews.length;
  }

  // View mode buttons
  const viewModes: { key: ViewMode; icon: string; label: string }[] = [
    { key: "list", icon: "📋", label: "Список" },
    { key: "map", icon: "🗺️", label: "Карта" },
    { key: "split", icon: "📊", label: "Спліт" },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text)] mb-1">Каталог майстрів</h1>
            <p className="text-sm text-[var(--text-tertiary)]">{filtered.length} спеціалістів готові до роботи</p>
          </div>

          {/* View mode toggle */}
          <div className="flex gap-1 bg-[var(--bg-elevated)] p-1 rounded-xl">
            {viewModes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === mode.key
                    ? "bg-[var(--bg-card)] text-[var(--text)] shadow-sm"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text)]"
                }`}
              >
                <span>{mode.icon}</span>
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">🔍</span>
            <input
              type="text" placeholder="Пошук майстра, послуги..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium border transition-all ${showFilters ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M10 18h4"/></svg>
            Фільтри
          </button>
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setSelectedCity("")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${!selectedCity ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]'}`}>
              Всі міста
            </button>
            {cities.map(city => (
              <button key={city} onClick={() => setSelectedCity(city === selectedCity ? "" : city)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${city === selectedCity ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]'}`}>
                {city}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className={`flex gap-4 ${viewMode === "split" ? "flex-col md:flex-row" : "flex-col"}`}>
          {/* Map view */}
          {(viewMode === "map" || viewMode === "split") && (
            <div className={`${viewMode === "split" ? "md:w-1/2" : "w-full"}`}>
              <div className={`${viewMode === "map" ? "h-[calc(100vh-280px)]" : "h-[400px] md:h-[600px]"} rounded-xl overflow-hidden border border-[var(--border)]`}>
                <Suspense fallback={
                  <div className="w-full h-full bg-[var(--bg-elevated)] flex items-center justify-center">
                    <div className="text-sm text-[var(--text-tertiary)]">Завантаження карти...</div>
                  </div>
                }>
                  <MasterMap
                    className="w-full h-full"
                    onSelectMaster={setSelectedMaster}
                  />
                </Suspense>
              </div>

              {/* Selected master card (mobile drawer) */}
              {selectedMaster && viewMode === "map" && (
                <div className="md:hidden mt-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] overflow-hidden flex-shrink-0">
                      {selectedMaster.coverImage ? (
                        <img src={selectedMaster.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">👩</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--text)]">{selectedMaster.name}</h3>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        {selectedMaster.city?.country?.flagEmoji} {selectedMaster.city?.name}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/masters/${selectedMaster.id}`}
                    className="block w-full bg-[var(--accent)] text-white text-center font-semibold text-sm py-2.5 rounded-xl"
                  >
                    Переглянути профіль
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* List view */}
          {(viewMode === "list" || viewMode === "split") && (
            <div className={`${viewMode === "split" ? "md:w-1/2" : "w-full"}`}>
              {loading ? (
                <div className={`grid grid-cols-1 ${viewMode === "split" ? "" : "md:grid-cols-2 lg:grid-cols-3"} gap-5`}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border)]">
                      <div className="h-48 shimmer" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 w-3/4 shimmer rounded" />
                        <div className="h-3 w-1/2 shimmer rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2">Нічого не знайдено</h3>
                  <p className="text-sm text-[var(--text-tertiary)]">Спробуйте змінити фільтри або пошуковий запит</p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 ${viewMode === "split" ? "" : "md:grid-cols-2 lg:grid-cols-3"} gap-5`}>
                  {filtered.map((master) => {
                    const rating = getAvgRating(master);
                    const langs = master.languages?.map(l => l.language.code.toUpperCase()).slice(0, 3) || [];
                    return (
                      <Link key={master.id} href={`/masters/${master.id}`}
                        className="group bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border)] card-hover">
                        <div className="relative h-48 bg-[var(--accent-light)] overflow-hidden">
                          {master.coverImage ? (
                            <img src={master.coverImage} alt={master.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">👩</div>
                          )}
                          {master.isVerified && (
                            <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 flex items-center gap-1">
                              <span className="text-green-500 text-xs">✓</span>
                              <span className="text-[10px] font-semibold text-[var(--text)]">Перевірений</span>
                            </div>
                          )}
                          {rating > 0 && (
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                              <span className="text-yellow-400 text-xs">★</span>
                              <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                              <span className="text-[10px] text-white/60">({master.reviews?.length})</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{master.name}</h3>
                              {master.city && (
                                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                                  {master.city.country?.flagEmoji} {master.city.name}{master.city.country?.name && `, ${master.city.country.name}`}
                                </p>
                              )}
                            </div>
                          </div>
                          {master.description && (
                            <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2 leading-relaxed">{master.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1.5">
                              {langs.map(l => (
                                <span key={l} className="text-[10px] font-semibold bg-[var(--accent-light)] text-[var(--accent)] px-2 py-0.5 rounded-md">{l}</span>
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-[var(--accent)] group-hover:translate-x-1 transition-transform inline-block">Дивитись →</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
