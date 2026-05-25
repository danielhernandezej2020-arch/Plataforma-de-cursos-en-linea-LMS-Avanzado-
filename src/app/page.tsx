"use client";

import Link from "next/link";

const FEATURED_COURSES = [
  {
    id: "1", title: "Advanced TypeScript Patterns", category: "Programming",
    instructor: "Sarah Kim", rating: 4.9, students: 3200, duration: "28h", price: 89, type: "premium",
  },
  {
    id: "2", title: "Machine Learning with Python", category: "Data Science",
    instructor: "Carlos Reyes", rating: 4.8, students: 5100, duration: "40h", price: 0, type: "free",
  },
  {
    id: "3", title: "UI Design Systems", category: "Design",
    instructor: "Mia Tanaka", rating: 4.9, students: 2800, duration: "22h", price: 69, type: "premium",
  },
  {
    id: "4", title: "System Design at Scale", category: "Programming",
    instructor: "Raj Patel", rating: 4.7, students: 7400, duration: "36h", price: 99, type: "premium",
  },
  {
    id: "5", title: "Data Visualization Mastery", category: "Data Science",
    instructor: "Emma Liu", rating: 4.8, students: 4100, duration: "18h", price: 0, type: "free",
  },
  {
    id: "6", title: "Product Strategy & Growth", category: "Business",
    instructor: "James White", rating: 4.6, students: 2200, duration: "14h", price: 59, type: "premium",
  },
];

const TESTIMONIALS = [
  { name: "David Chen", role: "Senior Engineer @ Meta", avatar: "DC", quote: "NEXUS completely changed how I approach system architecture. The courses are dense, practical, and immediately applicable.", rating: 5 },
  { name: "Priya Sharma", role: "ML Engineer @ DeepMind", avatar: "PS", quote: "The ML track is genuinely world-class. I've tried Coursera, Udemy — nothing compares to the depth here.", rating: 5 },
  { name: "Lucas Ferreira", role: "Design Lead @ Figma", avatar: "LF", quote: "Mia's UI Design Systems course alone is worth a year of self-study. Shipped a complete design system in 3 weeks after finishing it.", rating: 5 },
  { name: "Anna Kowalski", role: "CTO @ Series B startup", avatar: "AK", quote: "Every engineer on my team is on NEXUS. The ROI is insane — it shows in our code quality and shipping velocity.", rating: 5 },
];

const STATS = [
  { label: "Learners worldwide", value: "48K+" },
  { label: "Expert courses", value: "320" },
  { label: "Completion rate", value: "94%" },
  { label: "Avg. rating", value: "4.9★" },
];

const BENEFITS = [
  { title: "Hands-on projects", desc: "Every course ships with real projects you can add to your portfolio." },
  { title: "Progress tracking", desc: "Visual analytics show exactly where you are and what to do next." },
  { title: "Verified certificates", desc: "Blockchain-verified credentials that link directly to your work." },
  { title: "Live sessions", desc: "Weekly live classes with instructors and Q&A with your cohort." },
];

const NAV_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Live", href: "/live" },
  { label: "Admin", href: "/admin" },
];

