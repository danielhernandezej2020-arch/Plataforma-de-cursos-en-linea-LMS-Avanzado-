"use client";

import { useState } from "react";
import Link from "next/link";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";

const USERS = [
  { name: "Alex Chen",      email: "alex.chen@email.com",   role: "student",    courses: 3, joined: "Jan 12, 2025", status: "active" },
  { name: "Priya Sharma",   email: "priya@deepmind.com",    role: "student",    courses: 5, joined: "Jan 15, 2025", status: "active" },
  { name: "Sarah Kim",      email: "sarah@nexus.io",        role: "instructor", courses: 2, joined: "Dec 1, 2024",  status: "active" },
  { name: "Carlos Reyes",   email: "carlos@nexus.io",       role: "instructor", courses: 3, joined: "Nov 14, 2024", status: "active" },
  { name: "Lucas Ferreira", email: "lucas@email.com",       role: "student",    courses: 2, joined: "Feb 3, 2025",  status: "inactive" },
  { name: "Emma Liu",       email: "emma@nexus.io",         role: "instructor", courses: 1, joined: "Dec 8, 2024",  status: "active" },
  { name: "David Wang",     email: "david.wang@email.com",  role: "student",    courses: 4, joined: "Mar 1, 2025",  status: "active" },
  { name: "Anna Kowalski",  email: "anna@startup.com",      role: "admin",      courses: 0, joined: "Oct 20, 2024", status: "active" },
];

const COURSES_ADMIN = [
  { title: "Advanced TypeScript Patterns", instructor: "Sarah Kim",    students: 3200, revenue: 28480, status: "published", category: "programming" },
  { title: "Machine Learning with Python", instructor: "Carlos Reyes", students: 5100, revenue: 0,    status: "published", category: "data-science" },
  { title: "UI Design Systems",            instructor: "Mia Tanaka",   students: 2800, revenue: 19320, status: "published", category: "design" },
  { title: "System Design at Scale",       instructor: "Raj Patel",    students: 7400, revenue: 73260, status: "published", category: "programming" },
  { title: "Go Backend Engineering",       instructor: "Chen Wei",     students: 4500, revenue: 40050, status: "draft",     category: "programming" },
];

const REVENUE_MONTHS = [
  { month: "Nov", value: 18000 },
  { month: "Dec", value: 24000 },
  { month: "Jan", value: 31000 },
  { month: "Feb", value: 28000 },
  { month: "Mar", value: 42000 },
  { month: "Apr", value: 38000 },
];
const maxRev = Math.max(...REVENUE_MONTHS.map(r => r.value));

const ROLE_BADGE: Record<string, "cyan" | "violet" | "amber" | "emerald"> = {
  student: "cyan", instructor: "violet", admin: "amber",
};

