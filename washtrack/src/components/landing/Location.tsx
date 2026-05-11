export default function Location() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Kunjungi Kami
          </h2>
          <p className="mt-3 text-gray-600">
            Datang langsung ke toko kami untuk konsultasi dan layanan
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="mt-1 text-xl">📍</span>
              <div>
                <h3 className="font-semibold text-gray-900">Alamat</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Jl. Laundry On Express No. 123
                  <br />
                  Kelurahan Sukamaju, Kecamatan Cimahi
                  <br />
                  Bandung, Jawa Barat 40512
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 text-xl">🕐</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Jam Operasional
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Senin - Minggu: 08.00 - 21.00
                </p>
                <p className="text-xs text-gray-400">
                  Buka setiap hari, termasuk hari libur nasional
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 text-xl">📞</span>
              <div>
                <h3 className="font-semibold text-gray-900">Kontak</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Telepon/WhatsApp: 0812-3456-7890
                </p>
                <p className="text-xs text-gray-400">
                  Email: hello@laundryonexpress.com
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-2xl bg-blue-50 p-8">
            <div className="text-center">
              <span className="text-5xl">🧺</span>
              <p className="mt-3 text-sm font-medium text-blue-700">
                Laundry On Express
              </p>
              <p className="mt-1 text-xs text-blue-500">
        Datang, serahkan, kami urus sisanya!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