const FOOTER_COLS = [
  { heading: "Learn",   links: ["All Courses", "Live Classes", "Certificates", "Progress"] },
  { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
  { heading: "Support", links: ["Help Center", "Community", "Status", "Contact"] },
];

export default function LandingPage() {
  return (
    <div style={{ background: "var(--canvas)", color: "var(--ink)" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "var(--canvas)",
        borderBottom: "1px solid var(--hairline)",
        display: "flex", alignItems: "center",
        padding: "0 24px", height: 52,
        gap: 0,
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 8,
          textDecoration: "none", flexShrink: 0,
        }}>
          <div style={{
            width: 22, height: 22,
            background: "transparent",
            border: "1px solid var(--hairline)",
            borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 400, color: "var(--ink)",
            fontFamily: "var(--font-mono)",
          }}>N</div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12,
            letterSpacing: "1.4px", textTransform: "uppercase",
            color: "var(--ink)", fontWeight: 400,
          }}>NEXUS</span>
        </Link>

        {/* Nav links */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 0 }}>
          {NAV_LINKS.map(item => (
            <Link key={item.href} href={item.href} style={{
              color: "var(--body-mid)",
              textDecoration: "none",
              fontSize: 14, fontWeight: 400,
              padding: "0 20px", lineHeight: "52px",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ink)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--body-mid)"}
            >{item.label}</Link>
          ))}
        </div>

        {/* Right cluster */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <Link href="/login" style={{
            color: "var(--body-mid)", textDecoration: "none",
            fontSize: 14, fontWeight: 400,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ink)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--body-mid)"}
          >Sign in</Link>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: 14, padding: "6px 16px" }}>
            Start free
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--canvas)",
        padding: "calc(52px + 80px) 40px 80px",
        textAlign: "center",
      }}>
        {/* Eyebrow */}
        <p className="eyebrow anim-fade-up" style={{ marginBottom: 24 }}>
          Spring 2025 cohort — now open
        </p>

        <h1 className="anim-fade-up delay-1" style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(48px, 7vw, 96px)",
          fontWeight: 400,
          lineHeight: 1.0,
          letterSpacing: "clamp(-1.2px, -0.04em, -2.4px)",
          color: "var(--ink)",
          marginBottom: 24,
        }}>
          Learn. Build. Ship.
        </h1>

        <p className="anim-fade-up delay-2" style={{
          fontSize: 18, fontWeight: 400, lineHeight: 1.55,
          color: "var(--body)",
          maxWidth: 520, margin: "0 auto 40px",
        }}>
          World-class courses in software architecture, machine learning,
          and design systems — built for engineers who ship.
        </p>

        <div className="anim-fade-up delay-3" style={{
          display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
        }}>
          <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: 14, padding: "10px 24px" }}>
            Start Learning
          </Link>
          <Link href="/courses" className="btn btn-outline" style={{ fontSize: 14, padding: "10px 24px" }}>
            Browse courses
          </Link>
        </div>

        {/* Social proof */}
        <div className="anim-fade-up delay-4" style={{
          marginTop: 48, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 12,
          fontSize: 14, color: "var(--body-mid)", fontWeight: 400,
        }}>
          <div style={{ display: "flex" }}>
            {["DC", "PS", "LF", "AK", "RJ"].map((initials, idx) => (
              <div key={initials} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--canvas-soft)",
                border: "2px solid var(--canvas)",
                marginLeft: idx > 0 ? -8 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 400,
                fontFamily: "var(--font-mono)",
                color: "var(--body)",
                zIndex: 5 - idx,
                position: "relative",
              }}>{initials}</div>
            ))}
          </div>
          <span style={{ color: "var(--body)" }}>
            <span style={{ color: "var(--ink)", fontWeight: 400 }}>48,000+</span>{" "}
            engineers already learning
          </span>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--canvas-soft)",
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
        padding: "32px 40px",
      }}>
        <div style={{
          maxWidth: 960, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{
              textAlign: "center",
              borderRight: i < 3 ? "1px solid var(--hairline)" : "none",
              padding: "0 20px",
            }}>
              <div className="anim-fade-up" style={{
                animationDelay: `${i * 0.06}s`,
                fontFamily: "var(--font-sans)",
                fontSize: 32, fontWeight: 400, lineHeight: "36px",
                letterSpacing: "-0.6px", color: "var(--ink)",
              }}>{stat.value}</div>
              <div className="eyebrow-sm" style={{ marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Courses ─────────────────────────────────────────────── */}
      <section style={{
        background: "var(--canvas)",
        borderTop: "1px solid var(--hairline)",
        padding: "80px 40px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", marginBottom: 48,
          }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Featured</p>
              <h2 style={{
                fontFamily: "var(--font-sans)",
                fontSize: 48, fontWeight: 400, lineHeight: "48px",
                letterSpacing: "-1.2px", color: "var(--ink)",
              }}>Courses built for<br />serious engineers</h2>
            </div>
            <Link href="/courses" style={{
              color: "var(--body-mid)", fontSize: 14,
              textDecoration: "none", fontWeight: 400,
              transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ink)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--body-mid)"}
            >View all 320 →</Link>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          }}>
            {FEATURED_COURSES.map((course, i) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="anim-fade-up"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--canvas-card)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  padding: 24,
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)";
                }}
              >
                {/* Category chip */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    display: "inline-block",
                    fontSize: 11, fontWeight: 400,
                    letterSpacing: "0.8px",
                    color: "var(--body-mid)",
                    background: "var(--canvas-soft)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 9999,
                    padding: "3px 10px",
                    textTransform: "uppercase",
                  }}>{course.category}</span>
                </div>

                <h3 style={{
                  fontSize: 16, fontWeight: 400, lineHeight: 1.4,
                  color: "var(--ink)", marginBottom: 6,
                }}>{course.title}</h3>

                <p style={{
                  fontSize: 14, color: "var(--body-mid)", fontWeight: 400,
                  marginBottom: 20,
                }}>by {course.instructor}</p>

                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginTop: "auto",
                }}>
                  <span style={{ fontSize: 12, color: "var(--accent-sunset)" }}>{"★".repeat(Math.round(course.rating))}</span>
                  <span style={{ fontSize: 12, color: "var(--body-mid)", fontWeight: 400 }}>
                    {course.rating} · {course.students.toLocaleString()}
                  </span>
                  <span style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-mono)",
                    fontSize: 14, fontWeight: 400,
                    color: course.type === "free" ? "var(--accent-sunset)" : "var(--ink)",
                  }}>
                    {course.type === "free" ? "FREE" : `$${course.price}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--canvas)",
        borderTop: "1px solid var(--hairline)",
        padding: "80px 40px",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 80, alignItems: "center",
        }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Why NEXUS</p>
            <h2 style={{
              fontFamily: "var(--font-sans)",
              fontSize: 48, fontWeight: 400, lineHeight: "48px",
              letterSpacing: "-1.2px",
              color: "var(--ink)", marginBottom: 48,
            }}>
              Built different.
              <br />By engineers,
              <br />for engineers.
            </h2>
            {BENEFITS.map((b, i) => (
              <div key={i} className="anim-fade-up" style={{
                animationDelay: `${i * 0.08}s`,
                display: "flex", gap: 16, marginBottom: 28,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--accent-sunset)",
                  flexShrink: 0, marginTop: 8,
                }} />
                <div>
                  <h4 style={{
                    fontSize: 16, fontWeight: 400, lineHeight: 1.4,
                    color: "var(--ink)", marginBottom: 4,
                  }}>{b.title}</h4>
                  <p style={{
                    fontSize: 14, lineHeight: 1.57,
                    color: "var(--body)", fontWeight: 400,
                  }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stat cards */}
          <div style={{ position: "relative", height: 420 }}>
            {[
              { top: 0,   left: 0,   label: "Your Progress", value: "73%",     sub: "TypeScript Patterns" },
              { top: 90,  left: 100, label: "Streak",        value: "21 days",  sub: "Keep it up!" },
              { top: 210, left: 10,  label: "Next Live",     value: "in 2h",    sub: "System Design" },
              { top: 290, left: 140, label: "Certificates",  value: "3 earned", sub: "2 verified" },
            ].map((card, i) => (
              <div key={i} style={{
                position: "absolute", top: card.top, left: card.left,
                background: "var(--canvas-card)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                padding: "16px 20px",
                minWidth: 190,
              }}>
                <p className="eyebrow-sm" style={{ marginBottom: 6 }}>{card.label}</p>
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 24, fontWeight: 400, lineHeight: "28px",
                  letterSpacing: "-0.6px", color: "var(--ink)", marginBottom: 4,
                }}>{card.value}</p>
                <p style={{
                  fontSize: 12, color: "var(--body-mid)", fontWeight: 400,
                }}>{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--canvas)",
        borderTop: "1px solid var(--hairline)",
        padding: "80px 40px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Testimonials</p>
            <h2 style={{
              fontFamily: "var(--font-sans)",
              fontSize: 48, fontWeight: 400, lineHeight: "48px",
              letterSpacing: "-1.2px", color: "var(--ink)",
            }}>Built trust at the best companies</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="anim-fade-up" style={{
                animationDelay: `${i * 0.06}s`,
                background: "var(--canvas-card)",
                border: "1px solid var(--hairline)",
                borderRadius: 8, padding: 24,
              }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} style={{ color: "var(--accent-sunset)", fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{
                  fontSize: 15, lineHeight: 1.6,
                  color: "var(--body)", marginBottom: 20, fontWeight: 400,
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "var(--canvas-soft)",
                    border: "1px solid var(--hairline)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11, fontWeight: 400, color: "var(--body)",
                  }}>{t.avatar}</div>
                  <div>
                    <p style={{
                      fontSize: 14, fontWeight: 400,
                      color: "var(--ink)",
                    }}>{t.name}</p>
                    <p style={{
                      fontSize: 12, color: "var(--body-mid)", fontWeight: 400,
                    }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--canvas-soft)",
        borderTop: "1px solid var(--hairline)",
        padding: "80px 40px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 20 }}>Get started</p>
          <h2 style={{
            fontFamily: "var(--font-sans)",
            fontSize: 48, fontWeight: 400, lineHeight: "48px",
            letterSpacing: "-1.2px",
            color: "var(--ink)", marginBottom: 20,
          }}>
            Start shipping<br />better code today.
          </h2>
          <p style={{
            fontSize: 16, fontWeight: 400, lineHeight: 1.55,
            color: "var(--body)", marginBottom: 36,
          }}>
            Join 48,000+ engineers. Cancel anytime.
            <br />Free courses available immediately.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/dashboard" className="btn btn-primary" style={{ fontSize: 14, padding: "10px 24px" }}>
              Get started free
            </Link>
            <Link href="/courses" className="btn btn-outline" style={{ fontSize: 14, padding: "10px 24px" }}>
              Browse courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        background: "var(--canvas)",
        padding: "64px 40px 32px",
        borderTop: "1px solid var(--hairline)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40, marginBottom: 40,
          }}>
            {/* Brand column */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
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
              </div>
              <p style={{
                fontSize: 14, lineHeight: 1.6, fontWeight: 400,
                color: "var(--body)",
                maxWidth: 240,
              }}>
                Mastery-level education for engineers who want to build systems that scale.
              </p>
            </div>

            {/* Link columns */}
            {FOOTER_COLS.map(col => (
              <div key={col.heading}>
                <p className="eyebrow-sm" style={{ marginBottom: 16 }}>{col.heading}</p>
                {col.links.map(link => (
                  <a key={link} href="#" style={{
                    display: "block",
                    fontSize: 14, fontWeight: 400, lineHeight: "2.2",
                    color: "var(--body-mid)", textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ink)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--body-mid)"}
                  >{link}</a>
                ))}
              </div>
            ))}
          </div>

          {/* Legal row */}
          <div style={{
            borderTop: "1px solid var(--hairline)",
            paddingTop: 20,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12, letterSpacing: "0.5px", color: "var(--body-mid)", fontWeight: 400,
            }}>Copyright © 2025 NEXUS Learning. All rights reserved.</p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Use", "Legal"].map(label => (
                <a key={label} href="#" style={{
                  fontSize: 12, fontWeight: 400,
                  color: "var(--body-mid)", textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--ink)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--body-mid)"}
                >{label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
