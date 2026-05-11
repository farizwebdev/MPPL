import { PinIcon, ShirtIcon, ClockIcon, TagIcon } from "./Icons";

const reasons = [
  {
    icon: PinIcon,
    title: "Real-time Tracking",
    desc: "Pantau status cucian Anda 24/7 dari mana saja. Cukup masukkan nomor resi di portal tracking kami.",
  },
  {
    icon: ShirtIcon,
    title: "Kualitas Terjamin",
    desc: "Proses cuci dan setrika profesional dengan standar tinggi. Setiap pakaian mendapatkan penanganan terbaik.",
  },
  {
    icon: ClockIcon,
    title: "Tepat Waktu",
    desc: "Komitmen kami adalah menyelesaikan pesanan sesuai estimasi waktu yang dijanjikan, tidak ada cerita terlambat.",
  },
  {
    icon: TagIcon,
    title: "Harga Bersahabat",
    desc: "Layanan premium dengan harga mulai dari Rp4.000/kg. Transparan tanpa biaya tersembunyi.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Kenapa Pilih Kami?
          </h2>
          <p className="mt-3 text-gray-500">
            Kami berkomitmen memberikan pelayanan laundry terbaik untuk Anda
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
