"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthColor = ["", "#e05c6a", "var(--accent-sunset)", "var(--accent-sunset)", "#3d9e6e"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <>
      {/* Left: visual panel */}
      <div style={{
        background: "var(--canvas-soft)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 60, position: "relative", overflow: "hidden",
        borderRight: "1px solid var(--hairline)",
      }}>
        <div className="anim-fade-up" style={{ position: "relative", maxWidth: 380 }}>
          <p className="eyebrow" style={{ marginBottom: 20 }}>Join the community</p>
          <h2 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 32, fontWeight: 400, lineHeight: "36px",
            letterSpacing: "-0.6px",
            color: "var(--ink)", marginBottom: 16,
          }}>
            Join 48,000+<br />engineers already<br />learning on NEXUS.
          </h2>
          <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 36, lineHeight: 1.6, fontWeight: 400 }}>
            Start free. Upgrade when you&apos;re ready. Cancel anytime.
          </p>

          {/* Proof points */}
          {[
            { stat: "320+", label: "Expert-led courses" },
            { stat: "94%", label: "Course completion rate" },
            { stat: "48K+", label: "Active learners worldwide" },
          ].map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16, marginBottom: 12,
              background: "var(--canvas-card)",
              border: "1px solid var(--hairline)",
              borderRadius: 8, padding: "12px 16px",
            }}>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: 24, fontWeight: 400,
                letterSpacing: "-0.6px",
                color: "var(--ink)",
              }}>{p.stat}</span>
              <span className="eyebrow-sm">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 60px", background: "var(--canvas)",
      }}>
        <div className="anim-fade-up" style={{ width: "100%", maxWidth: 420 }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            textDecoration: "none", marginBottom: 40,
          }}>
            <div style={{
              width: 22, height: 22,
              background: "transparent",
              border: "1px solid var(--hairline)",
              borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 11, fontWeight: 400, color: "var(--ink)",
            }}>N</div>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12, fontWeight: 400,
              letterSpacing: "1.4px", textTransform: "uppercase",
              color: "var(--ink)",
            }}>NEXUS</span>
          </Link>

          <h1 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 32, fontWeight: 400, lineHeight: "36px",
            letterSpacing: "-0.6px", color: "var(--ink)", marginBottom: 8,
          }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 32, fontWeight: 400 }}>
            Free forever. No credit card required.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[
              { icon: "⬡", label: "GitHub" },
              { icon: "G", label: "Google" },
            ].map(btn => (
              <button key={btn.label} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "var(--canvas-soft)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                padding: "10px 16px",
                fontSize: 14, fontWeight: 400,
                color: "var(--ink)",
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)"}
              >
                <span style={{ color: "var(--body-mid)" }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>

          <div className="divider" style={{ marginBottom: 24 }}>or sign up with email</div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label className="eyebrow-sm" style={{ display: "block", marginBottom: 8 }}>Full name</label>
              <input className="input" placeholder="Alex Chen" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="eyebrow-sm" style={{ display: "block", marginBottom: 8 }}>Email address</label>
              <input className="input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 6 }}>
              <label className="eyebrow-sm" style={{ display: "block", marginBottom: 8 }}>Password</label>
              <input className="input" type="password" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {/* Password strength */}
            {password && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 9999,
                      background: i <= strength ? strengthColor : "var(--canvas-mid)",
                      transition: "background 0.2s",
                    }} />
                  ))}
                </div>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11, letterSpacing: "0.8px", color: strengthColor, fontWeight: 400,
                }}>{strengthLabel} password</p>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 24 }}>
              <input type="checkbox" id="tos" required style={{ accentColor: "var(--ink)", marginTop: 2 }} />
              <label htmlFor="tos" style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.5, fontWeight: 400 }}>
                I agree to NEXUS&apos;s{" "}
                <a href="#" style={{ color: "var(--body-mid)", textDecoration: "underline" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={{ color: "var(--body-mid)", textDecoration: "underline" }}>Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", fontSize: 14, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: "2px solid transparent", borderTopColor: "#0a0a0a", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
                  Creating account…
                </span>
              ) : "Create free account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--body-mid)", marginTop: 24, fontWeight: 400 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--ink)", textDecoration: "underline", fontWeight: 400 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
