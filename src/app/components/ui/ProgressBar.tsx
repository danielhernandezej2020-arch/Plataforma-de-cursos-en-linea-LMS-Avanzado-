"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "cyan" | "emerald" | "amber" | "violet";
  height?: number;
}

const colorMap = {
  cyan:    "var(--ink)",
  emerald: "#3d9e6e",
  amber:   "var(--accent-sunset)",
  violet:  "var(--accent-dusk)",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  color = "cyan",
  height = 6,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div>
      {(label || showPercent) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          {label && <span style={{ fontSize: 12, color: "var(--body)", fontWeight: 400 }}>{label}</span>}
          {showPercent && <span style={{ fontSize: 12, color: "var(--ink)", fontFamily: "var(--font-mono)", fontWeight: 400 }}>{pct}%</span>}
        </div>
      )}
      <div className="progress-bar-track" style={{ height }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${pct}%`,
            background: colorMap[color],
            height: "100%",
            borderRadius: 9999,
          }}
        />
      </div>
    </div>
  );
}
