interface Props {
  height?: string;
  label?: string;
}

export default function SectionSkeleton({ height = "h-64", label }: Props) {
  return (
    <div className={`rounded-2xl border ${height} flex flex-col items-center justify-center gap-3`} style={{ background: "rgba(15,23,42,0.7)", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#60a5fa" }} />
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#a78bfa", animationDelay: "0.2s" }} />
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#60a5fa", animationDelay: "0.4s" }} />
      </div>
      {label && (
        <p className="text-sm font-medium" style={{ color: "#64748b" }}>
          Loading {label}&hellip;
        </p>
      )}
    </div>
  );
}
