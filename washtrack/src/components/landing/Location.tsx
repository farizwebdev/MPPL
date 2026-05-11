"use client";

import { useEffect, useRef, useState } from "react";
import { PinIcon, ClockIcon, PhoneIcon, LogoIcon } from "./Icons";

function MapIllustration() {
  return (
    <svg viewBox="0 0 280 100" fill="none" className="h-full w-full" aria-hidden="true">
      <rect width="280" height="100" rx="12" fill="url(#map-grad)" />
      <path d="M0 30h280M0 60h280M0 85h280" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
      <path d="M70 0v100M140 0v100M210 0v100" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
      <circle cx="140" cy="45" r="7" fill="#2563EB" stroke="white" strokeWidth="2.5" />
      <circle cx="140" cy="45" r="2.5" fill="white" />
      <path d="M140 52l-1.5 4.5h3l-1.5-4.5z" fill="#2563EB" />
      <rect x="60" y="68" width="20" height="12" rx="2" fill="white" fillOpacity="0.12" />
      <rect x="195" y="20" width="18" height="10" rx="2" fill="white" fillOpacity="0.12" />
      <rect x="205" y="72" width="24" height="14" rx="3" fill="white" fillOpacity="0.08" />
      <defs>
        <linearGradient id="map-grad" x1="0" y1="0" x2="280" y2="100">
          <stop stopColor="#DBEAFE" />
          <stop offset="1" stopColor="#BFDBFE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M11 7.5v3a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 011 10.5v-7A1.5 1.5 0 012.5 2h3M8 1h5v5M13 1L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const infoItems = [
  {
    icon: PinIcon,
    title: "Alamat",
    lines: [
      "Jl. Laundry On Express No. 123",
      "Kelurahan Sukamaju, Kecamatan Cimahi",
      "Bandung, Jawa Barat 40512",
    ],
  },
  {
    icon: ClockIcon,
    title: "Jam Operasional",
    lines: ["Senin - Minggu: 08.00 - 21.00"],
    sub: "Buka setiap hari, termasuk hari libur nasional",
  },
  {
    icon: PhoneIcon,
    title: "Kontak",
    lines: ["Telepon/WhatsApp: 0812-3456-7890"],
    sub: "Email: hello@laundryonexpress.com",
  },
];

function InfoCard({
  item,
  index,
  visible,
}: {
  item: (typeof infoItems)[0];
  index: number;
  visible: boolean;
}) {
  const Icon = item.icon;

  return (
    <div
      className={`group rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-all duration-500 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-sm ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white group-hover:shadow-md">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
          {item.lines.map((line) => (
            <p key={line} className="mt-0.5 text-sm leading-relaxed text-gray-500">
              {line}
            </p>
          ))}
          {item.sub && (
            <p className="mt-0.5 text-xs text-gray-400">{item.sub}</p>
          )}
        </div>
      </div>

      <div className="mt-3 h-px w-10 rounded-full bg-blue-200 transition-all duration-300 group-hover:w-14 group-hover:bg-blue-400" />
    </div>
  );
}

export default function Location() {
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
      className="relative overflow-hidden bg-white py-12 sm:py-20"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-12 right-1/4 h-32 w-32 rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute bottom-8 left-1/3 h-28 w-28 rounded-full bg-blue-50/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Kunjungi Kami
          </h2>
          <p className="mt-3 text-gray-500">
            Datang langsung ke toko kami untuk konsultasi dan layanan
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Left — info cards */}
          <div className="space-y-3">
            {infoItems.map((item, i) => (
              <InfoCard
                key={item.title}
                item={item}
                index={i}
                visible={visible}
              />
            ))}
          </div>

          {/* Right — map + CTA */}
          <div
            className={`flex flex-col rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-700 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Map illustration */}
            <div className="overflow-hidden rounded-t-2xl">
              <MapIllustration />
            </div>

            {/* Brand + CTA */}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <LogoIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Laundry On Express
                  </p>
                  <p className="text-xs text-gray-400">
                    Datang, serahkan, kami urus sisanya.
                  </p>
                </div>
              </div>

              <a
                href="#"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white"
              >
                <ExternalIcon />
                Buka Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
