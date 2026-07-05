"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { api } from "@/lib/api";

interface Master {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  coverImage?: string;
  countryOfOrigin?: string;
  city?: { name: string; country?: { name: string; flagEmoji?: string } };
  isVerified?: boolean;
  lat?: number;
  lng?: number;
  services?: { id: string; name: string; price: number; durationMin?: number }[];
  portfolio?: { id: string; imageUrl: string; caption?: string }[];
  certificates?: { id: string; title: string; issuedBy?: string }[];
  workingHours?: { dayOfWeek: number; startTime: string; endTime: string }[];
}

export default function MasterProfileClient({ id }: { id: string }) {
  const [master, setMaster] = useState<Master | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"services" | "portfolio" | "reviews">("services");

  useEffect(() => {
    if (id) loadMaster(id);
  }, [id]);

  async function loadMaster(masterId: string) {
    try {
      const data = await api.getMaster(masterId);
      setMaster(data);
    } catch (err) {
      console.error("Failed to load master:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <span className="inline-block w-6 h-6 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!master) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <span className="text-4xl mb-4 block">😕</span>
          <p className="text-sm text-[var(--text-secondary)]">Майстра не знайдено</p>
          <Link href="/catalog" className="inline-block mt-4 text-sm font-semibold bg-[var(--accent)] text-[var(--text)] px-5 py-2 rounded-full">
            Повернутись до каталогу
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/catalog" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-4 hover:text-[var(--text)] transition-colors">
          ← Назад
        </Link>

        {/* Profile header */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center bg-[var(--accent-light)]">
              {master.coverImage ? (
                <img src={master.coverImage} alt={master.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-3xl">👩</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold truncate">{master.name}</h1>
                {master.isVerified && <span className="text-xs">✅</span>}
              </div>
              {master.city && (
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {master.city.country?.flagEmoji} {master.city.name}
                  {master.city.country?.name && `, ${master.city.country.name}`}
                </p>
              )}
              {master.description && (
                <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">{master.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 overflow-x-auto">
          <button onClick={() => setActiveTab("services")} className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${activeTab === "services" ? "bg-[var(--accent)] text-[var(--text)]" : "bg-[var(--border-light)] text-[var(--text-secondary)]"}`}>
            💅 Послуги
          </button>
          <button onClick={() => setActiveTab("portfolio")} className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${activeTab === "portfolio" ? "bg-[var(--accent)] text-[var(--text)]" : "bg-[var(--border-light)] text-[var(--text-secondary)]"}`}>
            📸 Портфоліо
          </button>
          <button onClick={() => setActiveTab("reviews")} className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${activeTab === "reviews" ? "bg-[var(--accent)] text-[var(--text)]" : "bg-[var(--border-light)] text-[var(--text-secondary)]"}`}>
            ⭐ Відгуки
          </button>
        </div>

        {activeTab === "services" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl divide-y divide-[var(--border-light)]">
            {master.services && master.services.length > 0 ? (
              master.services.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium">{svc.name}</p>
                    {svc.durationMin && (
                      <p className="text-[11px] text-[var(--text-tertiary)]">⏱ {svc.durationMin} хв</p>
                    )}
                  </div>
                  <span className="text-sm font-bold">{svc.price}₴</span>
                </div>
              ))
            ) : (
              <p className="px-4 py-8 text-xs text-center text-[var(--text-tertiary)]">Послуги не додані</p>
            )}
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="grid grid-cols-2 gap-3">
            {master.portfolio && master.portfolio.length > 0 ? (
              master.portfolio.map((img) => (
                <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-[var(--border-light)]">
                  <img src={img.imageUrl} alt={img.caption || "Portfolio"} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-xs text-[var(--text-tertiary)]">Портфоліо пусте</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl p-5">
            <p className="text-xs text-[var(--text-tertiary)] text-center py-8">Відгуки з&rsquo;являться після перших візитів</p>
          </div>
        )}

        {/* Chat CTA */}
        <div className="mt-5">
          <button className="w-full bg-[var(--accent)] text-[var(--text)] font-semibold text-sm py-3.5 rounded-xl hover:shadow-lg transition-all">
            💬 Написати {master.name.split(" ")[0]} у чат
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
