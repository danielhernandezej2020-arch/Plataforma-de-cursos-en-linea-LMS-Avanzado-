"use client";

import { useState } from "react";
import { Badge } from "../../components/ui/Badge";

const CERTIFICATES = [
  {
    id: "cert-001", course: "Machine Learning with Python", type: "basic",
    date: "Feb 12, 2025", category: "data-science",
    code: "NX-2025-ML-7841",
  },
  {
    id: "cert-002", course: "UI Design Systems", type: "verified",
    date: "Mar 28, 2025", category: "design",
    code: "NX-2025-DS-3921",
  },
  {
    id: "cert-003", course: "Product Strategy & Growth", type: "basic",
    date: "Apr 5, 2025", category: "business",
    code: "NX-2025-BZ-5517",
  },
];

export default function CertificatesPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: 32, maxWidth: 1100, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 36 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>Achievements</p>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 4, letterSpacing: "-0.6px" }}>
          My Certificates
        </h1>
        <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>
          {CERTIFICATES.length} certificate{CERTIFICATES.length !== 1 ? "s" : ""} earned · {CERTIFICATES.filter(c => c.type === "verified").length} verified
        </p>
      </div>

      {CERTIFICATES.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          background: "var(--canvas-card)", border: "1px solid var(--hairline)",
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
          <h3 style={{ fontSize: 22, fontWeight: 400, color: "var(--ink)", marginBottom: 10 }}>No certificates yet</h3>
          <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 24, fontWeight: 400 }}>Complete a course and pass the final quiz to earn your first certificate.</p>
          <a href="/courses" className="btn btn-primary" style={{ fontSize: 14, padding: "11px 24px" }}>Browse Courses →</a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {CERTIFICATES.map((cert, i) => (
            <div
              key={cert.id}
              className="anim-fade-up"
              style={{
                animationDelay: `${i * 0.1}s`,
                background: "var(--canvas-card)", border: "1px solid var(--hairline)",
                borderRadius: 8, overflow: "hidden",
                transition: "border-color 0.25s ease",
                borderColor: hoveredId === cert.id ? "rgba(255,255,255,0.15)" : "var(--hairline)",
              }}
              onMouseEnter={() => setHoveredId(cert.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Certificate preview */}
              <div style={{
                background: "var(--canvas-soft)", padding: "32px 28px",
                position: "relative", overflow: "hidden", borderBottom: "1px solid var(--hairline)",
              }}>
                {/* Corner ornaments */}
                {[
                  { top: 0, left: 0, borderTop: "1px solid rgba(255,255,255,0.2)", borderLeft: "1px solid rgba(255,255,255,0.2)" },
                  { top: 0, right: 0, borderTop: "1px solid rgba(255,255,255,0.2)", borderRight: "1px solid rgba(255,255,255,0.2)" },
                  { bottom: 0, left: 0, borderBottom: "1px solid rgba(255,255,255,0.2)", borderLeft: "1px solid rgba(255,255,255,0.2)" },
                  { bottom: 0, right: 0, borderBottom: "1px solid rgba(255,255,255,0.2)", borderRight: "1px solid rgba(255,255,255,0.2)" },
                ].map((style, j) => (
                  <div key={j} style={{
                    position: "absolute", width: 24, height: 24, ...style,
                  }} />
                ))}

                <div className="anim-stamp" style={{ animationDelay: `${i * 0.1 + 0.3}s`, textAlign: "center" }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 9999, padding: "4px 12px", marginBottom: 16,
                    fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--body-mid)", letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}>
                    {cert.type === "verified" ? "✦ Verified Certificate" : "◆ Certificate of Completion"}
                  </div>

                  <p style={{ fontSize: 11, color: "var(--body-mid)", marginBottom: 6, letterSpacing: "1.2px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                    This certifies that
                  </p>
                  <p style={{
                    fontSize: 20, fontWeight: 400,
                    color: "var(--ink)", marginBottom: 8,
                  }}>
                    Alex Chen
                  </p>
                  <p style={{ fontSize: 11, color: "var(--body-mid)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>has successfully completed</p>
                  <p style={{ fontSize: 14, fontWeight: 400, color: "var(--body)" }}>
                    &ldquo;{cert.course}&rdquo;
                  </p>
                </div>
              </div>

              {/* Card footer */}
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 2 }}>Issued</p>
                    <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)" }}>{cert.date}</p>
                  </div>
                  <Badge variant={cert.type === "verified" ? "violet" : "emerald"}>
                    {cert.type}
                  </Badge>
                </div>

                <div style={{
                  background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                  borderRadius: 8, padding: "8px 12px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 14,
                }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--body-mid)" }}>{cert.code}</span>
                  <button
                    onClick={() => copyCode(cert.code, cert.id)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 11, fontFamily: "var(--font-mono)",
                      color: copied === cert.id ? "#3d9e6e" : "var(--body-mid)",
                      transition: "color 0.2s",
                    }}
                  >
                    {copied === cert.id ? "✓ Copied" : "Copy ↗"}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button className="btn btn-primary" style={{ fontSize: 13, padding: "9px 14px" }}>
                    ↓ Download PDF
                  </button>
                  <button className="btn btn-outline" style={{ fontSize: 13, padding: "9px 14px" }}>
                    ↗ Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
