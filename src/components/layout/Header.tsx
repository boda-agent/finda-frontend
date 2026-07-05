"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser, logout, type User } from "@/lib/auth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm border-b border-[var(--border)]/50' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="gradient-text">finda</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'Головна' },
            { href: '/catalog', label: 'Каталог' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] px-4 py-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-all">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-[var(--text-secondary)]">{user.name || user.email?.split('@')[0]}</span>
              <button onClick={() => { logout(); setUser(null); }}
                className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text)] px-4 py-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-all">
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] px-4 py-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-all">Увійти</Link>
              <Link href="/login" className="text-sm font-semibold bg-[var(--text)] text-white px-5 py-2.5 rounded-xl hover:bg-[var(--text)]/90 transition-all shadow-sm">Реєстрація</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors" onClick={() => setOpen(!open)}>
          <span className={`block w-5 h-0.5 bg-[var(--text)] rounded transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[var(--text)] rounded transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[var(--text)] rounded transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-[var(--border)]/50 px-4 py-4">
          <nav className="flex flex-col gap-1">
            {[
              { href: '/', label: '🏠 Головна' },
              { href: '/catalog', label: '🔍 Каталог' },
            ].map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="text-sm font-medium text-[var(--text-secondary)] px-4 py-3 rounded-lg hover:bg-[var(--bg-elevated)] transition-all">
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-[var(--border)] my-2" />
            {user ? (
              <button onClick={() => { logout(); setUser(null); setOpen(false); }}
                className="text-sm font-medium text-red-500 px-4 py-3 rounded-lg text-left">Вийти</button>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}
                className="text-sm font-semibold bg-[var(--text)] text-white px-4 py-3 rounded-lg text-center">Увійти / Реєстрація</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
