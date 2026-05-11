const testimonials = [
  {
    name: "Sari Dewi",
    role: "Pelanggan Reguler",
    avatar: "👩",
    rating: 5,
    quote: "Pelayanannya cepat dan rapi. Aku bisa pantau status cucian dari rumah tanpa perlu bolak-balik nanya ke laundry. Sangat membantu!",
  },
  {
    name: "Rudi Hartono",
    role: "Pelanggan Kilat",
    avatar: "👨",
    rating: 5,
    quote: "Butuh cucian cepat karena besok dinas luar kota. Express 5 jam benar-benar tepat waktu. Recommended banget!",
  },
  {
    name: "Mega Putri",
    role: "Pelanggan Reguler",
    avatar: "👩‍🦰",
    rating: 5,
    quote: "Catatan khususnya detail banget. Waktu ada baju yang luntur, sudah dicatat di sistem jadi tidak ada komplain di kemudian hari.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <span className="text-yellow-400">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Apa Kata Pelanggan
          </h2>
          <p className="mt-3 text-gray-600">
            Kepercayaan pelanggan adalah prioritas utama kami
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <StarRating count={t.rating} />
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
