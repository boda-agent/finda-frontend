"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

interface Analytics {
  totalUsers: number;
  totalMasters: number;
  totalBookings: number;
  totalReviews: number;
  pendingVerifications: number;
  bookingsByStatus: { status: string; _count: { id: number } }[];
  recentBookings: any[];
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  createdAt: string;
  _count: { bookings: number; reviews: number };
}

export default function AdminPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "users" | "verifications">("analytics");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    const user = getCurrentUser();
    if (user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    loadData();
  }, []);

  async function loadData() {
    try {
      const [analyticsData, usersData, verificationsData] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminUsers(),
        api.getAdminVerifications(),
      ]);
      setAnalytics(analyticsData);
      setUsers(usersData.users || []);
      setVerifications(verificationsData || []);
    } catch (e: any) {
      console.error("Admin load error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(id: string, status: "APPROVED" | "REJECTED") {
    try {
      await api.reviewVerification(id, status);
      setVerifications(verifications.filter(v => v.id !== id));
      if (analytics) {
        setAnalytics({
          ...analytics,
          pendingVerifications: analytics.pendingVerifications - 1,
        });
      }
    } catch (e: any) {
      alert(e.message || "Помилка");
    }
  }

  async function handleRoleChange(userId: string, role: string) {
    try {
      await api.updateAdminUser(userId, { role });
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
    } catch (e: any) {
      alert(e.message || "Помилка");
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="h-8 w-1/3 shimmer rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 shimmer rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--text)] mb-6">Адмін-панель</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[var(--bg-elevated)] p-1 rounded-xl">
          {(["analytics", "users", "verifications"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-[var(--bg-card)] text-[var(--text)] shadow-sm"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text)]"
              }`}
            >
              {tab === "analytics" && "📊 Аналітика"}
              {tab === "users" && "👥 Користувачі"}
              {tab === "verifications" && `✅ Верифікації (${verifications.length})`}
            </button>
          ))}
        </div>

        {/* Analytics Tab */}
        {activeTab === "analytics" && analytics && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Користувачі", value: analytics.totalUsers, icon: "👥" },
                { label: "Майстри", value: analytics.totalMasters, icon: "💇" },
                { label: "Бронювання", value: analytics.totalBookings, icon: "📋" },
                { label: "Відгуки", value: analytics.totalReviews, icon: "⭐" },
              ].map(stat => (
                <div key={stat.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-[var(--text)]">{stat.value}</div>
                  <div className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {analytics.pendingVerifications > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-yellow-800">
                  ⚠️ {analytics.pendingVerifications} запитів на верифікацію очікують розгляду
                </p>
              </div>
            )}

            <h3 className="text-sm font-bold text-[var(--text)] mb-4">Останні бронювання</h3>
            <div className="space-y-2">
              {analytics.recentBookings.map((b: any) => (
                <div key={b.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold text-[var(--text)]">{b.client?.name || "—"}</span>
                    <span className="text-[var(--text-tertiary)]"> → {b.master?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--accent)] font-bold">{b.service?.price}₴</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      b.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      b.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-[var(--text)]">{user.name || "—"}</div>
                  <div className="text-xs text-[var(--text-tertiary)]">{user.email}</div>
                  <div className="text-xs text-[var(--text-tertiary)] mt-1">
                    Бронювань: {user._count.bookings} · Відгуків: {user._count.reviews}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-xs bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-[var(--text)]"
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="MASTER">MASTER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === "verifications" && (
          <div className="space-y-3">
            {verifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-sm text-[var(--text-tertiary)]">Немає запитів на верифікацію</p>
              </div>
            ) : (
              verifications.map(v => (
                <div key={v.id} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[var(--text)]">{v.master?.name}</h4>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Запит від {new Date(v.createdAt).toLocaleDateString("uk-UA")}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      v.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      v.status === "APPROVED" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {v.status}
                    </span>
                  </div>
                  {v.notes && <p className="text-sm text-[var(--text-secondary)] mb-3">{v.notes}</p>}
                  {v.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(v.id, "APPROVED")}
                        className="flex-1 bg-green-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Підтвердити
                      </button>
                      <button
                        onClick={() => handleVerify(v.id, "REJECTED")}
                        className="flex-1 bg-red-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ❌ Відхилити
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
