"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Sari Dewi",
    role: "Pelanggan Reguler",
    initial: "SD",
    rating: 5,
    quote:
      "Pelayanannya cepat dan rapi. Saya bisa pantau status cucian dari rumah tanpa perlu bolak-balik nanya ke laundry. Sangat membantu!",
  },
  {
    name: "Rudi Hartono",
    role: "Pelanggan Kilat",
    initial: "RH",
    rating: 5,
    quote:
      "Butuh cucian cepat karena besok dinas luar kota. Express 5 jam benar-benar tepat waktu. Recommended banget!",
  },
  {
    name: "Mega Putri",
    role: "Pelanggan Reguler",
    initial: "MP",
    rating: 5,
    quote:
      "Catatan khususnya detail banget. Waktu ada baju yang luntur, sudah dicatat di sistem jadi tidak ada komplain di kemudian hari.",
  },
];

function StarIcons({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          fill="none"
          className={`h-4 w-4 ${i < count ? "text-yellow-400" : "text-gray-200"}`}
          aria-hidden="true"
        >
          <path
            d="M8 1l1.8 3.65 4.03.59-2.92 2.84.69 4.02L8 10.25l-3.6 1.85.69-4.02L2.17 5.24l4.03-.59L8 1z"
            fill={i < count ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

function QuoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8 text-blue-100"
      aria-hidden="true"
    >
      <path
        d="M9.5 11H5l2-5h3l-3 6v6h4.5v-7zM19.5 11H15l2-5h3l-3 6v6h4.5v-7z"
        fill="currentColor"
      />
    </svg>
  );
}

function TestimonialCard({
  t,
  index,
  visible,
}: {
  t: (typeof testimonials)[0];
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className={`group relative rounded-2xl border border-gray-100 bg-white p-7 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Quote decoration */}
      <div className="absolute top-4 right-4 opacity-50 transition-opacity duration-300 group-hover:opacity-100">
        <QuoteIcon />
      </div>

      {/* Stars */}
      <StarIcons count={t.rating} />

      {/* Quote */}
      <p className="relative mt-4 text-sm leading-relaxed text-gray-500">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-6 flex items-center gap-3.5 border-t border-gray-100 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white group-hover:shadow-md">
          {t.initial}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-400">{t.role}</p>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="mt-5 h-px w-10 rounded-full bg-blue-200 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-400" />
    </div>
  );
}

export default function Testimonials() {
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-50 py-16 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-1/4 h-40 w-40 rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-blue-50/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Apa Kata Pelanggan
          </h2>
          <p className="mt-3 text-gray-500">
            Kepercayaan pelanggan adalah prioritas utama kami
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.name}
              t={t}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
