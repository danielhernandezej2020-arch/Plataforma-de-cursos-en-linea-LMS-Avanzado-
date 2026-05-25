"use client";

import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";

const ENROLLED_COURSES = [
  { title: "Advanced TypeScript Patterns", progress: 73, color: "cyan" as const },
  { title: "Machine Learning with Python", progress: 41, color: "emerald" as const },
  { title: "UI Design Systems", progress: 88, color: "violet" as const },
];

const ACHIEVEMENTS = [
  { icon: "🔥", label: "21-Day Streak", desc: "Learned every day for 3 weeks" },
  { icon: "✦", label: "First Certificate", desc: "Earned your first completion cert" },
  { icon: "⚡", label: "Quiz Master", desc: "Scored 90%+ on 3 quizzes" },
  { icon: "🌟", label: "Early Adopter", desc: "Joined in the first cohort" },
  { icon: "💎", label: "Premium Member", desc: "Upgraded to Premium plan" },
  { icon: "🎓", label: "Multi-Disciplinary", desc: "Enrolled in 3+ categories" },
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Alex Chen");
  const [bio, setBio] = useState("Senior engineer passionate about distributed systems and clean architecture. Building things that scale.");
  const [email, setEmail] = useState("alex.chen@email.com");
  const [website, setWebsite] = useState("github.com/alexchen");
  const [avatarHover, setAvatarHover] = useState(false);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Banner */}
      <div style={{
        height: 180,
        background: "var(--canvas-soft)",
        borderBottom: "1px solid var(--hairline)",
        position: "relative",
      }} />

      <div style={{ padding: "0 32px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Avatar + header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
            {/* Avatar */}
            <div
              style={{ position: "relative", marginTop: -52, cursor: "pointer" }}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
            >
              <div style={{
                width: 96, height: 96, borderRadius: "50%",
                background: "var(--canvas-mid)", border: "4px solid var(--canvas)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 400, color: "var(--body)",
                transition: "filter 0.2s",
                filter: avatarHover ? "brightness(0.7)" : "none",
              }}>AC</div>
              {avatarHover && (
                <div style={{
                  position: "absolute", inset: 4,
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 11, color: "var(--ink)",
                  fontWeight: 400, fontFamily: "var(--font-mono)",
                }}>📷 Change</div>
              )}
            </div>
            <div style={{ paddingBottom: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 400, color: "var(--ink)", marginBottom: 4, letterSpacing: "-0.6px" }}>{name}</h1>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge variant="cyan">Student</Badge>
                <span style={{ fontSize: 12, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>Member since Jan 2025</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditing(v => !v)}
            className={editing ? "btn btn-primary" : "btn btn-outline"}
            style={{ fontSize: 13, padding: "9px 20px", marginBottom: 8 }}
          >
            {editing ? "Save changes" : "✎ Edit profile"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {/* Left: Editable info */}
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 20 }}>Profile Info</h3>
            {[
              { label: "Full name", value: name, setter: setName },
              { label: "Email", value: email, setter: setEmail },
              { label: "Website", value: website, setter: setWebsite },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>
                  {field.label}
                </label>
                {editing ? (
                  <input
                    className="input"
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    style={{ fontSize: 14 }}
                  />
                ) : (
                  <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>{field.value}</p>
                )}
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Bio</label>
              {editing ? (
                <textarea
                  className="input"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  style={{ resize: "none", height: 84, fontSize: 13, paddingTop: 10 }}
                />
              ) : (
                <p style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.65, fontWeight: 400 }}>{bio}</p>
              )}
            </div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20, borderTop: "1px solid var(--hairline)", paddingTop: 20 }}>
              {[
                { label: "Courses", value: "3" },
                { label: "Certs", value: "3" },
                { label: "Hours", value: "65h" },
                { label: "Streak", value: "21🔥" },
              ].map(s => (
                <div key={s.label} style={{ background: "var(--canvas-soft)", borderRadius: 8, padding: "10px 12px", border: "1px solid var(--hairline)" }}>
                  <p style={{ fontSize: 18, fontWeight: 400, color: "var(--ink)", fontFamily: "var(--font-mono)", letterSpacing: "-0.4px" }}>{s.value}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Enrolled courses */}
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 20 }}>Enrolled Courses</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {ENROLLED_COURSES.map((c, i) => (
                <div key={i} style={{ background: "var(--canvas-soft)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)", marginBottom: 12, lineHeight: 1.35 }}>{c.title}</p>
                  <ProgressBar value={c.progress} showPercent color={c.color} />
                </div>
              ))}
            </div>
            <a href="/courses" className="btn btn-outline" style={{ width: "100%", marginTop: 16, fontSize: 13, justifyContent: "center", display: "flex" }}>Browse more courses →</a>
          </div>

          {/* Right: Achievements */}
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 20 }}>Achievements</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ACHIEVEMENTS.map((a, i) => (
                <div key={i} style={{
                  background: "var(--canvas-soft)", border: "1px solid var(--hairline)",
                  borderRadius: 8, padding: "14px 12px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{a.icon}</div>
                  <p style={{ fontSize: 12, fontWeight: 400, color: "var(--ink)", marginBottom: 3 }}>{a.label}</p>
                  <p style={{ fontSize: 10, color: "var(--body-mid)", lineHeight: 1.4, fontWeight: 400 }}>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
