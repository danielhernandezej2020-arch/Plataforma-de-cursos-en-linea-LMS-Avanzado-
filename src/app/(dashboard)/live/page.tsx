"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";

const PARTICIPANTS = [
  { name: "Sarah Kim", role: "instructor", online: true },
  { name: "Alex Chen", role: "student", online: true },
  { name: "Priya Sharma", role: "student", online: true },
  { name: "David Wang", role: "student", online: true },
  { name: "Emma Liu", role: "student", online: false },
  { name: "Lucas Ferreira", role: "student", online: true },
  { name: "Anna Kowalski", role: "student", online: false },
];

const INITIAL_MESSAGES = [
  { from: "Sarah Kim", text: "Welcome everyone! We'll start with a quick recap of Module 4 before diving into template literals.", ts: "2:03 PM" },
  { from: "Priya Sharma", text: "Excited for today's session! Had a question about distributive types from last week.", ts: "2:04 PM" },
  { from: "Sarah Kim", text: "We'll cover that too — great timing!", ts: "2:04 PM" },
  { from: "David Wang", text: "Quick question: does `infer` work in mapped types?", ts: "2:06 PM" },
  { from: "Alex Chen", text: "I tested that earlier — it doesn't, only works in conditional types", ts: "2:07 PM" },
];

const SCHEDULED = [
  { day: "Today", time: "2:00 PM", title: "TypeScript Live Q&A", instructor: "Sarah Kim", status: "live" },
  { day: "Wed May 21", time: "4:00 PM", title: "ML Concepts — Neural Networks", instructor: "Carlos Reyes", status: "upcoming" },
  { day: "Fri May 23", time: "11:00 AM", title: "Design Systems Workshop", instructor: "Mia Tanaka", status: "upcoming" },
  { day: "Mon May 26", time: "3:00 PM", title: "System Design Review", instructor: "Raj Patel", status: "upcoming" },
];

