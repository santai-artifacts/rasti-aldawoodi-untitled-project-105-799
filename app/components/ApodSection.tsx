import Image from "next/image";

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
}

async function fetchApod(): Promise<ApodData> {
  const key = process.env.NASA_API_KEY ?? "DEMO_KEY";
  const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`APOD fetch failed: ${res.status}`);
  return res.json();
}

export default async function ApodSection() {
  let data: ApodData;
  try {
    data = await fetchApod();
  } catch {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#f87171" }}>Could not load Astronomy Picture of the Day.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(255,255,255,0.08)" }}>
      {/* Section label */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#60a5fa" }} />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#60a5fa" }}>
            Astronomy Picture of the Day
          </span>
        </div>
        <span className="text-xs" style={{ color: "#475569" }}>{data.date}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-0">
        {/* Image */}
        {data.media_type === "image" ? (
          <div className="relative lg:w-1/2 min-h-[260px] lg:min-h-[360px] overflow-hidden">
            <Image
              src={data.url}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(15,23,42,0.7))" }} />
          </div>
        ) : (
          <div className="relative lg:w-1/2 min-h-[260px] flex items-center justify-center" style={{ background: "#0f172a" }}>
            <iframe
              src={data.url}
              className="w-full h-full min-h-[260px]"
              title={data.title}
              allowFullScreen
            />
          </div>
        )}

        {/* Text */}
        <div className="lg:w-1/2 px-6 pb-6 pt-2 lg:pt-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ color: "#f1f5f9" }}>
            {data.title}
          </h2>
          {data.copyright && (
            <p className="text-xs mb-3" style={{ color: "#64748b" }}>
              &copy; {data.copyright}
            </p>
          )}
          <p className="text-sm leading-relaxed line-clamp-6" style={{ color: "#94a3b8" }}>
            {data.explanation}
          </p>
          {data.hdurl && (
            <a
              href={data.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "#60a5fa" }}
            >
              View full resolution
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
