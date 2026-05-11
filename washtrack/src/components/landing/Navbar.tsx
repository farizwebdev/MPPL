"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LogoIcon } from "./Icons";

const navLinks = [
  { href: "#services", label: "Harga" },
  { href: "/tracking", label: "Lacak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 shadow-xs backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
        >
          <LogoIcon className="h-7 w-7 text-blue-600" />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            WashTrack
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600"
          >
            Login Admin
          </Link>
        </nav>

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
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-600"
            >
              Login Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
