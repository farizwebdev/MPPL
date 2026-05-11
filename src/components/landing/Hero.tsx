"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, LogoIcon } from "./Icons";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Layer 1: Diagonal gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50/30 to-white" />

        {/* Layer 2: Soft radial glow behind text */}
        <div className="pointer-events-none absolute -top-16 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-100/30 to-transparent blur-3xl sm:h-[600px] sm:w-[600px]" />

        {/* Layer 3: Decorative circles */}
        <div className="pointer-events-none absolute top-20 right-0 h-40 w-40 rounded-full bg-gradient-to-br from-blue-100/20 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-gradient-to-tr from-blue-50/30 to-transparent blur-2xl" />

        {/* Layer 4: Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #2563EB 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div
              className="opacity-0"
              style={{
                animation: mounted ? "fadeUp 0.5s ease-out forwards" : "none",
              }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/80 px-3.5 py-1 text-xs font-medium tracking-wide text-blue-700">
                <LogoIcon className="h-3 w-3" />
                Laundry Termurah Di Sorowajan
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mt-4 text-3xl font-bold leading-[1.15] tracking-tight text-gray-900 opacity-0 sm:text-4xl lg:text-6xl"
              style={{
                animation: mounted ? "fadeUp 0.6s ease-out 0.15s forwards" : "none",
              }}
            >
              Laundry Premium
              <br />
              <span className="text-blue-600">Tanpa Ribet.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="mt-3 max-w-lg text-sm leading-relaxed text-gray-500 opacity-0 sm:text-lg"
              style={{
                animation: mounted ? "fadeUp 0.6s ease-out 0.3s forwards" : "none",
              }}
            >
              Nikmati layanan laundry profesional dengan sistem pelacakan
              digital. Cukup serahkan pakaian Anda, pantau status secara
              real-time dari rumah.
            </p>

            {/* CTAs */}
            <div
              className="mt-6 flex flex-col items-center gap-2.5 opacity-0 sm:flex-row lg:justify-start"
              style={{
                animation: mounted ? "fadeUp 0.6s ease-out 0.45s forwards" : "none",
              }}
            >
              <Link
                href="#trackingwidget"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md sm:w-auto"
              >
                Lacak Cucian Anda
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#services"
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 sm:w-auto"
              >
                Lihat Harga
              </Link>
            </div>
          </div>

          {/* Foto Hero */}
          <div
            className="opacity-0 w-full lg:flex-1"
            style={{
              animation: mounted ? "fadeInRight 0.7s ease-out 0.2s forwards" : "none",
            }}
          >
            <div className="animate-[float_4s_ease-in-out_infinite]">
              <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] h-[260px] overflow-hidden rounded-2xl shadow-lg sm:h-[400px]">
                <Image
                  src="/foto_hero.png"
                  alt="Laundry On Express"
                  fill
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 380px, 420px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
