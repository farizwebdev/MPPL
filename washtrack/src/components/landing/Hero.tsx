"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon, LogoIcon } from "./Icons";

function HeroIllustration({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const offsetX = mouseX * 4;
  const offsetY = mouseY * 4;

  return (
    <svg
      viewBox="0 0 460 380"
      fill="none"
      className="w-full max-w-md"
      aria-hidden="true"
      style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
    >
      {/* Basket */}
      <rect x="110" y="170" width="240" height="170" rx="18" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1.5" />
      {/* Basket rim */}
      <rect x="88" y="130" width="284" height="50" rx="14" fill="#2563EB" />
      <rect x="88" y="130" width="284" height="50" rx="14" fill="url(#rimShine)" fillOpacity="0.15" />
      {/* Weave pattern */}
      <line x1="110" y1="200" x2="350" y2="200" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="110" y1="230" x2="350" y2="230" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="110" y1="260" x2="350" y2="260" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="110" y1="290" x2="350" y2="290" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="110" y1="320" x2="350" y2="320" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="190" y1="170" x2="190" y2="340" stroke="#E5E7EB" strokeWidth="1" />
      <line x1="270" y1="170" x2="270" y2="340" stroke="#E5E7EB" strokeWidth="1" />
      {/* Shirt - blue */}
      <rect x="130" y="195" width="64" height="90" rx="8" fill="#60A5FA" />
      <rect x="130" y="195" width="64" height="90" rx="8" fill="url(#shirtFold)" fillOpacity="0.1" />
      <path d="M162 220v65" stroke="#93C5FD" strokeWidth="1" />
      <rect x="140" y="210" width="44" height="6" rx="3" fill="#93C5FD" />
      {/* Shirt - green */}
      <rect x="220" y="205" width="56" height="78" rx="8" fill="#34D399" />
      <rect x="220" y="205" width="56" height="78" rx="8" fill="url(#shirtFold)" fillOpacity="0.1" />
      <path d="M248 228v55" stroke="#6EE7B7" strokeWidth="1" />
      {/* Towel - yellow */}
      <rect x="160" y="265" width="50" height="46" rx="6" fill="#FBBF24" />
      <rect x="172" y="275" width="26" height="26" rx="4" fill="#FDE68A" />
      {/* Steam */}
      <path d="M200 100c-8 12-8 20 0" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" fill="none" className="origin-bottom" style={{ animation: "steam 2.5s ease-out infinite" }} />
      <path d="M220 108c-6 10-6 16 0" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" fill="none" style={{ animation: "steam 2.5s ease-out infinite 0.8s" }} />
      <path d="M240 100c-8 12-8 20 0" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" fill="none" style={{ animation: "steam 2.5s ease-out infinite 1.6s" }} />
      {/* Decorative circles */}
      <circle cx="80" cy="220" r="6" fill="#2563EB" fillOpacity="0.12" style={{ animation: "pulseDot 3s ease-in-out infinite", "--dot-opacity": "0.12" } as React.CSSProperties} />
      <circle cx="380" cy="190" r="8" fill="#2563EB" fillOpacity="0.08" style={{ animation: "pulseDot 3.5s ease-in-out infinite 0.5s", "--dot-opacity": "0.08" } as React.CSSProperties} />
      <circle cx="370" cy="290" r="5" fill="#2563EB" fillOpacity="0.1" style={{ animation: "pulseDot 2.8s ease-in-out infinite 1s", "--dot-opacity": "0.1" } as React.CSSProperties} />
      <circle cx="50" cy="300" r="4" fill="#2563EB" fillOpacity="0.08" style={{ animation: "pulseDot 3.2s ease-in-out infinite 0.3s", "--dot-opacity": "0.08" } as React.CSSProperties} />
      <circle cx="400" cy="320" r="10" fill="#2563EB" fillOpacity="0.06" style={{ animation: "pulseDot 4s ease-in-out infinite 1.5s", "--dot-opacity": "0.06" } as React.CSSProperties} />
      <defs>
        <linearGradient id="rimShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="shirtFold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
  }

  function handleMouseLeave() {
    setMouse({ x: 0, y: 0 });
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Layer 1: Diagonal gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50/30 to-white" />

        {/* Layer 2: Soft radial glow behind text */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-100/30 to-transparent blur-3xl" />

        {/* Layer 3: Decorative circles */}
        <div className="pointer-events-none absolute top-20 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-100/20 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-50/30 to-transparent blur-2xl" />

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
        <div className="flex flex-col items-center gap-14 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div
              className="opacity-0"
              style={{
                animation: mounted ? "fadeUp 0.5s ease-out forwards" : "none",
              }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-700">
                <LogoIcon className="h-3.5 w-3.5" />
                Laundry Termurah Di Sorowajan
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 opacity-0 sm:text-5xl lg:text-6xl"
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
              className="mt-4 max-w-lg text-base leading-relaxed text-gray-500 opacity-0 sm:text-lg"
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
              className="mt-8 flex flex-col items-center gap-3 opacity-0 sm:flex-row lg:justify-start"
              style={{
                animation: mounted ? "fadeUp 0.6s ease-out 0.45s forwards" : "none",
              }}
            >
              <Link
                href="#trackingwidget"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md sm:w-auto"
              >
                Lacak Cucian Anda
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#services"
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 sm:w-auto"
              >
                Lihat Harga
              </Link>
            </div>
          </div>

          {/* SVG Illustration */}
          <div
            className="flex-1 opacity-0"
            style={{
              animation: mounted ? "fadeInRight 0.7s ease-out 0.2s forwards" : "none",
            }}
          >
            <div className="animate-[float_4s_ease-in-out_infinite]">
              <HeroIllustration mouseX={mouse.x} mouseY={mouse.y} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
