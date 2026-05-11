import Link from "next/link";

function LaundryIllustration() {
  return (
    <svg
      viewBox="0 0 400 340"
      fill="none"
      className="w-full max-w-md"
      aria-hidden="true"
    >
      {/* Basket body */}
      <rect x="100" y="150" width="200" height="150" rx="16" fill="#E5E7EB" />
      <rect
        x="80"
        y="120"
        width="240"
        height="40"
        rx="12"
        fill="#2563EB"
      />
      <rect
        x="80"
        y="120"
        width="240"
        height="40"
        rx="12"
        fill="url(#basketRim)"
        fillOpacity="0.1"
      />
      {/* Blue shirt */}
      <rect x="130" y="170" width="60" height="80" rx="8" fill="#60A5FA" />
      {/* Green shirt */}
      <rect x="210" y="180" width="50" height="70" rx="8" fill="#34D399" />
      {/* Yellow item */}
      <rect x="155" y="230" width="40" height="40" rx="8" fill="#FBBF24" />
      {/* Decorative dots */}
      <circle cx="70" cy="200" r="5" fill="#2563EB" fillOpacity="0.2" />
      <circle cx="340" cy="170" r="7" fill="#2563EB" fillOpacity="0.15" />
      <circle cx="330" cy="260" r="4" fill="#2563EB" fillOpacity="0.2" />
      <circle cx="60" cy="280" r="3" fill="#2563EB" fillOpacity="0.15" />
      {/* Steam lines */}
      <line
        x1="190"
        y1="100"
        x2="190"
        y2="80"
        stroke="#93C5FD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="210"
        y1="105"
        x2="210"
        y2="90"
        stroke="#93C5FD"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="basketRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-medium text-blue-700">
              Laundry On Express
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Laundry Premium,{" "}
              <span className="text-blue-600">Anti Ribet.</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              Serahkan pakaian Anda, kami urus sisanya. Pantau status cucian
              secara real-time tanpa perlu datang atau chat ke toko.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/tracking"
                className="w-full rounded-xl bg-blue-600 px-8 py-3 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md sm:w-auto"
              >
                Lacak Cucian Anda
              </Link>
              <Link
                href="#services"
                className="w-full rounded-xl border border-gray-300 bg-white px-8 py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
              >
                Lihat Harga
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <LaundryIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
