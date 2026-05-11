const services = [
  {
    id: "REGULER",
    icon: "📦",
    name: "Reguler",
    duration: "3 hari",
    price: 4000,
    desc: "Layanan standar dengan kualitas terbaik. Cocok untuk cucian harian Anda.",
  },
  {
    id: "KILAT_2",
    icon: "⚡",
    name: "Kilat (2 hari)",
    duration: "2 hari",
    price: 5000,
    desc: "Lebih cepat dengan hasil yang sama sempurna. Untuk Anda yang sedikit buru-buru.",
  },
  {
    id: "KILAT_1",
    icon: "🔥",
    name: "Kilat (1 hari)",
    duration: "1 hari",
    price: 8000,
    desc: "Selesai dalam 1x24 jam. Cocok untuk kebutuhan mendadak.",
  },
  {
    id: "EXPRESS",
    icon: "🚀",
    name: "Express",
    duration: "5 jam",
    price: 10000,
    desc: "Super cepat! Selesai hanya dalam 5 jam. Untuk prioritas tertinggi Anda.",
  },
];

function formatPrice(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export default function Services() {
  return (
    <section id="services" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Pilihan Layanan
          </h2>
          <p className="mt-3 text-gray-600">
            Harga terjangkau untuk setiap kebutuhan Anda
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <span className="text-3xl">{svc.icon}</span>
              <h3 className="mt-4 font-bold text-gray-900">{svc.name}</h3>
              <p className="mt-1 text-xs text-gray-400">
                Estimasi: {svc.duration}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {svc.desc}
              </p>
              <p className="mt-4 text-2xl font-bold text-blue-600">
                {formatPrice(svc.price)}
                <span className="text-sm font-normal text-gray-400"> /kg</span>
              </p>
              <a
                href="/tracking"
                className="mt-4 flex w-full items-center justify-center rounded-xl border border-blue-600 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              >
                Pilih Layanan
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
