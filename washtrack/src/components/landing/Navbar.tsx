"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { LogoIcon } from "./Icons";

const navLinks = [
  { href: "#how-it-works", label: "Cara Kerja" },
  { href: "#services", label: "Harga" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#testimoni", label: "Testimoni" },
  { href: "#lokasi", label: "Kunjungi" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      const isScrolled = currentY > 20;

      if (currentY > 60 && currentY > prevScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setScrolled(isScrolled);
      prevScrollY.current = currentY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-white/80 shadow-xs backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center px-4 py-4 sm:px-6">
        {/* Left — logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon className="h-7 w-7 text-blue-600" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Ase Laundry
          </span>
        </Link>

        {/* Center — nav links */}
        <nav className="hidden items-center justify-center gap-5 md:flex xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-1/2 h-px w-0 bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </Link>
          ))}
        </nav>

        {/* Right — CTA (desktop) + hamburger (mobile) */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="#lokasi"
            className="hidden rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 md:inline-flex"
          >
            Hubungi Kami
          </Link>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 px-4 pb-5 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#lokasi"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Hubungi Kami
            </Link>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}
