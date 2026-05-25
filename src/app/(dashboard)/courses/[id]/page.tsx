"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "../../../components/ui/Badge";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { Avatar } from "../../../components/ui/Avatar";

const MODULES = [
  { id: 1, title: "Introduction & Setup", duration: "42 min", done: true },
  { id: 2, title: "TypeScript Generics Deep Dive", duration: "1h 10m", done: true },
  { id: 3, title: "Conditional Types & Infer", duration: "58 min", done: true },
  { id: 4, title: "Template Literal Types", duration: "45 min", done: false, active: true },
  { id: 5, title: "Mapped Types & Utility Types", duration: "1h 05m", done: false },
  { id: 6, title: "Module Augmentation", duration: "38 min", done: false, locked: true },
  { id: 7, title: "Decorators & Metadata", duration: "52 min", done: false, locked: true },
  { id: 8, title: "Final Project", duration: "2h 00m", done: false, locked: true },
];

const COMMENTS = [
  { name: "David Chen", avatar: "DC", time: "2 hours ago", text: "The section on conditional types finally clicked for me — the `infer` keyword was always confusing but this explanation is crystal clear." },
  { name: "Priya Sharma", avatar: "PS", time: "1 day ago", text: "Best TypeScript course I've taken. Sarah's teaching style is methodical and practical at the same time." },
  { name: "Lucas Ferreira", avatar: "LF", time: "3 days ago", text: "Quick question on Module 3: is the distributive conditional type behavior browser-specific or just a TS compiler thing?" },
];

const RESOURCES = [
  { name: "Course Slides — Week 1", type: "PDF", size: "2.4 MB" },
  { name: "Starter Project Templates", type: "ZIP", size: "840 KB" },
  { name: "Lecture Recap — Generics", type: "PDF", size: "1.1 MB" },
  { name: "Exercise Solutions", type: "ZIP", size: "390 KB" },
];

const TYPE_COLOR: Record<string, string> = {
  PDF: "#e05c6a",
  ZIP: "var(--accent-sunset)",
  MP4: "var(--accent-dusk)",
};

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"modules" | "resources" | "comments">("modules");
  const [openModule, setOpenModule] = useState<number | null>(4);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Hero banner */}
      <div style={{
        background: "var(--canvas-soft)",
        borderBottom: "1px solid var(--hairline)", padding: "40px 32px 0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
            <Link href="/courses" style={{ fontSize: 12, color: "var(--body-mid)", textDecoration: "none", fontWeight: 400 }}>Courses</Link>
            <span style={{ color: "var(--hairline)" }}>/</span>
            <Badge variant="cyan" size="sm">Programming</Badge>
          </div>
          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 28, fontWeight: 400, lineHeight: "32px",
            letterSpacing: "-0.6px", color: "var(--ink)", marginBottom: 10, maxWidth: 600,
          }}>
            Advanced TypeScript Patterns
          </h1>
          <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 16, maxWidth: 560, fontWeight: 400 }}>
            Master generics, conditional types, template literals, and advanced type-level programming to write TypeScript that scales.
          </p>
          <div style={{ display: "flex", gap: 20, alignItems: "center", paddingBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name="Sarah Kim" size={28} />
              <span style={{ fontSize: 13, color: "var(--body)", fontWeight: 400 }}>Sarah Kim</span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-sunset)" }}>★ 4.9</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--body-mid)" }}>3,200 students</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--body-mid)" }}>⏱ 28h</span>
            <Badge variant="amber">Premium</Badge>
          </div>
          <ProgressBar value={73} showPercent color="cyan" />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.8px", color: "var(--body-mid)", marginTop: 8, paddingBottom: 24 }}>
            Module 4 of 8 · Last accessed 2 hours ago
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "32px", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* Left: Video + tabs */}
        <div>
          {/* Video placeholder */}
          <div style={{
            aspectRatio: "16/9", background: "var(--canvas-card)",
            border: "1px solid var(--hairline)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 24, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)", textAlign: "center", zIndex: 1,
            }}>
              <button style={{
                width: 64, height: 64, borderRadius: 9999,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, color: "var(--ink)", marginBottom: 12, marginLeft: "auto", marginRight: "auto",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"}
              >▶</button>
              <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>Module 4: Template Literal Types</p>
            </div>
            <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 1, display: "flex", gap: 8 }}>
              <Badge variant="neutral" size="sm">45 min</Badge>
              <Badge variant="cyan" size="sm" dot>In progress</Badge>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--hairline)", marginBottom: 20 }}>
            {(["modules", "resources", "comments"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 400,
                  color: activeTab === tab ? "var(--ink)" : "var(--body-mid)",
                  padding: "10px 20px",
                  borderBottom: activeTab === tab ? "2px solid var(--ink)" : "2px solid transparent",
                  transition: "color 0.15s",
                  textTransform: "capitalize",
                }}
              >{tab} {tab === "comments" && `(${COMMENTS.length})`}</button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "resources" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RESOURCES.map((r, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                  borderRadius: 8, padding: "12px 16px",
                }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11, fontWeight: 400, padding: "3px 7px",
                    background: `${TYPE_COLOR[r.type]}18`, color: TYPE_COLOR[r.type],
                    border: `1px solid ${TYPE_COLOR[r.type]}30`, borderRadius: 4,
                  }}>{r.type}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)" }}>{r.name}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>{r.size}</p>
                  </div>
                  <button className="btn btn-outline" style={{ fontSize: 12, padding: "6px 12px" }}>↓ Download</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <Avatar name="Alex Chen" size={36} />
                <div style={{ flex: 1 }}>
                  <textarea
                    className="input"
                    placeholder="Share a question or insight..."
                    style={{ resize: "none", height: 72, paddingTop: 12, borderRadius: 8 }}
                  />
                  <button className="btn btn-outline" style={{ marginTop: 8, fontSize: 13, padding: "8px 18px" }}>
                    Post comment
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {COMMENTS.map((c, i) => (
                  <div key={i} style={{
                    background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                    borderRadius: 8, padding: 16,
                  }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                      <Avatar name={c.name} size={32} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)" }}>{c.name}</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>{c.time}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.65, fontWeight: 400 }}>{c.text}</p>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--body-mid)", marginTop: 8, fontWeight: 400 }}>
                      ↩ Reply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Module list */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)" }}>Course Modules</h3>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>3 / 8 done</span>
            </div>
            <div style={{ maxHeight: 480, overflowY: "auto" }}>
              {MODULES.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => !mod.locked && setOpenModule(openModule === mod.id ? null : mod.id)}
                  style={{
                    width: "100%", background: mod.active ? "rgba(255,255,255,0.05)" : "none",
                    border: "none", borderBottom: "1px solid var(--hairline)",
                    padding: "14px 20px", cursor: mod.locked ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                    opacity: mod.locked ? 0.4 : 1,
                    transition: "background 0.15s",
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11, fontWeight: 400,
                    background: mod.done ? "var(--ink)" : mod.active ? "rgba(255,255,255,0.1)" : "transparent",
                    border: mod.done ? "none" : "1px solid var(--hairline)",
                    color: mod.done ? "var(--canvas)" : "var(--body-mid)",
                  }}>
                    {mod.locked ? "·" : mod.done ? "✓" : mod.id}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 400,
                      color: mod.active ? "var(--ink)" : "var(--body)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{mod.title}</p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>{mod.duration}</p>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ padding: 16 }}>
              <Link href="/quiz" className="btn btn-outline" style={{ width: "100%", fontSize: 14, justifyContent: "center" }}>
                Take Module Quiz →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
