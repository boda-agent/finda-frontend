"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

interface Favorite {
  id: string;
  masterId: string;
  master: {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    isVerified?: boolean;
    city?: { name: string; country?: { name: string; flagEmoji?: string } };
    languages?: { language: { name: string } }[];
    reviews?: { rating: number }[];
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const data = await api.getFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(masterId: string) {
    try {
      await api.removeFavorite(masterId);
      setFavorites(favorites.filter(f => f.masterId !== masterId));
    } catch (e: any) {
      alert(e.message || "Помилка");
    }
  }

  function getAvgRating(reviews?: { rating: number }[]) {
    if (!reviews?.length) return 0;
    return reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="h-8 w-1/3 shimmer rounded mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 shimmer rounded-xl mb-3" />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--text)] mb-2">Обрані майстри</h1>
        <p className="text-sm text-[var(--text-tertiary)] mb-6">{favorites.length} майстрів</p>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">Список обраних пустий</h3>
            <p className="text-sm text-[var(--text-tertiary)] mb-4">Додайте майстрів до обраних, щоб не втратити</p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-semibold text-sm px-6 py-3 rounded-xl"
            >
              🔍 Знайти майстра
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => {
              const master = fav.master;
              const rating = getAvgRating(master.reviews);
              const langs = master.languages?.map(l => l.language.name) || [];

              return (
                <div
                  key={fav.id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex gap-4"
                >
                  {/* Avatar */}
                  <Link href={`/masters/${master.id}`} className="shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-[var(--accent-light)] overflow-hidden">
                      {master.coverImage ? (
                        <img src={master.coverImage} alt={master.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">👩</div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/masters/${master.id}`} className="font-semibold text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors">
                          {master.name}
                        </Link>
                        {master.isVerified && (
                          <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            ✓
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(fav.masterId)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Видалити з обраних"
                      >
                        ✕
                      </button>
                    </div>

                    {master.city && (
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                        {master.city.country?.flagEmoji} {master.city.name}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      {rating > 0 && (
                        <span className="text-xs font-semibold text-yellow-600">
                          ⭐ {rating.toFixed(1)}
                        </span>
                      )}
                      {langs.length > 0 && (
                        <span className="text-xs text-[var(--text-tertiary)]">
                          🗣️ {langs.slice(0, 2).join(", ")}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/masters/${master.id}/book`}
                      className="inline-block mt-2 text-xs font-semibold text-[var(--accent)] hover:underline"
                    >
                      Записатися →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
