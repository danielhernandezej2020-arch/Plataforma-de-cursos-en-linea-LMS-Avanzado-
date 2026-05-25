"use client";

type StatColor = "blue" | "green" | "orange" | "red" | "cyan" | "emerald" | "amber" | "violet";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: number;
  trendLabel?: string;
  color?: StatColor;
  delay?: number;
}

const accentMap: Record<StatColor, string> = {
  blue:    "var(--accent-sunset)",
  cyan:    "var(--accent-sunset)",
  green:   "#3d9e6e",
  emerald: "#3d9e6e",
  orange:  "var(--accent-sunset)",
  amber:   "var(--accent-sunset)",
  red:     "#e05c6a",
  violet:  "var(--accent-dusk)",
};

export function StatCard({ label, value, icon, trend, trendLabel, color = "blue", delay = 0 }: StatCardProps) {
  const trendUp = trend !== undefined && trend >= 0;

  return (
    <div
      className="anim-fade-up"
      style={{
        animationDelay: `${delay}s`,
        background: "var(--canvas-card)",
        border: "1px solid var(--hairline)",
        borderRadius: 8,
        padding: 24,
      }}
    >
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 16,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: "1.2px",
          color: "var(--body-mid)",
          textTransform: "uppercase",
        }}>
          {label}
        </span>
        {icon && (
          <span style={{
            fontSize: 16,
            background: "var(--canvas-soft)",
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            padding: "4px 7px",
          }}>
            {icon}
          </span>
        )}
      </div>

      <div style={{
        fontFamily: "var(--font-sans)",
        fontSize: 32, fontWeight: 400, lineHeight: "36px",
        letterSpacing: "-0.6px", color: "var(--ink)",
      }}>
        {value}
      </div>

      {trend !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12, fontWeight: 400,
            color: trendUp ? "#3d9e6e" : "#e05c6a",
          }}>
            {trendUp ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
          {trendLabel && (
            <span style={{
              fontSize: 12, color: "var(--body-mid)", fontWeight: 400,
            }}>{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
