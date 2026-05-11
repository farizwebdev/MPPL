"use client";

import { useEffect, useRef, useState } from "react";
import { BoxIcon, LightningIcon, FireIcon, RocketIcon, ClockIcon } from "./Icons";

const services = [
  {
    id: "REGULER",
    icon: BoxIcon,
    name: "Reguler",
    duration: "3 hari",
    price: 4000,
    desc: "Layanan standar dengan kualitas terbaik. Cocok untuk cucian harian Anda.",
  },
  {
    id: "KILAT_2",
    icon: LightningIcon,
    name: "Kilat",
    duration: "2 hari",
    price: 5000,
    desc: "Lebih cepat dengan hasil yang sama sempurna. Untuk Anda yang sedikit buru-buru.",
    tag: "Populer",
  },
  {
    id: "KILAT_1",
    icon: FireIcon,
    name: "Super Kilat",
    duration: "1 hari",
    price: 8000,
    desc: "Selesai dalam 1x24 jam. Cocok untuk kebutuhan mendadak yang penting.",
  },
  {
    id: "EXPRESS",
    icon: RocketIcon,
    name: "Express",
    duration: "5 jam",
    price: 10000,
    desc: "Super cepat. Selesai hanya dalam 5 jam. Prioritas utama untuk Anda.",
    tag: "Terpopuler",
    featured: true,
  },
];

function formatPrice(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

function ServiceCard({
  svc,
  index,
  visible,
}: {
  svc: (typeof services)[0];
  index: number;
  visible: boolean;
}) {
  const Icon = svc.icon;

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-7 shadow-xs transition-all duration-500 ${svc.featured
          ? "border-blue-200 shadow-sm hover:shadow-md"
          : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
        } ${visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
        }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Tag badge */}
      {svc.tag && (
        <span
          className={`absolute top-4 right-4 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${svc.featured
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-600"
            }`}
        >
          {svc.tag}
        </span>
      )}

      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${svc.featured
            ? "bg-blue-600 text-white group-hover:bg-blue-700"
            : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
          }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Service name */}
      <h3 className="mt-5 text-lg font-bold text-gray-900">{svc.name}</h3>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-100" />

      {/* Duration */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <ClockIcon className="h-4 w-4" />
        <span>Estimasi: {svc.duration}</span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        {svc.desc}
      </p>

      {/* Price */}
      <div className="mt-5">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(svc.price)}
        </span>
        <span className="ml-1 text-sm text-gray-400">/kg</span>
      </div>

      {/* CTA */}
      <a
        href="#"
        className={`mt-5 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-medium transition-all ${svc.featured
            ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
            : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
      >
        Pilih Layanan
      </a>
    </div>
  );
}

export default function Services() {
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
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-50 py-16 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/3 h-48 w-48 rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-36 w-36 rounded-full bg-blue-50/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pilihan Layanan
          </h2>
          <p className="mt-3 text-gray-500">
            Harga terjangkau untuk setiap kebutuhan Anda
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              svc={svc}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
