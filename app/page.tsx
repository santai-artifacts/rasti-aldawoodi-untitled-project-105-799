import { Suspense } from "react";
import ApodSection from "./components/ApodSection";
import NeoSection from "./components/NeoSection";
import MarsSection from "./components/MarsSection";
import SectionSkeleton from "./components/SectionSkeleton";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #050914 0%, #0a0f2e 50%, #050914 100%)" }}>
      {/* Star field */}
      <div
        className="fixed inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: [
            "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 25% 75%, rgba(255,255,255,0.4) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 50% 40%, rgba(255,255,255,0.5) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 70% 15%, rgba(255,255,255,0.5) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.4) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.5) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 80% 85%, rgba(255,255,255,0.4) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 60% 55%, rgba(255,255,255,0.3) 0%, transparent 100%)",
            "radial-gradient(2px 2px at 15% 45%, rgba(147,197,253,0.5) 0%, transparent 100%)",
            "radial-gradient(2px 2px at 65% 30%, rgba(196,181,253,0.4) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 42% 10%, rgba(255,255,255,0.45) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 5% 65%, rgba(255,255,255,0.35) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 95% 35%, rgba(255,255,255,0.45) 0%, transparent 100%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border" style={{ borderColor: "rgba(96,165,250,0.25)", background: "rgba(30,58,138,0.25)" }}>
            <svg className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#93c5fd" }}>NASA Open APIs · DEMO_KEY</span>
          </div>
          <h1
            className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 leading-tight"
            style={{ background: "linear-gradient(135deg, #fff 0%, #93c5fd 45%, #c4b5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Space Dashboard
          </h1>
          <p className="text-lg max-w-md mx-auto" style={{ color: "#94a3b8" }}>
            Live astronomy data streaming from three NASA endpoints
          </p>
        </header>

        {/* APOD — full width */}
        <section className="mb-8">
          <Suspense fallback={<SectionSkeleton height="h-[420px]" label="Astronomy Picture of the Day" />}>
            <ApodSection />
          </Suspense>
        </section>

        {/* NEO + Mars — side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Suspense fallback={<SectionSkeleton height="h-[500px]" label="Near-Earth Objects" />}>
            <NeoSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton height="h-[500px]" label="Mars Rover Photos" />}>
            <MarsSection />
          </Suspense>
        </div>

        <footer className="mt-16 text-center text-sm" style={{ color: "#475569" }}>
          Data provided by{" "}
          <a href="https://api.nasa.gov" className="transition-colors hover:underline" style={{ color: "#60a5fa" }} target="_blank" rel="noopener noreferrer">
            api.nasa.gov
          </a>
        </footer>
      </div>
    </div>
  );
}
