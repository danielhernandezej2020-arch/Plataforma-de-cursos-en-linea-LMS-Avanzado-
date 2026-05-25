"use client";

import { StatCard } from "../../components/ui/StatCard";

const WEEKLY_HOURS = [3.5, 5.0, 2.0, 6.5, 4.0, 7.5, 5.5, 3.0, 8.0, 6.0, 4.5, 9.0];
const WEEK_LABELS = ["Jan W3","Jan W4","Feb W1","Feb W2","Feb W3","Feb W4","Mar W1","Mar W2","Mar W3","Mar W4","Apr W1","Apr W2"];
const COURSE_SCORES = [
  { name: "Intro to ML", score: 92 },
  { name: "UI Systems", score: 88 },
  { name: "Product Strategy", score: 78 },
  { name: "TypeScript Adv.", score: 95 },
  { name: "Data Viz", score: 84 },
];
const CATEGORY_BREAKDOWN = [
  { label: "Programming", pct: 45, color: "var(--accent-sunset)" },
  { label: "Data Science", pct: 28, color: "#3d9e6e" },
  { label: "Design",       pct: 18, color: "var(--accent-twilight)" },
  { label: "Business",     pct: 9,  color: "#e05c6a" },
];

const HEATMAP = Array.from({ length: 12 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const rand = Math.random();
    if (rand < 0.3) return 0;
    if (rand < 0.5) return 1;
    if (rand < 0.7) return 2;
    if (rand < 0.85) return 3;
    if (rand < 0.94) return 4;
    return 5;
  })
);
const DAY_LABELS = ["M","T","W","T","F","S","S"];

const maxHours = Math.max(...WEEKLY_HOURS);

export default function AnalyticsPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1200, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 32 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>Insights</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 4, letterSpacing: "-0.6px" }}>Learning Analytics</h1>
        <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>Your progress overview for the last 12 weeks</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Hours" value="65h" icon="⏱" trend={18} trendLabel="vs last period" color="cyan" delay={0} />
        <StatCard label="Avg Weekly" value="5.4h" icon="⌇" trend={7} trendLabel="vs last period" color="emerald" delay={0.08} />
        <StatCard label="Avg Score" value="87%" icon="◈" trend={3} trendLabel="vs last period" color="violet" delay={0.16} />
        <StatCard label="Current Streak" value="21 🔥" icon="★" trend={5} trendLabel="days" color="amber" delay={0.24} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, marginBottom: 24 }}>
        {/* Bar chart — weekly hours */}
        <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 400, color: "var(--ink)", marginBottom: 20 }}>Weekly Learning Hours</h3>
          <div style={{ position: "relative", height: 180, display: "flex", alignItems: "flex-end", gap: 10 }}>
            {/* Y-axis */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginRight: 4 }}>
              {[10,7.5,5,2.5,0].map(v => (
                <span key={v} style={{ fontSize: 10, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>{v}h</span>
              ))}
            </div>
            {/* Grid lines */}
            <div style={{ position: "absolute", left: 28, right: 0, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ height: 1, background: "var(--hairline)", width: "100%" }} />
              ))}
            </div>
            {/* Bars */}
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6, height: "100%", position: "relative" }}>
              {WEEKLY_HOURS.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    background: "var(--ink)", opacity: 0.6,
                    height: `${(h / maxHours) * 100}%`,
                    minHeight: 3,
                    transition: "height 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0.6"}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* X-axis labels */}
          <div style={{ display: "flex", gap: 6, marginTop: 8, paddingLeft: 32 }}>
            {WEEK_LABELS.map((l, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>
                {i % 2 === 0 ? l.slice(-2) : ""}
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 400, color: "var(--ink)", marginBottom: 20 }}>By Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {CATEGORY_BREAKDOWN.map((cat, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "var(--body)", fontWeight: 400 }}>{cat.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 400, fontFamily: "var(--font-mono)", color: cat.color }}>{cat.pct}%</span>
                </div>
                <div style={{ height: 6, background: "var(--canvas-mid)", borderRadius: 9999, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${cat.pct}%`,
                    background: cat.color, borderRadius: 9999,
                    animation: "progressFill 0.8s cubic-bezier(0.16,1,0.3,1) both",
                    animationDelay: `${i * 0.1}s`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Heatmap */}
        <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 400, color: "var(--ink)" }}>Activity Heatmap</h3>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>Less</span>
              {[0,1,2,3,4,5].map(l => (
                <div key={l} className={`heat-cell l${l}`} style={{ width: 11, height: 11 }} />
              ))}
              <span style={{ fontSize: 10, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>More</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            {/* Day labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 6 }}>
              {DAY_LABELS.map((d, i) => (
                <div key={i} style={{ height: 14, fontSize: 9, color: "var(--body-mid)", fontFamily: "var(--font-mono)", lineHeight: "14px" }}>{d}</div>
              ))}
            </div>
            {/* Grid */}
            {HEATMAP.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {week.map((level, di) => (
                  <div key={di} className={`heat-cell${level > 0 ? ` l${level}` : ""}`} title={`${level} sessions`} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart — quiz scores */}
        <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 400, color: "var(--ink)", marginBottom: 20 }}>Quiz Scores</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {COURSE_SCORES.map((cs, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--body)", minWidth: 110, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 400 }}>
                  {cs.name}
                </span>
                <div style={{ flex: 1, height: 8, background: "var(--canvas-mid)", borderRadius: 9999, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${cs.score}%`,
                    background: cs.score >= 90 ? "#3d9e6e" : cs.score >= 75 ? "var(--ink)" : "var(--accent-sunset)",
                    borderRadius: 9999,
                    animation: "progressFill 0.8s cubic-bezier(0.16,1,0.3,1) both",
                    animationDelay: `${i * 0.1}s`,
                  }} />
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 400,
                  fontFamily: "var(--font-mono)", minWidth: 36, textAlign: "right",
                  color: cs.score >= 90 ? "#3d9e6e" : cs.score >= 75 ? "var(--body)" : "var(--accent-sunset)",
                }}>{cs.score}%</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "14px 16px", background: "var(--canvas-soft)", borderRadius: 8, border: "1px solid var(--hairline)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Average score</p>
            <p style={{ fontSize: 24, fontWeight: 400, fontFamily: "var(--font-mono)", color: "var(--ink)", letterSpacing: "-0.6px" }}>
              {Math.round(COURSE_SCORES.reduce((s, c) => s + c.score, 0) / COURSE_SCORES.length)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
