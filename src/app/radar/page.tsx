"use client";

import { Suspense } from "react";
import RadarPage from "./RadarInner";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-12">Loading radar…</p>}>
      <RadarPage />
    </Suspense>
  );
}
