"use client";

import { useEffect, useRef, useState } from "react";
import { DropOffIcon, ProcessIcon, PickupIcon } from "./Icons";

const steps = [
  {
    number: "01",
    title: "Serahkan",
    description:
      "Antar pakaian Anda ke Laundry On Express. Kami akan menimbang dan mencatat detail pesanan Anda.",
    icon: DropOffIcon,
  },
  {
    number: "02",
    title: "Kami Proses",
    description:
      "Cuci, setrika, dan packing dengan standar kualitas tinggi. Pantau status cucian via website kapan saja.",
    icon: ProcessIcon,
  },
  {
    number: "03",
    title: "Ambil",
    description:
      "Dapatkan notifikasi via WhatsApp saat pesanan siap. Cukup tunjukkan nomor resi saat pengambilan.",
    icon: PickupIcon,
  },
];

function StepCard({
  step,
  index,
  visible,
}: {
  step: (typeof steps)[0];
  index: number;
  visible: boolean;
}) {
  const Icon = step.icon;

  return (
    <div
      className={`group relative rounded-2xl border border-gray-100 bg-white p-7 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-blue-100 hover:shadow-sm ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Step number */}
      <span className="text-5xl font-bold tracking-tight text-blue-600">
        {step.number}
      </span>

      {/* Icon */}
      <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>

      {/* Title */}
      <h3 className="mt-5 text-lg font-bold text-gray-900">
        {step.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        {step.description}
      </p>

      {/* Bottom accent bar */}
      <div className="mt-6 h-px w-10 rounded-full bg-blue-200 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-400" />
    </div>
  );
}

export default function HowItWorks() {
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
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-50 py-16 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-1/4 h-40 w-40 rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-blue-50/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cara Kerja
          </h2>
          <p className="mt-3 text-gray-500">
            Hanya 3 langkah mudah untuk cucian bersih dan rapi
          </p>
        </div>

        <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
