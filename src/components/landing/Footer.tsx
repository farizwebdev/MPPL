import Link from "next/link";
import { LogoIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
              <LogoIcon className="h-6 w-6" />
              Ase Laundry
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Sistem Informasi Manajemen &amp; Pelacakan Laundry. Solusi digital
              untuk kemudahan laundry Anda.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Tautan</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/tracking"
                  className="text-sm text-gray-500 transition-colors hover:text-white"
                >
                  Lacak Cucian
                </Link>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-sm text-gray-500 transition-colors hover:text-white"
                >
                  Harga Layanan
                </a>
              </li>
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-sm text-gray-500 transition-colors hover:text-white"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Kontak</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li>0821-3634-7300</li>
              <li>aselaundry@gmail.com</li>
              <li>Jl. Sorowajan Baru Banguntapan Bantul, Daerah Istimewa Yogyakarta</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-600">
          &copy; 2026 Ase Laundry. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