export default function LivePage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "Alex Chen", text: input.trim(), ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  return (
    <div style={{ padding: 32, maxWidth: 1300, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.6px" }}>Live Classes</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,122,23,0.1)", border: "1px solid rgba(255,122,23,0.3)",
            borderRadius: 9999, padding: "4px 12px",
          }}>
            <span className="live-dot" />
            <span style={{ fontSize: 12, fontWeight: 400, color: "var(--accent-sunset)", fontFamily: "var(--font-mono)" }}>LIVE NOW</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, marginBottom: 24 }}>
        {/* Video + chat */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Video area */}
          <div style={{
            aspectRatio: "16/9", background: "var(--canvas)",
            border: "1px solid var(--hairline)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Instructor placeholder */}
            <div style={{ textAlign: "center", zIndex: 1 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px",
                background: "var(--canvas-mid)", border: "1px solid var(--hairline)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, color: "var(--body-mid)",
              }}>SK</div>
              <p style={{ fontSize: 15, fontWeight: 400, color: "var(--ink)", marginBottom: 4 }}>Sarah Kim</p>
              <p style={{ fontSize: 13, color: "var(--body-mid)", fontWeight: 400 }}>Advanced TypeScript Patterns — Module 4</p>
            </div>

            {/* LIVE badge */}
            <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 6,
              background: "var(--accent-sunset)", borderRadius: 4,
              padding: "4px 10px", fontSize: 11, fontWeight: 400, fontFamily: "var(--font-mono)", color: "#0a0a0a",
            }}>
              <span className="live-dot" style={{ background: "#0a0a0a" }} /> LIVE
            </div>

            {/* Viewer count */}
            <div style={{ position: "absolute", top: 16, right: 16,
              background: "rgba(0,0,0,0.6)", borderRadius: 4,
              padding: "4px 10px", fontSize: 12, color: "var(--ink)", fontFamily: "var(--font-mono)",
            }}>
              👁 {PARTICIPANTS.filter(p => p.online).length} watching
            </div>

            {/* Controls */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(transparent, rgba(10,10,10,0.9))",
              padding: "40px 20px 16px",
              display: "flex", alignItems: "center", gap: 12, justifyContent: "center",
            }}>
              {["🎤","📹","🖥","✋","💬"].map((icon, i) => (
                <button key={i} style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                  cursor: "pointer", fontSize: 16, color: "var(--ink)",
                  transition: "background 0.15s",
                }}>{icon}</button>
              ))}
              <button style={{
                background: "#e05c6a", border: "none", borderRadius: 9999,
                color: "#fff", fontSize: 12, fontWeight: 400, fontFamily: "var(--font-mono)",
                padding: "8px 16px", cursor: "pointer",
                marginLeft: 16,
              }}>Leave</button>
            </div>
          </div>

          {/* Chat */}
          <div style={{
            background: "var(--canvas-card)", border: "1px solid var(--hairline)",
            borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column",
            height: 300,
          }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)" }}>Live Chat</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)", marginLeft: "auto" }}>{messages.length} messages</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((msg, i) => {
                const isOwn = msg.from === "Alex Chen";
                return (
                  <div key={i} style={{ display: "flex", gap: 8, flexDirection: isOwn ? "row-reverse" : "row" }}>
                    <Avatar name={msg.from} size={28} />
                    <div style={{ maxWidth: "75%" }}>
                      {!isOwn && <p style={{ fontSize: 11, color: "var(--body-mid)", marginBottom: 3, fontFamily: "var(--font-mono)" }}>{msg.from} · {msg.ts}</p>}
                      <div style={{
                        padding: "8px 12px", borderRadius: 8, fontSize: 13, lineHeight: 1.5, fontWeight: 400,
                        background: isOwn ? "rgba(255,255,255,0.1)" : "var(--canvas-soft)",
                        border: isOwn ? "1px solid rgba(255,255,255,0.15)" : "1px solid var(--hairline)",
                        color: "var(--body)",
                      }}>
                        {msg.text}
                      </div>
                      {isOwn && <p style={{ fontSize: 11, color: "var(--body-mid)", marginTop: 3, textAlign: "right", fontFamily: "var(--font-mono)" }}>{msg.ts}</p>}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding: "10px 12px", borderTop: "1px solid var(--hairline)", display: "flex", gap: 8 }}>
              <input
                className="input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Send a message..."
                style={{ flex: 1 }}
              />
              <button onClick={sendMessage} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                ↗
              </button>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 20, flex: 1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 16 }}>
              Participants ({PARTICIPANTS.filter(p => p.online).length} online)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PARTICIPANTS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={p.name} size={32} online={p.online} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </p>
                    {p.role === "instructor" && (
                      <span style={{ fontSize: 10, color: "var(--accent-sunset)", fontFamily: "var(--font-mono)" }}>Instructor</span>
                    )}
                  </div>
                  {!p.online && <span style={{ fontSize: 11, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>away</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled classes */}
      <div style={{ background: "var(--canvas-card)", border: "1px solid var(--hairline)", borderRadius: 8, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 400, color: "var(--ink)", marginBottom: 16 }}>Upcoming Schedule</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {SCHEDULED.map((s, i) => (
            <div key={i} style={{
              background: "var(--canvas-soft)", border: `1px solid ${s.status === "live" ? "rgba(255,122,23,0.3)" : "var(--hairline)"}`,
              borderRadius: 8, padding: "16px 18px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Badge variant={s.status === "live" ? "orange" : "neutral"} size="sm" dot={s.status === "live"}>
                  {s.status === "live" ? "LIVE NOW" : s.day}
                </Badge>
                <span style={{ fontSize: 12, color: "var(--body-mid)", fontFamily: "var(--font-mono)" }}>{s.time}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 4 }}>{s.title}</p>
              <p style={{ fontSize: 12, color: "var(--body-mid)", marginBottom: 14, fontWeight: 400 }}>with {s.instructor}</p>
              <button
                className={s.status === "live" ? "btn btn-primary" : "btn btn-outline"}
                style={{ width: "100%", fontSize: 13, padding: "8px", justifyContent: "center" }}
              >
                {s.status === "live" ? "▶ Join Now" : "⏰ Set Reminder"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
