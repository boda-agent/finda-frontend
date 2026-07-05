"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  master: { id: string; name: string };
  service: { id: string; name: string; price: number; durationMin?: number };
  client?: { id: string; name: string };
  review?: { id: string; rating: number };
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: "Очікує", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: "⏳" },
  CONFIRMED: { label: "Підтверджено", color: "bg-green-50 text-green-700 border-green-200", icon: "✅" },
  CANCELLED: { label: "Скасовано", color: "bg-red-50 text-red-700 border-red-200", icon: "❌" },
  COMPLETED: { label: "Завершено", color: "bg-blue-50 text-blue-700 border-blue-200", icon: "🎉" },
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const data = await api.getBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Скасувати бронювання?")) return;
    try {
      await api.updateBookingStatus(id, "CANCELLED");
      setBookings(bookings.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b));
    } catch (e: any) {
      alert(e.message || "Помилка");
    }
  }

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="h-8 w-1/3 shimmer rounded mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 shimmer rounded-xl mb-3" />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--text)] mb-2">Мої броні</h1>
        <p className="text-sm text-[var(--text-tertiary)] mb-6">{bookings.length} записів</p>

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all", label: "Всі" },
            { key: "PENDING", label: "Очікують" },
            { key: "CONFIRMED", label: "Підтверджені" },
            { key: "COMPLETED", label: "Завершені" },
            { key: "CANCELLED", label: "Скасовані" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.key
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">Немає бронювань</h3>
            <p className="text-sm text-[var(--text-tertiary)] mb-4">Знайдіть майстра та запишіться</p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-semibold text-sm px-6 py-3 rounded-xl"
            >
              🔍 Знайти майстра
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => {
              const status = STATUS_LABELS[booking.status] || STATUS_LABELS.PENDING;
              const dateObj = new Date(booking.date);
              const isPast = dateObj < new Date();

              return (
                <div
                  key={booking.id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-[var(--text)]">{booking.service.name}</h3>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        з {booking.master.name}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-3">
                    <span>📅 {dateObj.toLocaleDateString("uk-UA", { weekday: "short", day: "numeric", month: "long" })}</span>
                    <span>🕐 {booking.startTime} — {booking.endTime}</span>
                  </div>

                  {booking.service.price && (
                    <div className="text-sm font-bold text-[var(--accent)] mb-3">
                      {booking.service.price}₴
                    </div>
                  )}

                  {booking.notes && (
                    <p className="text-xs text-[var(--text-tertiary)] mb-3 italic">"{booking.notes}"</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-xs font-semibold text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        Скасувати
                      </button>
                    )}
                    {booking.status === "COMPLETED" && !booking.review && (
                      <Link
                        href={`/masters/${booking.master.id}`}
                        className="text-xs font-semibold text-[var(--accent)] px-3 py-1.5 rounded-lg border border-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors"
                      >
                        ⭐ Залишити відгук
                      </Link>
                    )}
                    <Link
                      href={`/masters/${booking.master.id}`}
                      className="text-xs font-semibold text-[var(--text-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
                    >
                      Профіль майстра →
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
