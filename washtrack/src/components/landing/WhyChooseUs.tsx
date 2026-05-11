"use client";

import { useEffect, useRef, useState } from "react";
import { PinIcon, ShirtIcon, ClockIcon, TagIcon } from "./Icons";

const reasons = [
  {
    icon: PinIcon,
    title: "Real-time Tracking",
    desc: "Pantau status cucian Anda 24/7 dari mana saja tanpa perlu bertanya ke toko.",
    points: ["Notifikasi otomatis via WhatsApp", "Update status real-time", "History pesanan tercatat"],
  },
  {
    icon: ShirtIcon,
    title: "Kualitas Terjamin",
    desc: "Proses cuci dan setrika profesional dengan standar tinggi untuk setiap pakaian.",
    points: ["Penanganan khusus per jenis kain", "Pengecekan kualitas ketat", "Catatan kondisi detail"],
  },
  {
    icon: ClockIcon,
    title: "Tepat Waktu",
    desc: "Komitmen kami menyelesaikan pesanan sesuai estimasi, tanpa keterlambatan.",
    points: ["Estimasi akurat", "Prioritas untuk layanan kilat", "Garansi tepat waktu"],
  },
  {
    icon: TagIcon,
    title: "Harga Bersahabat",
    desc: "Layanan premium dengan harga transparan, tanpa biaya tersembunyi.",
    points: ["Mulai Rp4.000/kg", "Harga tetap sesuai layanan", "Tidak ada biaya tambahan"],
  },
];

function ReasonCard({
  item,
  index,
  visible,
}: {
  item: (typeof reasons)[0];
  index: number;
  visible: boolean;
}) {
  const Icon = item.icon;

  return (
    <div
      className={`group rounded-2xl border border-gray-100 bg-white p-7 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-blue-100 hover:shadow-sm ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white group-hover:shadow-md">
        <Icon className="h-6 w-6" />
      </div>

      {/* Title */}
      <h3 className="mt-5 text-lg font-bold text-gray-900">{item.title}</h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        {item.desc}
      </p>

      {/* Bullet points */}
      <ul className="mt-4 space-y-2">
        {item.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-gray-500">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="3" fill="currentColor" />
            </svg>
            {point}
          </li>
        ))}
      </ul>

      {/* Bottom bar */}
      <div className="mt-6 h-px w-12 rounded-full bg-gray-200 transition-all duration-300 group-hover:w-full group-hover:bg-blue-100" />
    </div>
  );
}

export default function WhyChooseUs() {
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
      className="relative overflow-hidden bg-white py-16 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-1/4 h-40 w-40 rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute bottom-10 right-1/3 h-36 w-36 rounded-full bg-blue-50/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Kenapa Pilih Kami?
          </h2>
          <p className="mt-3 text-gray-500">
            Kami berkomitmen memberikan pelayanan laundry terbaik untuk Anda
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, i) => (
            <ReasonCard
              key={item.title}
              item={item}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
