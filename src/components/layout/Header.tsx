"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser, logout, type User } from "@/lib/auth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/85 backdrop-blur-md border-b border-[var(--border-light)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          find<span className="text-[var(--accent-dark)]">a</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Пошук</Link>
          <Link href="/catalog" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Каталог</Link>

          {loading ? (
            <span className="text-sm text-[var(--text-tertiary)]">...</span>
          ) : user ? (
            <>
              <span className="text-sm text-[var(--text-secondary)]">{user.name || user.email?.split("@")[0]}</span>
              <button onClick={handleLogout} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer">Вийти</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Увійти</Link>
              <Link href="/login" className="text-sm font-semibold bg-[var(--accent)] text-[var(--text)] px-5 py-2 rounded-full hover:shadow-md hover:shadow-[var(--accent-glow)] transition-all">Зареєструватись</Link>
            </>
          )}
        </nav>

        <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setOpen(!open)} aria-label="Меню">
          <span className={`block w-6 h-0.5 bg-[var(--text)] rounded transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[var(--text)] rounded transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[var(--text)] rounded transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden bg-[var(--bg)]/98 backdrop-blur-md border-b border-[var(--border-light)] px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="text-sm" onClick={() => setOpen(false)}>Пошук</Link>
          <Link href="/catalog" className="text-sm" onClick={() => setOpen(false)}>Каталог</Link>
          {user ? (
            <>
              <span className="text-sm text-[var(--text-secondary)]">{user.name || user.email}</span>
              <button onClick={handleLogout} className="text-sm text-left cursor-pointer">Вийти</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm" onClick={() => setOpen(false)}>Увійти</Link>
              <Link href="/login" className="text-sm font-semibold bg-[var(--accent)] text-[var(--text)] px-5 py-2 rounded-full w-fit" onClick={() => setOpen(false)}>Зареєструватись</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
