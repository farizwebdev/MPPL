"use client";

const steps = ["Antrean", "Dicuci", "Disetrika", "Siap Diambil", "Selesai"];
const stepKeys = ["ANTREAN", "DICUCI", "DISETRIKA", "SIAP_DIAMBIL", "SELESAI"];

interface StatusStepperProps {
  currentStatus: string;
  onUpdate: (newStatus: string) => void;
}

export default function StatusStepper({
  currentStatus,
  onUpdate,
}: StatusStepperProps) {
  const currentIdx = stepKeys.indexOf(currentStatus);

  function goNext() {
    if (currentIdx < stepKeys.length - 1) {
      onUpdate(stepKeys[currentIdx + 1]);
    }
  }

  function goPrev() {
    if (currentIdx > 0) {
      onUpdate(stepKeys[currentIdx - 1]);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-1">
        {steps.map((label, i) => {
          const done = i <= currentIdx;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold sm:h-10 sm:w-10 sm:text-sm ${
                  done
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <p
                className={`mt-1 text-[10px] sm:text-xs ${
                  done ? "font-medium text-blue-700" : "text-gray-400"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIdx <= 0}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30"
        >
          ← Sebelumnya
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={currentIdx >= stepKeys.length - 1}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-30"
        >
          Selanjutnya →
        </button>
      </div>
    </div>
  );
}
