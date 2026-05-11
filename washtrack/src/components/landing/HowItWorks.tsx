const steps = [
  {
    number: "1",
    icon: "🧺",
    title: "Serahkan",
    description: "Antar pakaian Anda ke Laundry On Express. Kami akan menimbang dan mencatat detail pesanan.",
  },
  {
    number: "2",
    icon: "⚡",
    title: "Kami Proses",
    description: "Cuci, setrika, dan packing dengan standar kualitas tinggi. Pantau status via website kapan saja.",
  },
  {
    number: "3",
    icon: "✅",
    title: "Ambil",
    description: "Dapatkan notifikasi via WhatsApp saat pesanan siap. Cukup tunjukkan resi saat pengambilan.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Cara Kerja
          </h2>
          <p className="mt-3 text-gray-600">
            Hanya 3 langkah mudah untuk cucian bersih dan rapi
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2rem)] hidden h-0.5 w-[calc(100%-4rem)] border-t-2 border-dashed border-blue-200 sm:block" />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl shadow-sm">
                <span>{step.icon}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-blue-600">
                Langkah {step.number}
              </p>
              <h3 className="mt-1 text-lg font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
