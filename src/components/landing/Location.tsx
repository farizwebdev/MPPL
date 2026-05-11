"use client";

import { useEffect, useRef, useState } from "react";
import { PinIcon, ClockIcon, PhoneIcon, LogoIcon } from "./Icons";

function MapEmbed() {
  return (
    <iframe
      src="https://www.google.com/maps?q=-7.7913343,110.3982787&output=embed"
      className="h-full w-full"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Lokasi Radja Es Teller Sultan Jogja"
    />
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M11 7.5v3a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 011 10.5v-7A1.5 1.5 0 012.5 2h3M8 1h5v5M13 1L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const infoItems = [
  {
    icon: PinIcon,
    title: "Alamat",
    lines: [
      "Jl. Sorowajan Baru",
      "Kecamatan Banguntapan, Kabupaten Bantul",
      "Daerah Istimewa Yogyakarta",
    ],
  },
  {
    icon: ClockIcon,
    title: "Jam Operasional",
    lines: ["Senin - Minggu: 07.00 - 21.00"],
    sub: "Buka setiap hari, termasuk hari libur nasional",
  },
  {
    icon: PhoneIcon,
    title: "Kontak",
    lines: ["Telepon/WhatsApp: 0821-3634-7300"],
    sub: "Email: aselaundry@gmail.com",
  },
];

function InfoCard({
  item,
  index,
  visible,
}: {
  item: (typeof infoItems)[0];
  index: number;
  visible: boolean;
}) {
  const Icon = item.icon;

  return (
    <div
      className={`group rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-all duration-500 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-sm ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white group-hover:shadow-md">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
          {item.lines.map((line) => (
            <p key={line} className="mt-0.5 text-sm leading-relaxed text-gray-500">
              {line}
            </p>
          ))}
          {item.sub && (
            <p className="mt-0.5 text-xs text-gray-400">{item.sub}</p>
          )}
        </div>
      </div>

      <div className="mt-3 h-px w-10 rounded-full bg-blue-200 transition-all duration-300 group-hover:w-14 group-hover:bg-blue-400" />
    </div>
  );
}

export default function Location() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="lokasi"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-12 sm:py-20"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-12 right-1/4 h-32 w-32 rounded-full bg-blue-50/50 blur-3xl" />
        <div className="absolute bottom-8 left-1/3 h-28 w-28 rounded-full bg-blue-50/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Kunjungi Kami
          </h2>
          <p className="mt-3 text-gray-500">
            Datang langsung ke toko kami untuk konsultasi dan layanan
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Left — info cards */}
          <div className="space-y-3">
            {infoItems.map((item, i) => (
              <InfoCard
                key={item.title}
                item={item}
                index={i}
                visible={visible}
              />
            ))}
          </div>

          {/* Right — map + CTA */}
          <div
            className={`flex flex-col rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Map embed */}
            <div className="h-44 overflow-hidden rounded-t-2xl sm:h-48">
              <MapEmbed />
            </div>

            {/* Brand + CTA */}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <LogoIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Ase Laundry
                  </p>
                  <p className="text-xs text-gray-400">
                    Datang, serahkan, kami urus sisanya.
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/place/Radja+Es+Teller+Sultan+Jogja/@-7.7913649,110.3983596,3a,75y,290.72h,92.87t/data=!3m7!1e1!3m5!1s6pynEPhK-ZHN8dbCWPbcdg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-2.8700000000000045%26panoid%3D6pynEPhK-ZHN8dbCWPbcdg%26yaw%3D290.72!7i16384!8i8192!4m7!3m6!1s0x2e7a590040e19fed:0xc5f579b601c61418!8m2!3d-7.7913343!4d110.3982787!10e5!16s%2F%2Fg%2F11ldvmbrt5?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white"
              >
                <ExternalIcon />
                Buka Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
