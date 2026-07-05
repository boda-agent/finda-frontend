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
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, name, password);
      }
      router.push("/catalog");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Щось пішло не так";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="inline-block text-2xl font-extrabold tracking-tight">
            find<span className="text-[var(--accent-dark)]">a</span>
          </a>
        </div>

        <h1 className="text-xl font-bold mb-1">
          {mode === "login" ? "Увійти" : "Реєстрація"}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mb-6">
          {mode === "login"
            ? "Увійдіть, щоб знаходити майстрів та спілкуватись у чаті"
            : "Створіть акаунт для пошуку майстрів"}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[var(--accent)] transition-colors"
          />

          {mode === "register" && (
            <input
              type="password"
              placeholder="Повторіть пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[var(--accent)] transition-colors"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-[var(--text)] font-semibold rounded-xl px-4 py-3.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading
              ? "Завантаження..."
              : mode === "login"
              ? "Увійти"
              : "Зареєструватись"}
          </button>
        </form>

        <p className="text-xs text-center text-[var(--text-secondary)] mt-4">
          {mode === "login" ? "Немає акаунта? " : "Вже є акаунт? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); setConfirmPassword(""); }}
            className="text-[var(--accent-dark)] font-medium hover:underline"
          >
            {mode === "login" ? "Зареєструватись" : "Увійти"}
          </button>
        </p>

        <p className="text-[11px] text-center text-[var(--text-tertiary)] mt-6">
          Продовжуючи, ви погоджуєтесь з умовами використання
        </p>
      </div>
    </div>
  );
}
