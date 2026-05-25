"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <>
      {/* Left: form */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 60px",
        background: "var(--canvas)",
        borderRight: "1px solid var(--hairline)",
      }}>
        <div className="anim-fade-up" style={{ width: "100%", maxWidth: 420 }}>
          {/* Logo */}
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            textDecoration: "none", marginBottom: 48,
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
          }}>Welcome back</h1>
          <p style={{
            fontSize: 14, lineHeight: 1.57, fontWeight: 400,
            color: "var(--body)", marginBottom: 32,
          }}>
            Sign in to continue your learning journey.
          </p>

          {/* Social buttons */}
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
                <span style={{ fontWeight: 400, color: "var(--body-mid)" }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>

          <div className="divider" style={{ marginBottom: 24 }}>or continue with email</div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="eyebrow-sm" style={{ display: "block", marginBottom: 8 }}>
                Email address
              </label>
              <input
                className="input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                <label className="eyebrow-sm">Password</label>
                <a href="#" style={{
                  fontSize: 12, color: "var(--body-mid)",
                  textDecoration: "none", fontWeight: 400,
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ink)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--body-mid)"}
                >Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--body-mid)", fontSize: 14,
                  }}
                >{showPass ? "○" : "●"}</button>
              </div>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
            }}>
              <input type="checkbox" id="remember" style={{ accentColor: "var(--ink)" }} />
              <label htmlFor="remember" style={{
                fontSize: 14, fontWeight: 400, color: "var(--body)",
              }}>Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", fontSize: 14, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 14, height: 14,
                    border: "2px solid transparent", borderTopColor: "#0a0a0a",
                    borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block",
                  }} />
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
          </form>

          <p style={{
            textAlign: "center", fontSize: 14,
            color: "var(--body-mid)", marginTop: 24, fontWeight: 400,
          }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{
              color: "var(--ink)", textDecoration: "underline", fontWeight: 400,
            }}>Sign up free</Link>
          </p>
        </div>
      </div>

      {/* Right: visual panel */}
      <div style={{
        background: "var(--canvas-soft)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 60, position: "relative", overflow: "hidden",
      }}>
        <div className="anim-fade-up" style={{ position: "relative", maxWidth: 380 }}>
          <p className="eyebrow" style={{ marginBottom: 20 }}>Continue learning</p>
          <h2 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 32, fontWeight: 400, lineHeight: "36px",
            letterSpacing: "-0.6px",
            color: "var(--ink)", marginBottom: 16,
          }}>
            Continue where<br />you left off.
          </h2>
          <p style={{
            fontSize: 15, fontWeight: 400, lineHeight: 1.6,
            color: "var(--body)", marginBottom: 40,
          }}>
            Your progress, certificates, and courses are waiting.
          </p>

          {[
            { text: "Track your learning progress in real-time" },
            { text: "Download blockchain-verified certificates" },
            { text: "Join live sessions with expert instructors" },
          ].map((f, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start",
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "var(--accent-sunset)",
                flexShrink: 0, marginTop: 9,
              }} />
              <p style={{
                fontSize: 14, lineHeight: 1.57,
                color: "var(--body)", fontWeight: 400,
              }}>{f.text}</p>
            </div>
          ))}

          {/* Course preview card */}
          <div style={{
            marginTop: 40,
            background: "var(--canvas-card)",
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            padding: 20,
          }}>
            <p className="eyebrow-sm" style={{ marginBottom: 8 }}>Last visited</p>
            <p style={{
              fontSize: 15, fontWeight: 400,
              color: "var(--ink)", marginBottom: 12,
            }}>Advanced TypeScript Patterns</p>
            <div className="progress-bar-track" style={{ marginBottom: 8 }}>
              <div className="progress-bar-fill" style={{ width: "73%" }} />
            </div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11, letterSpacing: "0.8px", color: "var(--body-mid)", fontWeight: 400,
            }}>73% complete · Module 4 of 8</p>
          </div>
        </div>
      </div>
    </>
  );
}