export default function AdminPage() {
  const [tab, setTab] = useState<"overview" | "users" | "courses">("overview");
  const [search, setSearch] = useState("");

  const filteredUsers = USERS.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* Admin nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "var(--canvas)",
        borderBottom: "1px solid var(--hairline)",
        display: "flex", alignItems: "center", padding: "0 32px", height: 60,
        gap: 16,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, background: "transparent", borderRadius: 4, border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 400, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>N</div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 16, color: "var(--ink)" }}>NEXUS Admin</span>
        </Link>
        <span style={{ color: "var(--hairline)", fontSize: 18 }}>|</span>
        {(["overview", "users", "courses"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 400,
              color: tab === t ? "var(--ink)" : "var(--body-mid)",
              padding: "6px 12px",
              borderBottom: tab === t ? "2px solid var(--ink)" : "2px solid transparent",
              transition: "color 0.15s",
              textTransform: "capitalize",
            }}
          >{t}</button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <Link href="/dashboard" className="btn btn-outline" style={{ fontSize: 13, padding: "7px 16px" }}>← Back to App</Link>
        </div>
      </nav>

      <div style={{ paddingTop: 92, padding: "92px 32px 32px", maxWidth: 1300, margin: "0 auto" }}>
        {tab === "overview" && (
          <>
            <div className="anim-fade-up" style={{ marginBottom: 32 }}>
              <p className="eyebrow" style={{ marginBottom: 10 }}>Platform</p>
              <h1 style={{ fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 4, letterSpacing: "-0.6px" }}>Admin Overview</h1>
              <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>Platform health at a glance</p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              <StatCard label="Total Users" value="48,201" icon="◐" trend={12} trendLabel="this month" color="cyan" delay={0} />
              <StatCard label="Active Courses" value="320" icon="⬡" trend={8} trendLabel="new this month" color="violet" delay={0.08} />
              <StatCard label="Monthly Revenue" value="$42K" icon="⌇" trend={19} trendLabel="vs last month" color="amber" delay={0.16} />
              <StatCard label="Avg Rating" value="4.9★" icon="★" trend={2} trendLabel="vs last month" color="emerald" delay={0.24} />
            </div>

            {/* Revenue chart */}
            <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 400, color: "var(--ink)", marginBottom: 24 }}>Monthly Revenue</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 180 }}>
                {REVENUE_MONTHS.map((r, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                    <span style={{ fontSize: 11, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>
                      ${(r.value / 1000).toFixed(0)}K
                    </span>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                      <div style={{
                        width: "100%",
                        height: `${(r.value / maxRev) * 100}%`,
                        background: "var(--ink)",
                        opacity: i === REVENUE_MONTHS.length - 2 ? 1 : 0.4,
                        borderRadius: "4px 4px 0 0",
                        minHeight: 4,
                        animation: "progressFill 0.8s cubic-bezier(0.16,1,0.3,1) both",
                        animationDelay: `${i * 0.08}s`,
                        transition: "opacity 0.15s",
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = i === REVENUE_MONTHS.length - 2 ? "1" : "0.4"}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>{r.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            <div className="anim-fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 400, color: "var(--ink)", marginBottom: 4, letterSpacing: "-0.6px" }}>Users</h1>
                <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>{USERS.length} total users</p>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--body-mid)", fontSize: 14, pointerEvents: "none" }}>⌕</span>
                <input className="input" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30, width: 240 }} />
              </div>
            </div>
            <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, overflow: "hidden" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Courses</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={user.name} size={32} />
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)" }}>{user.name}</p>
                            <p style={{ fontSize: 11, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><Badge variant={ROLE_BADGE[user.role] ?? "neutral"} size="sm">{user.role}</Badge></td>
                      <td style={{ color: "var(--body)", fontFamily: "var(--font-mono)", fontSize: 13 }}>{user.courses}</td>
                      <td style={{ color: "var(--body-mid)", fontSize: 12, fontFamily: "var(--font-mono)" }}>{user.joined}</td>
                      <td>
                        <Badge variant={user.status === "active" ? "emerald" : "neutral"} size="sm" dot>
                          {user.status}
                        </Badge>
                      </td>
                      <td>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--body-mid)", fontSize: 13, padding: "4px 8px" }}>Edit</button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#e05c6a", fontSize: 13, padding: "4px 8px" }}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "courses" && (
          <>
            <div className="anim-fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 400, color: "var(--ink)", marginBottom: 4, letterSpacing: "-0.6px" }}>Course Manager</h1>
                <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>{COURSES_ADMIN.length} courses</p>
              </div>
              <button className="btn btn-primary" style={{ fontSize: 13 }}>+ New Course</button>
            </div>
            <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, overflow: "hidden" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Instructor</th>
                    <th>Students</th>
                    <th>Revenue</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {COURSES_ADMIN.map((course, i) => (
                    <tr key={i}>
                      <td>
                        <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)", maxWidth: 220 }}>{course.title}</p>
                        <Badge variant={course.category === "programming" ? "cyan" : course.category === "data-science" ? "emerald" : course.category === "design" ? "violet" : "rose"} size="sm" style={{ marginTop: 4 }}>
                          {course.category}
                        </Badge>
                      </td>
                      <td style={{ fontSize: 13, color: "var(--body)", fontWeight: 400 }}>{course.instructor}</td>
                      <td style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--body)" }}>{course.students.toLocaleString()}</td>
                      <td style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: course.revenue > 0 ? "#3d9e6e" : "var(--body-mid)" }}>
                        {course.revenue > 0 ? `$${course.revenue.toLocaleString()}` : "Free"}
                      </td>
                      <td>
                        <Badge variant={course.status === "published" ? "emerald" : "amber"} size="sm" dot>
                          {course.status}
                        </Badge>
                      </td>
                      <td>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--body-mid)", fontSize: 13, padding: "4px 8px" }}>Edit</button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--body-mid)", fontSize: 13, padding: "4px 8px" }}>
                          {course.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
