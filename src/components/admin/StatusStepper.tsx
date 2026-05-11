"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "./AdminIcons";

const steps = [
  { key: "ANTREAN", label: "Antrean" },
  { key: "DICUCI", label: "Dicuci" },
  { key: "DISETRIKA", label: "Disetrika" },
  { key: "SIAP_DIAMBIL", label: "Siap Diambil" },
  { key: "SELESAI", label: "Selesai" },
];

interface StatusStepperProps {
  currentStatus: string;
  onUpdate: (newStatus: string) => void;
}

const stepIcons = [
  // Antrean
  <svg key="0" viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Dicuci
  <svg key="1" viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="M3 11c0-4 4-7 9-7s9 3 9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 11h18v7a3 3 0 01-3 3H6a3 3 0 01-3-3v-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7 14h2M15 14h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Disetrika
  <svg key="2" viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="M5 13h14l-1.5 7h-11L5 13z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 13l1-6M16 13l-1-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 7l1-3h2l1 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Siap Diambil
  <svg key="3" viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 17h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  // Selesai
  <svg key="4" viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

export default function StatusStepper({
  currentStatus,
  onUpdate,
}: StatusStepperProps) {
  const currentIdx = steps.findIndex((s) => s.key === currentStatus);

  function goNext() {
    if (currentIdx < steps.length - 1) {
      onUpdate(steps[currentIdx + 1].key);
    }
  }

  function goPrev() {
    if (currentIdx > 0) {
      onUpdate(steps[currentIdx - 1].key);
    }
  }

  return (
    <div>
      {/* Stepper */}
      <div className="relative">
        {/* Connecting line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100" />
        {/* Connecting line active */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500"
          style={{
            width: `${(currentIdx / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex items-center justify-between">
          {steps.map((step, i) => {
            const done = i <= currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => onUpdate(step.key)}
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                    done
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-300 hover:border-gray-300 hover:text-gray-500"
                  } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                  disabled={currentStatus === step.key}
                >
                  {stepIcons[i]}
                </button>
                <p
                  className={`mt-2 text-[11px] font-medium transition-all duration-300 sm:text-xs ${
                    done ? "text-blue-700" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIdx <= 0}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-xs transition-all hover:border-gray-300 hover:text-gray-900 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={currentIdx >= steps.length - 1}
          className="group inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Selanjutnya
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
