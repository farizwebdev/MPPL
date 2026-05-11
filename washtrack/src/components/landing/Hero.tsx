import Link from "next/link";
import { ArrowRightIcon, LogoIcon } from "./Icons";

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 460 380"
      fill="none"
      className="w-full max-w-md"
      aria-hidden="true"
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
      <path d="M200 100c-8 12-8 20 0" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M220 108c-6 10-6 16 0" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M240 100c-8 12-8 20 0" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Decorative circles */}
      <circle cx="80" cy="220" r="6" fill="#2563EB" fillOpacity="0.12" />
      <circle cx="380" cy="190" r="8" fill="#2563EB" fillOpacity="0.08" />
      <circle cx="370" cy="290" r="5" fill="#2563EB" fillOpacity="0.1" />
      <circle cx="50" cy="300" r="4" fill="#2563EB" fillOpacity="0.08" />
      <circle cx="400" cy="320" r="10" fill="#2563EB" fillOpacity="0.06" />
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
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-white" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #2563EB 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-14 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-700">
              <LogoIcon className="h-3.5 w-3.5" />
              Laundry On Express
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Laundry Premium
              <br />
              <span className="text-blue-600">Tanpa Ribet.</span>
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-500 sm:text-lg">
              Nikmati layanan laundry profesional dengan sistem pelacakan
              digital. Cukup serahkan pakaian Anda, pantau status secara
              real-time dari rumah.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/tracking"
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

          <div className="flex-1">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
