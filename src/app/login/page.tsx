"use client";

import { useState } from "react";
import { login, register } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (mode === "register" && password !== confirmPassword) {
      setError("Паролі не збігаються");
      setLoading(false);
      return;
    }
    try {
      if (mode === "login") await login(email, password);
      else await register(email, name, password);
      router.push("/catalog");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Щось пішло не так");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block text-3xl font-extrabold">
            <span className="gradient-text">finda</span>
          </a>
          <p className="text-xs text-[var(--text-tertiary)] mt-2">Beauty marketplace для професіоналів</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-lg shadow-black/5">
          {/* Tabs */}
          <div className="flex gap-1 bg-[var(--bg-elevated)] p-1 rounded-xl mb-6">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(null); setConfirmPassword(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-[var(--bg-card)] text-[var(--text)] shadow-sm' : 'text-[var(--text-tertiary)]'}`}>
                {m === 'login' ? 'Увійти' : 'Реєстрація'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Ім'я</label>
                <input type="text" placeholder="Ваше ім'я" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Email</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Пароль</label>
              <input type="password" placeholder="Мінімум 6 символів" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all" />
            </div>
            {mode === "register" && (
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Повторіть пароль</label>
                <input type="password" placeholder="Повторіть пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-all" />
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl px-4 py-3.5 text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20 mt-2">
              {loading ? "Завантаження..." : mode === "login" ? "Увійти" : "Зареєструватись"}
            </button>
          </form>
        </div>

        <p className="text-[11px] text-center text-[var(--text-tertiary)] mt-6">
          Продовжуючи, ви погоджуєтесь з умовами використання
        </p>
      </div>
    </div>
  );
}
