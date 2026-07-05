"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  coverImage?: string;
  countryOfOrigin?: string;
  isVerified: boolean;
  city?: { name: string; country?: { name: string; flagEmoji?: string } };
  portfolio: { id: string; imageUrl: string; caption?: string }[];
  certificates: { id: string; title: string; issuedBy?: string }[];
  workingHours: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[];
  languages: { language: { name: string; code: string } }[];
  stats: {
    avgRating: number;
    totalFavorites: number;
    totalBookings: number;
    totalReviews: number;
    bookingsByStatus: { status: string; _count: { id: number } }[];
  };
}

const DAYS = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function MasterDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "portfolio" | "certs" | "hours">("overview");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await api.getMasterDashboard();
      setDashboard(data);
    } catch (e: any) {
      console.error("Dashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function removePortfolio(id: string) {
    if (!confirm("Видалити з портфоліо?")) return;
    try {
      await api.removeMasterPortfolio(id);
      if (dashboard) {
        setDashboard({
          ...dashboard,
          portfolio: dashboard.portfolio.filter(p => p.id !== id),
        });
      }
    } catch (e: any) {
      alert(e.message || "Помилка");
    }
  }

  async function removeCertificate(id: string) {
    if (!confirm("Видалити сертифікат?")) return;
    try {
      await api.removeMasterCertificate(id);
      if (dashboard) {
        setDashboard({
          ...dashboard,
          certificates: dashboard.certificates.filter(c => c.id !== id),
        });
      }
    } catch (e: any) {
      alert(e.message || "Помилка");
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-32 shimmer rounded-2xl mb-4" />
          <div className="h-8 w-1/3 shimmer rounded mb-4" />
        </div>
      </AppLayout>
    );
  }

  if (!dashboard) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">👩‍🎨</div>
          <h2 className="text-xl font-bold mb-2">Ви не майстер</h2>
          <p className="text-sm text-[var(--text-tertiary)]">Зареєструйтесь як майстер для доступу до панелі</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text)]">Панель майстра</h1>
            <p className="text-sm text-[var(--text-tertiary)]">
              {dashboard.isVerified && <span className="text-green-600">✓ Верифікований · </span>}
              {dashboard.city?.country?.flagEmoji} {dashboard.city?.name || "—"}
            </p>
          </div>
          <a
            href={`/masters/${dashboard.id}`}
            className="text-xs font-semibold text-[var(--accent)] border border-[var(--accent)] px-4 py-2 rounded-xl hover:bg-[var(--accent-light)] transition-colors"
          >
            Переглянути профіль →
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Рейтинг", value: dashboard.stats.avgRating.toFixed(1), icon: "⭐" },
            { label: "Бронювань", value: dashboard.stats.totalBookings, icon: "📋" },
            { label: "Відгуків", value: dashboard.stats.totalReviews, icon: "💬" },
            { label: "В обраних", value: dashboard.stats.totalFavorites, icon: "❤️" },
          ].map(s => (
            <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className="text-lg mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-[var(--text)]">{s.value}</div>
              <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[var(--bg-elevated)] p-1 rounded-xl overflow-x-auto">
          {([
            { key: "overview", label: "📊 Огляд" },
            { key: "portfolio", label: "📸 Портфоліо" },
            { key: "certs", label: "📜 Сертифікати" },
            { key: "hours", label: "🕐 Графік" },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-[var(--bg-card)] text-[var(--text)] shadow-sm"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[var(--text)] mb-3">Інформація про профіль</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">Ім'я</span>
                  <span className="text-[var(--text)]">{dashboard.name}</span>
                </div>
                {dashboard.description && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">Опис</span>
                    <span className="text-[var(--text)] text-right max-w-[60%]">{dashboard.description}</span>
                  </div>
                )}
                {dashboard.phone && (
                  <div className="flex justify-between">
                    <span className="text-[var(--text-tertiary)]">Телефон</span>
                    <span className="text-[var(--text)]">{dashboard.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">Мови</span>
                  <span className="text-[var(--text)]">
                    {dashboard.languages.map(l => l.language.name).join(", ") || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bookings by status */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[var(--text)] mb-3">Бронювання за статусом</h3>
              <div className="grid grid-cols-2 gap-2">
                {dashboard.stats.bookingsByStatus.map(b => (
                  <div key={b.status} className="flex items-center justify-between bg-[var(--bg-elevated)] rounded-lg px-3 py-2">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">{b.status}</span>
                    <span className="text-sm font-bold text-[var(--text)]">{b._count.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {dashboard.portfolio.map(item => (
                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-[var(--bg-elevated)] group">
                  <img src={item.imageUrl} alt={item.caption || ""} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePortfolio(item.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ✕
                  </button>
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {dashboard.portfolio.length === 0 && (
              <p className="text-center text-sm text-[var(--text-tertiary)] py-8">Портфоліо пусте</p>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === "certs" && (
          <div className="space-y-3">
            {dashboard.certificates.map(cert => (
              <div key={cert.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-[var(--text)]">{cert.title}</h4>
                  {cert.issuedBy && <p className="text-xs text-[var(--text-tertiary)]">Видано: {cert.issuedBy}</p>}
                </div>
                <button
                  onClick={() => removeCertificate(cert.id)}
                  className="text-xs text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Видалити
                </button>
              </div>
            ))}
            {dashboard.certificates.length === 0 && (
              <p className="text-center text-sm text-[var(--text-tertiary)] py-8">Сертифікати не додані</p>
            )}
          </div>
        )}

        {/* Working Hours Tab */}
        {activeTab === "hours" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-4">Графік роботи</h3>
            <div className="space-y-2">
              {DAYS.map((day, i) => {
                const wh = dashboard.workingHours.find(w => w.dayOfWeek === i);
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm font-medium text-[var(--text)]">{day}</span>
                    {wh && wh.isActive ? (
                      <span className="text-sm text-green-600 font-semibold">{wh.startTime} — {wh.endTime}</span>
                    ) : (
                      <span className="text-sm text-[var(--text-tertiary)]">Вихідний</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
