import Image from "next/image";

interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  sol: number;
  camera: { full_name: string; name: string };
  rover: { name: string; status: string };
}

async function fetchMarsPhotos(): Promise<MarsPhoto[]> {
  const res = await fetch(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=3500&page=1&api_key=${process.env.NASA_API_KEY ?? "DEMO_KEY"}`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error(`Mars photos fetch failed: ${res.status}`);
  const data = await res.json();
  return (data.photos as MarsPhoto[]).slice(0, 6);
}

const cameraColors: Record<string, string> = {
  FHAZ: "#60a5fa",
  RHAZ: "#a78bfa",
  MAST: "#34d399",
  CHEMCAM: "#f472b6",
  MAHLI: "#fb923c",
  MARDI: "#facc15",
  NAVCAM: "#94a3b8",
};

export default async function MarsSection() {
  let photos: MarsPhoto[];
  try {
    photos = await fetchMarsPhotos();
  } catch {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#f87171" }}>Could not load Mars rover photos.</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#94a3b8" }}>No photos available for this sol.</p>
      </div>
    );
  }

  const rover = photos[0].rover;
  const sol = photos[0].sol;
  const earthDate = photos[0].earth_date;

  return (
    <div className="rounded-2xl border overflow-hidden flex flex-col" style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#f87171" }} />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#f87171" }}>
            Mars Rover &middot; {rover.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
            {rover.status}
          </span>
        </div>
      </div>

      <div className="px-6 pb-3">
        <p className="text-xs" style={{ color: "#64748b" }}>
          Sol {sol} &middot; Earth date {earthDate}
        </p>
      </div>

      {/* Photo grid */}
      <div className="px-6 pb-6 grid grid-cols-3 gap-2 flex-1">
        {photos.map((photo) => {
          const camColor = cameraColors[photo.camera.name] ?? "#94a3b8";
          return (
            <div key={photo.id} className="relative rounded-xl overflow-hidden group" style={{ aspectRatio: "1", background: "#0f172a" }}>
              <Image
                src={photo.img_src.replace(/^http:\/\//, "https://")}
                alt={`Mars photo by ${photo.camera.full_name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
              />
              {/* Camera badge on hover */}
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
                <span className="px-2 py-1.5 m-1.5 rounded-lg text-xs font-bold" style={{ background: "rgba(0,0,0,0.6)", color: camColor }}>
                  {photo.camera.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Camera legend */}
      <div className="px-6 pb-5">
        <p className="text-xs mb-2" style={{ color: "#475569" }}>Cameras</p>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(photos.map((p) => p.camera.name))).map((cam) => (
            <span key={cam} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: cameraColors[cam] ?? "#94a3b8" }} />
              <span style={{ color: "#94a3b8" }}>{cam}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
