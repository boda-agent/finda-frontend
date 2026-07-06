"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { getCurrentUser, isAuthenticated, logout } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await api.getMe();
      setUser(data);
      setName(data.name || "");
      setPhone(data.phone || "");
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const data = await api.updateProfile({ name, phone });
      setUser(data);
      setEditing(false);
    } catch (e: any) {
      alert(e.message || "Помилка збереження");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="h-32 shimmer rounded-2xl mb-4" />
          <div className="h-8 w-1/3 shimmer rounded mb-4" />
          <div className="h-4 w-2/3 shimmer rounded" />
        </div>
      </AppLayout>
    );
  }

  if (!user) return null;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold text-[var(--text)] mb-6">Мій профіль</h1>

        {/* Avatar + Info */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-2xl font-bold text-white">
              {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{user.name || "Користувач"}</h2>
              <p className="text-sm text-[var(--text-tertiary)]">{user.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-light)] text-[var(--accent)] px-2 py-0.5 rounded-full">
                {user.role}
              </span>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Ім'я</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1.5 block">Телефон</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+380..."
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[var(--accent)] text-white font-semibold text-sm py-3 rounded-xl disabled:opacity-50"
                >
                  {saving ? "Збереження..." : "Зберегти"}
                </button>
                <button
                  onClick={() => { setEditing(false); setName(user.name || ""); setPhone(user.phone || ""); }}
                  className="flex-1 bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-semibold text-sm py-3 rounded-xl border border-[var(--border)]"
                >
                  Скасувати
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {user.phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-tertiary)]">📱 Телефон</span>
                  <span className="text-[var(--text)]">{user.phone}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">📅 Реєстрація</span>
                <span className="text-[var(--text)]">
                  {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                </span>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="w-full mt-4 bg-[var(--bg-elevated)] text-[var(--text)] font-semibold text-sm py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
              >
                ✏️ Редагувати профіль
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a
            href="/bookings"
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--accent)] transition-colors"
          >
            <div className="text-2xl mb-1">📋</div>
            <div className="text-sm font-semibold text-[var(--text)]">Мої броні</div>
          </a>
          <a
            href="/favorites"
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--accent)] transition-colors"
          >
            <div className="text-2xl mb-1">❤️</div>
            <div className="text-sm font-semibold text-[var(--text)]">Обрані</div>
          </a>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 font-semibold text-sm py-3 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
        >
          🚪 Вийти
        </button>
      </div>
    </AppLayout>
  );
}
