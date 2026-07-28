interface CloseApproach {
  close_approach_date: string;
  relative_velocity: { kilometers_per_hour: string };
  miss_distance: { kilometers: string };
}

interface Neo {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproach[];
}

interface NeoFeed {
  element_count: number;
  near_earth_objects: Record<string, Neo[]>;
}

function todayUTC(): string {
  return new Date().toISOString().split("T")[0];
}

async function fetchNeo(): Promise<{ count: number; objects: Neo[] }> {
  const today = todayUTC();
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`NEO fetch failed: ${res.status}`);
  const data: NeoFeed = await res.json();
  const objects = Object.values(data.near_earth_objects).flat();
  objects.sort((a, b) => {
    const distA = parseFloat(a.close_approach_data[0]?.miss_distance.kilometers ?? "Infinity");
    const distB = parseFloat(b.close_approach_data[0]?.miss_distance.kilometers ?? "Infinity");
    return distA - distB;
  });
  return { count: data.element_count, objects: objects.slice(0, 8) };
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export default async function NeoSection() {
  let result: { count: number; objects: Neo[] };
  try {
    result = await fetchNeo();
  } catch {
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#f87171" }}>Could not load Near-Earth Object data.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden flex flex-col" style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#f97316" }} />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#f97316" }}>
            Near-Earth Objects
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
          <span className="text-xs font-bold" style={{ color: "#fb923c" }}>{result.count}</span>
          <span className="text-xs" style={{ color: "#78716c" }}>today</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 pb-2">
        <span className="text-xs uppercase tracking-wider" style={{ color: "#475569" }}>Asteroid</span>
        <span className="text-xs uppercase tracking-wider text-right" style={{ color: "#475569" }}>Distance (km)</span>
        <span className="text-xs uppercase tracking-wider text-right" style={{ color: "#475569" }}>Speed</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-1">
        {result.objects.map((neo) => {
          const approach = neo.close_approach_data[0];
          const dist = approach ? parseFloat(approach.miss_distance.kilometers) : null;
          const speed = approach ? parseFloat(approach.relative_velocity.kilometers_per_hour) : null;
          const diameter = (neo.estimated_diameter.kilometers.estimated_diameter_min + neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;

          return (
            <div
              key={neo.id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-3 px-3 rounded-xl transition-colors"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {neo.is_potentially_hazardous_asteroid && (
                  <span className="shrink-0 text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                    ⚠
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#e2e8f0" }}>
                    {neo.name.replace(/[()]/g, "")}
                  </p>
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    ~{(diameter * 1000).toFixed(0)} m wide
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono tabular-nums" style={{ color: "#94a3b8" }}>
                  {dist ? formatNumber(dist) : "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono tabular-nums" style={{ color: "#94a3b8" }}>
                  {speed ? `${formatNumber(speed / 3.6)} m/s` : "—"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
