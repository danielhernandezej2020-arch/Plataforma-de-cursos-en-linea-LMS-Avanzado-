"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard } from "../../components/ui/StatCard";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";
import { usePublish } from "../../hooks/useEventBus";

const MY_COURSES = [
  { id: "1", title: "Advanced TypeScript Patterns", instructor: "Sarah Kim", progress: 73, category: "programming", lastAccessed: "2h ago" },
  { id: "2", title: "Machine Learning with Python", instructor: "Carlos Reyes", progress: 41, category: "data-science", lastAccessed: "1d ago" },
  { id: "3", title: "UI Design Systems", instructor: "Mia Tanaka", progress: 88, category: "design", lastAccessed: "3d ago" },
];

const RECOMMENDATIONS = [
  { title: "System Design at Scale", category: "programming", rating: 4.7, students: 7400 },
  { title: "Data Visualization Mastery", category: "data-science", rating: 4.8, students: 4100 },
];

const CALENDAR_EVENTS = [
  { day: "Mon", date: 19, time: "10:00 AM", title: "TypeScript Live Q&A", type: "live" },
  { day: "Wed", date: 21, time: "2:00 PM",  title: "ML Workshop", type: "workshop" },
  { day: "Fri", date: 23, time: "4:00 PM",  title: "Design Review", type: "review" },
];

const EVENT_COLOR: Record<string, string> = {
  live:     "var(--accent-sunset)",
  workshop: "var(--accent-sunset)",
  review:   "var(--accent-dusk)",
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  // Observer: publica eventos de notificación que TopNav escucha
  const publish = usePublish();

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      // Notifica de cursos con progreso > 80% al terminar de cargar
      MY_COURSES.filter(c => c.progress > 80).forEach(c => {
        publish("notification:new", {
          message: `"${c.title}" está al ${c.progress}% — ¡termínalo!`,
          type: "info",
        });
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [publish]);

  return (
    <div style={{ padding: 32, maxWidth: 1200, position: "relative", zIndex: 1 }}>
      {/* Greeting */}
      <div className="anim-fade-up" style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: 28, fontWeight: 400, lineHeight: "32px",
          letterSpacing: "-0.6px", color: "var(--ink)", marginBottom: 6,
        }}>
          Good morning, Alex 👋
        </h1>
        <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>
          You&apos;re on a 21-day streak — keep it going!
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
              <Skeleton width="50%" height={10} />
              <Skeleton height={32} style={{ marginTop: 12 }} />
              <Skeleton width="40%" height={8} style={{ marginTop: 10 }} />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Courses Enrolled" value="3" icon="⬡" trend={0} trendLabel="this month" color="cyan" delay={0} />
            <StatCard label="Hours Learned" value="62h" icon="⏱" trend={12} trendLabel="vs last week" color="emerald" delay={0.08} />
            <StatCard label="Certificates" value="3" icon="✦" trend={1} trendLabel="new" color="violet" delay={0.16} />
            <StatCard label="Current Streak" value="21 🔥" icon="◈" trend={5} trendLabel="days" color="amber" delay={0.24} />
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* My Courses */}
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)" }}>My Courses</h2>
              <Link href="/courses" style={{ fontSize: 12, color: "var(--body-mid)", textDecoration: "none", fontWeight: 400 }}>Browse all →</Link>
            </div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ background: "var(--canvas-soft)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 16, display: "flex", gap: 12 }}>
                    <Skeleton width={44} height={44} radius={8} />
                    <div style={{ flex: 1 }}><Skeleton width="60%" height={10} /><Skeleton height={6} style={{ marginTop: 10 }} /></div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {MY_COURSES.map((course, i) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="anim-fade-up"
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                      borderRadius: 8, padding: 16,
                      textDecoration: "none", display: "flex", gap: 16, alignItems: "center",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)"}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 8,
                      background: "var(--canvas-mid)", border: "1px solid var(--hairline)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {course.category === "programming" ? "⌨️" : course.category === "data-science" ? "📊" : "🎨"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {course.title}
                      </div>
                      <ProgressBar value={course.progress} showPercent color="cyan" />
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <Badge variant={course.progress > 80 ? "emerald" : "neutral"} size="sm">
                        {course.progress}%
                      </Badge>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", marginTop: 6 }}>{course.lastAccessed}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 16 }}>Recommended for you</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {RECOMMENDATIONS.map((rec, i) => (
                <Link key={i} href="/courses" style={{
                  background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                  borderRadius: 8, padding: 16, textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)"}
                >
                  <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)", marginBottom: 8, lineHeight: 1.4 }}>{rec.title}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--accent-sunset)", fontFamily: "var(--font-mono)" }}>★ {rec.rating}</span>
                    <span style={{ fontSize: 11, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>{rec.students.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Upcoming classes */}
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 16 }}>Upcoming</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CALENDAR_EVENTS.map((ev, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, alignItems: "center",
                  background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                  borderRadius: 8, padding: "12px 14px",
                  borderLeft: `3px solid ${EVENT_COLOR[ev.type]}`,
                }}>
                  <div style={{ textAlign: "center", minWidth: 36 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--body-mid)", textTransform: "uppercase" }}>{ev.day}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 400, color: "var(--ink)" }}>{ev.date}</div>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)" }}>{ev.title}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>{ev.time}</p>
                  </div>
                  <Badge variant={ev.type === "live" ? "orange" : ev.type === "workshop" ? "amber" : "violet"} size="sm" style={{ marginLeft: "auto" }}>
                    {ev.type}
                  </Badge>
                </div>
              ))}
            </div>
            <Link href="/live" className="btn btn-outline" style={{ width: "100%", marginTop: 14, fontSize: 13, justifyContent: "center" }}>
              View live schedule →
            </Link>
          </div>

          {/* Quick links */}
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 16 }}>Quick access</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { href: "/quiz", label: "Take Quiz", icon: "◈" },
                { href: "/certificates", label: "Certificates", icon: "✦" },
                { href: "/analytics", label: "Analytics", icon: "⌇" },
                { href: "/profile", label: "Profile", icon: "◐" },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{
                  background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                  borderRadius: 8, padding: "12px 14px",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
                  fontSize: 13, color: "var(--body)", fontWeight: 400,
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)"}
                >
                  <span style={{ fontSize: 16, color: "var(--body-mid)" }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
