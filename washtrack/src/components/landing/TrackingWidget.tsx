"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "./Icons";

export default function TrackingWidget() {
  const router = useRouter();
  const [resi, setResi] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (resi.trim()) {
      router.push(`/tracking?resi=${encodeURIComponent(resi.trim())}`);
    }
  }

  return (
    <section
      id="trackingwidget"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-16 sm:py-24"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        {/* Icon badge */}
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm transition-all duration-600 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6 text-white"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M16 16l4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2
          className={`mt-6 text-center text-3xl font-bold tracking-tight text-white transition-all duration-600 sm:text-4xl ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Lacak Cucian Anda Sekarang
        </h2>

        <p
          className={`mt-3 text-center text-blue-200 transition-all duration-600 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Masukkan nomor resi untuk melihat status terbaru cucian Anda secara
          real-time
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`mx-auto mt-8 flex max-w-xl flex-col gap-3 transition-all duration-600 sm:flex-row ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              suppressHydrationWarning
              type="text"
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              placeholder="Masukkan nomor resi..."
              className="w-full rounded-xl border-0 bg-white/10 py-3.5 pl-11 pr-4 text-sm text-white shadow-sm outline-none ring-1 ring-white/30 backdrop-blur-sm transition-all placeholder:text-blue-200 focus:bg-white/15 focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            suppressHydrationWarning
            type="submit"
            className="group flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-50"
          >
            Cari
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        {/* Alternative link */}
        <p
          className={`mt-4 text-center text-sm text-blue-300 transition-all duration-600 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          Atau{" "}
          <a
            href="/tracking"
            className="font-medium text-white underline underline-offset-2 transition-all hover:no-underline"
          >
            cari berdasarkan nomor HP
          </a>
        </p>

        {/* Social proof */}
        <div
          className={`mt-8 flex items-center justify-center gap-2 text-sm text-blue-200 transition-all duration-600 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <span className="flex -space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-[10px] font-bold text-white">
              SD
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-[10px] font-bold text-white">
              RH
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-[10px] font-bold text-white">
              MP
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-[10px] font-bold text-white">
              +
            </span>
          </span>
          <span>Dipercaya 1,000+ pelanggan</span>
        </div>
      </div>
    </section>
  );
}
