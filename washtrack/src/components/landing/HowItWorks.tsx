const steps = [
  {
    number: "01",
    title: "Serahkan",
    description:
      "Antar pakaian Anda ke Laundry On Express. Kami akan menimbang dan mencatat detail pesanan Anda.",
  },
  {
    number: "02",
    title: "Kami Proses",
    description:
      "Cuci, setrika, dan packing dengan standar kualitas tinggi. Pantau status cucian via website kapan saja.",
  },
  {
    number: "03",
    title: "Ambil",
    description:
      "Dapatkan notifikasi via WhatsApp saat pesanan siap. Cukup tunjukkan nomor resi saat pengambilan.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cara Kerja
          </h2>
          <p className="mt-3 text-gray-500">
            Hanya 3 langkah mudah untuk cucian bersih dan rapi
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] border-t border-dashed border-gray-300 sm:block" />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 tracking-wider text-white shadow-sm">
                <span className="text-sm font-bold">{step.number}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
