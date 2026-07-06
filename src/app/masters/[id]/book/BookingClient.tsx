"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

interface Master {
  id: string;
  name: string;
  coverImage?: string;
  city?: { name: string; country?: { name: string; flagEmoji?: string } };
  services?: { id: string; name: string; price: number; durationMin?: number }[];
}

interface Slot {
  time: string;
  available: boolean;
}

export default function BookingClient({ masterId }: { masterId: string }) {
  const router = useRouter();
  const [master, setMaster] = useState<Master | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadMaster();
  }, [masterId]);

  useEffect(() => {
    if (selectedDate && masterId) {
      loadSlots();
    }
  }, [selectedDate]);

  async function loadMaster() {
    try {
      const data = await api.getMaster(masterId);
      setMaster(data);
      if (data.services?.length) {
        setSelectedService(data.services[0].id);
      }
    } catch {
      setError("Майстра не знайдено");
    } finally {
      setLoading(false);
    }
  }

  async function loadSlots() {
    setSlotsLoading(true);
    setSelectedTime("");
    try {
      const data = await api.getMasterSlots(masterId, selectedDate);
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }

  async function handleSubmit() {
    if (!selectedService || !selectedDate || !selectedTime) {
      setError("Заповніть всі обов'язкові поля");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.createBooking({
        masterId,
        serviceId: selectedService,
        date: selectedDate,
        startTime: selectedTime,
        notes: notes || undefined,
      });
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Помилка при бронюванні");
    } finally {
      setSubmitting(false);
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  // Get selected service details
  const svc = master?.services?.find((s) => s.id === selectedService);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="h-64 shimmer rounded-2xl" />
        </div>
      </AppLayout>
    );
  }

  if (success) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
            Бронювання створено!
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Очікуйте підтвердження від майстра
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/masters/${masterId}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)] font-semibold text-sm px-6 py-3 rounded-xl hover:border-[var(--accent)] transition-colors"
            >
              ← Профіль майстра
            </Link>
            <Link
              href="/catalog"
              className="bg-[var(--accent)] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[var(--accent-dark)] transition-all"
            >
              🔍 Знайти ще
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href={`/masters/${masterId}`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mb-6 hover:text-[var(--text)] transition-colors"
        >
          ← Назад до профілю
        </Link>

        <h1 className="text-2xl font-extrabold text-[var(--text)] mb-1">
          Записатися
        </h1>
        {master && (
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {master.city?.country?.flagEmoji} {master.name}
            {master.city && ` — ${master.city.name}`}
          </p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Service */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-4">
          <h3 className="text-sm font-bold text-[var(--text)] mb-3">
            1. Оберіть послугу
          </h3>
          <div className="space-y-2">
            {master?.services?.map((svc) => (
              <label
                key={svc.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedService === svc.id
                    ? "border-[var(--accent)] bg-[var(--accent-light)]"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="service"
                    value={svc.id}
                    checked={selectedService === svc.id}
                    onChange={() => setSelectedService(svc.id)}
                    className="accent-[var(--accent)]"
                  />
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">
                      {svc.name}
                    </div>
                    {svc.durationMin && (
                      <div className="text-xs text-[var(--text-tertiary)]">
                        ⏱ {svc.durationMin} хв
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-bold text-[var(--accent)]">
                  {svc.price}₴
                </span>
              </label>
            ))}
            {(!master?.services || master.services.length === 0) && (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-4">
                Послуги не додані
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Date */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-4">
          <h3 className="text-sm font-bold text-[var(--text)] mb-3">
            2. Оберіть дату
          </h3>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors"
          />
        </div>

        {/* Step 3: Time */}
        {selectedDate && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3">
              3. Оберіть час
            </h3>
            {slotsLoading ? (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-10 shimmer rounded-lg" />
                ))}
              </div>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                      selectedTime === time
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-elevated)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-4">
                Немає доступних слотів на цю дату
              </p>
            )}
          </div>
        )}

        {/* Step 4: Notes */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
          <h3 className="text-sm font-bold text-[var(--text)] mb-3">
            4. Коментар (необов'язково)
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Побажання, деталі..."
            rows={3}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Summary + Submit */}
        {selectedService && selectedDate && selectedTime && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-4">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3">
              📋 Ваш запис
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Послуга</span>
                <span className="font-semibold text-[var(--text)]">
                  {svc?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Дата</span>
                <span className="font-semibold text-[var(--text)]">
                  {new Date(selectedDate).toLocaleDateString("uk-UA", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Час</span>
                <span className="font-semibold text-[var(--text)]">
                  {selectedTime}
                  {svc?.durationMin && ` (${svc.durationMin} хв)`}
                </span>
              </div>
              {svc?.price && (
                <div className="flex justify-between pt-2 border-t border-[var(--border)]">
                  <span className="font-bold text-[var(--text)]">Ціна</span>
                  <span className="font-bold text-[var(--accent)]">
                    {svc.price}₴
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedService || !selectedDate || !selectedTime || submitting}
          className="w-full bg-[var(--accent)] text-white font-bold text-sm py-4 rounded-xl hover:bg-[var(--accent-dark)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "⏳ Бронюємо..." : "✅ Підтвердити запис"}
        </button>
      </div>
    </AppLayout>
  );
}
