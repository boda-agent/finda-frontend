"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { api } from "@/lib/api";

interface Master {
  id: string; name: string; description?: string; phone?: string; coverImage?: string;
  isVerified?: boolean; countryOfOrigin?: string;
  city?: { name: string; country?: { name: string; flagEmoji?: string } };
  portfolio?: { id: string; imageUrl: string; caption?: string }[];
  certificates?: { id: string; title: string; issuedBy?: string }[];
  workingHours?: { dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }[];
  languages?: { language: { name: string; code: string } }[];
  reviews?: { id: string; rating: number; text?: string; createdAt: string; user: { name: string } }[];
  services?: { id: string; name: string; price: number; durationMin?: number }[];
}

const DAYS = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function MasterProfileClient({ id }: { id: string }) {
  const [master, setMaster] = useState<Master | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"services" | "portfolio" | "reviews">("services");

  useEffect(() => { if (id) loadMaster(id); }, [id]);

  async function loadMaster(masterId: string) {
    try { setMaster(await api.getMaster(masterId)); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  }

  if (loading) return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-64 shimmer rounded-2xl mb-6" />
        <div className="h-8 w-1/3 shimmer rounded mb-4" />
        <div className="h-4 w-2/3 shimmer rounded" />
      </div>
    </AppLayout>
  );

  if (!master) return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2">Майстра не знайдено</h2>
        <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] mt-4">← Повернутись до каталогу</Link>
      </div>
    </AppLayout>
  );

  const avgRating = master.reviews?.length ? master.reviews.reduce((a, r) => a + r.rating, 0) / master.reviews.length : 0;
  const langs = master.languages?.map(l => l.language) || [];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/catalog" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-6 hover:text-[var(--text)] transition-colors">
          ← Назад до каталогу
        </Link>

        {/* Cover + Profile */}
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <div className="h-48 md:h-64 bg-gradient-to-br from-violet-200 to-pink-200">
            {master.coverImage && (
              <img src={master.coverImage} alt={master.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl border-4 border-white">
                {master.coverImage ? <img src={master.coverImage} alt="" className="w-full h-full object-cover rounded-xl" /> : '👩'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-extrabold text-white">{master.name}</h1>
                  {master.isVerified && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Перевірений</span>}
                </div>
                {master.city && (
                  <p className="text-sm text-white/80 mt-0.5">
                    {master.city.country?.flagEmoji} {master.city.name}{master.city.country?.name && `, ${master.city.country.name}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { value: avgRating > 0 ? avgRating.toFixed(1) : '—', label: 'Рейтинг', icon: '⭐' },
            { value: master.reviews?.length || 0, label: 'Відгуків', icon: '💬' },
            { value: langs.length, label: 'Мов', icon: '🗣️' },
            { value: master.portfolio?.length || 0, label: 'Фото', icon: '📸' },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-lg mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-[var(--text)]">{s.value}</div>
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Languages */}
        {langs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {langs.map(l => (
              <span key={l.code} className="text-xs font-medium bg-[var(--accent-light)] text-[var(--accent)] px-3 py-1.5 rounded-full">
                {l.name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {master.description && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
            <h3 className="text-sm font-bold text-[var(--text)] mb-2">Про майстра</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{master.description}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[var(--bg-elevated)] p-1 rounded-xl">
          {(['services', 'portfolio', 'reviews'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-[var(--bg-card)] text-[var(--text)] shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--text)]'}`}>
              {tab === 'services' && '💅 Послуги'}
              {tab === 'portfolio' && '📸 Портфоліо'}
              {tab === 'reviews' && `⭐ Відгуки (${master.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'services' && (
          <div className="space-y-3">
            {master.services?.length ? master.services.map(svc => (
              <div key={svc.id} className="flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent)] transition-colors">
                <div>
                  <h4 className="font-semibold text-sm text-[var(--text)]">{svc.name}</h4>
                  {svc.durationMin && <p className="text-xs text-[var(--text-tertiary)] mt-0.5">⏱ {svc.durationMin} хв</p>}
                </div>
                <span className="text-lg font-bold text-[var(--accent)]">{svc.price}₴</span>
              </div>
            )) : <p className="text-center text-sm text-[var(--text-tertiary)] py-8">Послуги не додані</p>}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {master.portfolio?.length ? master.portfolio.map(img => (
              <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-[var(--bg-elevated)] group cursor-pointer">
                <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )) : <div className="col-span-full text-center py-8 text-sm text-[var(--text-tertiary)]">Портфоліо пусте</div>}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {master.reviews?.length ? master.reviews.map(review => (
              <div key={review.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-xs font-bold text-[var(--accent)]">
                      {review.user?.name?.charAt(0) || '?'}
                    </div>
                    <span className="text-sm font-semibold text-[var(--text)]">{review.user?.name || 'Анонім'}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                </div>
                {review.text && <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{review.text}</p>}
              </div>
            )) : <p className="text-center text-sm text-[var(--text-tertiary)] py-8">Відгуків поки немає</p>}
          </div>
        )}

        {/* Working Hours */}
        {master.workingHours?.length ? (
          <div className="mt-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-4">🕐 Графік роботи</h3>
            <div className="grid grid-cols-7 gap-2">
              {master.workingHours.sort((a,b) => a.dayOfWeek - b.dayOfWeek).map(wh => (
                <div key={wh.dayOfWeek} className={`text-center p-2 rounded-lg ${wh.isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className={`text-[10px] font-bold mb-1 ${wh.isActive ? 'text-green-600' : 'text-gray-400'}`}>{DAYS[wh.dayOfWeek]}</div>
                  {wh.isActive ? (
                    <div className="text-[10px] text-green-700">{wh.startTime}-{wh.endTime}</div>
                  ) : (
                    <div className="text-[10px] text-gray-400">—</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* CTA */}
        <div className="mt-8 sticky bottom-20 md:bottom-4 z-10">
          <button className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all active:scale-[0.98]">
            💬 Написати {master.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
