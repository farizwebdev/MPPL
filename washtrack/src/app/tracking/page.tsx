"use client";

import { Suspense } from "react";
import TrackingContent from "./TrackingContent";

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-gray-400">Memuat...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
