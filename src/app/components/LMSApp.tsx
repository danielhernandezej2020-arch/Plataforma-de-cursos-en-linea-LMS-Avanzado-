"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Course {
  id: string;
  title: string;
  description: string;
  type: "free" | "premium";
  price: number;
  category: string;
  createdAt: string;
}

interface DemoUser { id: string; name: string; email: string; }
interface Payment { id: string; provider: string; status: string; transactionId: string; amount: number; }
interface Enrollment { id: string; status: string; enrolledAt: string; }
interface Evaluation { id: string; title: string; type: string; passingScore: number; questions: QuizQuestion[]; }
interface QuizQuestion { question: string; options: string[]; correctIndex: number; }
interface Submission { id: string; score: number; passed: boolean; }
interface Certificate { id: string; type: string; code: string; issuedAt: string; metadata: Record<string, string>; }
interface Recommendation { courseId: string; courseTitle: string; reason: string; score: number; }
interface ApiLog { method: string; url: string; status: number; body?: unknown; response: unknown; ts: number; pattern?: string; }

type Step = "idle" | "select" | "paying" | "enrolling" | "quiz" | "result" | "certificate" | "recs";

const CATEGORY_ICONS: Record<string, string> = {
  programming: "⌨️",
  "data-science": "📊",
  design: "🎨",
  business: "💼",
  general: "📚",
};

const CATEGORY_COLORS: Record<string, string> = {
  programming: "var(--lime)",
  "data-science": "var(--teal)",
  design: "var(--purple)",
  business: "var(--gold)",
  general: "var(--muted)",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function LogLine({ log }: { log: ApiLog }) {
  const statusColor = log.status >= 400 ? "#ff5a5a" : log.status >= 200 ? "var(--lime)" : "var(--muted)";
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 11, lineHeight: 1.6 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ color: log.method === "POST" ? "var(--orange)" : "var(--teal)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{log.method}</span>
        <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{log.url}</span>
        <span style={{ marginLeft: "auto", color: statusColor, fontFamily: "var(--font-mono)" }}>{log.status}</span>
        {log.pattern && <span style={{ background: "rgba(124,92,252,0.2)", color: "var(--purple)", borderRadius: 3, padding: "1px 5px", fontSize: 10 }}>{log.pattern}</span>}
      </div>
      {log.response && (
        <pre style={{ margin: "4px 0 0", color: "rgba(240,239,248,0.5)", fontSize: 10, overflow: "hidden", maxHeight: 60, textOverflow: "ellipsis" }}>
          {JSON.stringify(log.response, null, 2).slice(0, 200)}{JSON.stringify(log.response).length > 200 ? "…" : ""}
        </pre>
      )}
    </div>
  );
}

// ─── Certificate Component ────────────────────────────────────────────────────
function CertificateDisplay({ cert, course, userName }: { cert: Certificate; course: Course; userName: string; }) {
  const isVerified = cert.type === "verified";
  return (
    <div style={{ animation: "fadeUp 0.6s ease both" }}>
      <div style={{
        background: isVerified
          ? "linear-gradient(135deg, #1a1206 0%, #221a00 50%, #1a1206 100%)"
          : "linear-gradient(135deg, #0a0f0a 0%, #0d1a0d 50%, #0a0f0a 100%)",
        border: `2px solid ${isVerified ? "var(--gold)" : "var(--lime)"}`,
        borderRadius: 16,
        padding: "40px 48px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        {/* Corner ornaments */}
        {["0,0", "auto,0", "0,auto", "auto,auto"].map((pos, i) => {
          const [t, b] = pos.includes("auto,auto") ? ["auto", "0"] : pos.includes("0,auto") ? ["auto", "0"] : ["0", "auto"];
          const [l, r] = pos.includes(",0") && i < 2 ? ["0", "auto"] : ["auto", "0"];
          return (
            <div key={i} style={{
              position: "absolute", top: i >= 2 ? "auto" : 0, bottom: i >= 2 ? 0 : "auto",
              left: i % 2 === 0 ? 0 : "auto", right: i % 2 === 1 ? 0 : "auto",
              width: 60, height: 60,
              borderTop: i < 2 ? `2px solid ${isVerified ? "var(--gold)" : "var(--lime)"}` : "none",
              borderBottom: i >= 2 ? `2px solid ${isVerified ? "var(--gold)" : "var(--lime)"}` : "none",
              borderLeft: i % 2 === 0 ? `2px solid ${isVerified ? "var(--gold)" : "var(--lime)"}` : "none",
              borderRight: i % 2 === 1 ? `2px solid ${isVerified ? "var(--gold)" : "var(--lime)"}` : "none",
              opacity: 0.6,
            }} />
          );
        })}

        {/* Glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: isVerified
            ? "radial-gradient(ellipse at 50% 0%, rgba(255,209,102,0.08) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(186,255,41,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{ animation: "stamp-in 0.5s 0.3s cubic-bezier(0.175,0.885,0.32,1.275) both", marginBottom: 24 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: isVerified ? "rgba(255,209,102,0.15)" : "rgba(186,255,41,0.12)",
            border: `1px solid ${isVerified ? "var(--gold)" : "var(--lime)"}`,
            borderRadius: 100, padding: "6px 16px",
            fontSize: 12, fontFamily: "var(--font-mono)",
            color: isVerified ? "var(--gold)" : "var(--lime)",
            letterSpacing: "0.1em",
          }}>
            {isVerified ? "✦ VERIFIED CERTIFICATE" : "◆ CERTIFICATE OF COMPLETION"}
          </div>
        </div>

        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 8, letterSpacing: "0.15em", textTransform: "uppercase" }}>This certifies that</p>
        <h2 style={{
          fontSize: 36, fontWeight: 800, margin: "0 0 8px",
          background: isVerified
            ? "linear-gradient(90deg, #ffd166, #ffb347, #ffd166)"
            : "linear-gradient(90deg, var(--lime), #e0ff8a, var(--lime))",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 3s linear infinite",
        }}>{userName}</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20, letterSpacing: "0.1em" }}>has successfully completed</p>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", margin: "0 0 32px" }}>"{course.title}"</h3>

        <div style={{ display: "flex", justifyContent: "center", gap: 48, borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 24 }}>
          <div>
            <p style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Certificate ID</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: isVerified ? "var(--gold)" : "var(--lime)", margin: 0 }}>{cert.code}</p>
          </div>
          <div>
            <p style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Issued</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)", margin: 0 }}>
              {new Date(cert.issuedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          {isVerified && cert.metadata?.verificationUrl && (
            <div>
              <p style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Verify</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--teal)", margin: 0 }}>{cert.metadata.verificationUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Component ───────────────────────────────────────────────────────────
function QuizUI({ evaluation, onSubmit }: { evaluation: Evaluation; onSubmit: (answers: number[]) => void; }) {
  const [answers, setAnswers] = useState<number[]>(new Array(evaluation.questions.length).fill(-1));
  const allAnswered = answers.every(a => a !== -1);

  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", boxShadow: "0 0 8px var(--teal)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--teal)" }}>{evaluation.title}</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>
          passing: {evaluation.passingScore}%
        </span>
      </div>

      {evaluation.questions.map((q, qi) => (
        <div key={qi} style={{
          background: "var(--surface2)", borderRadius: 10,
          border: "1px solid var(--border)", padding: "16px 20px", marginBottom: 12,
        }}>
          <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
            <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", marginRight: 8 }}>Q{qi + 1}.</span>
            {q.question}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              return (
                <button key={oi} onClick={() => {
                  const next = [...answers];
                  next[qi] = oi;
                  setAnswers(next);
                }} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: selected ? "var(--lime-dim)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected ? "var(--lime)" : "var(--border)"}`,
                  borderRadius: 7, padding: "8px 14px", cursor: "pointer",
                  color: selected ? "var(--lime)" : "var(--muted)",
                  fontSize: 13, textAlign: "left", transition: "all 0.15s",
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: `1.5px solid ${selected ? "var(--lime)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 10,
                    background: selected ? "var(--lime)" : "transparent",
                    color: selected ? "var(--bg)" : "transparent",
                  }}>✓</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={() => onSubmit(answers)} disabled={!allAnswered} style={{
        width: "100%", padding: "14px 24px",
        background: allAnswered ? "var(--lime)" : "var(--surface2)",
        color: allAnswered ? "var(--bg)" : "var(--muted)",
        border: "none", borderRadius: 10, cursor: allAnswered ? "pointer" : "not-allowed",
        fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 15,
        transition: "all 0.2s", letterSpacing: "0.02em",
      }}>
        Submit Quiz →
      </button>
    </div>
  );
}

// ─── Main LMSApp ─────────────────────────────────────────────────────────────
export default function LMSApp({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [filter, setFilter] = useState<"all" | "free" | "premium">("all");
  const [step, setStep] = useState<Step>("idle");
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [apiLog, setApiLog] = useState<ApiLog[]>([]);
  const [payProvider, setPayProvider] = useState<"stripe" | "paypal">("stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const filteredCourses = courses.filter(c =>
    filter === "all" ? true : c.type === filter
  );

  // Reload courses
  useEffect(() => {
    fetch("/api/courses").then(r => r.json()).then(setCourses).catch(() => {});
  }, []);

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [apiLog]);

  const log = useCallback((method: string, url: string, status: number, response: unknown, pattern?: string) => {
    setApiLog(prev => [...prev, { method, url, status, response, ts: Date.now(), pattern }]);
  }, []);

  const api = useCallback(async (method: string, path: string, body?: unknown, pattern?: string): Promise<unknown> => {
    const res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    log(method, path, res.status, data, pattern);
    if (!res.ok) throw new Error((data as { error?: string }).error || "Request failed");
    return data;
  }, [log]);

  // ─── Demo flow ────────────────────────────────────────────────────────────
  const startDemo = useCallback(async () => {
    setLoading(true);
    setError(null);
    setApiLog([]);
    setDemoUser(null); setSelectedCourse(null); setPayment(null);
    setEnrollment(null); setEvaluation(null); setSubmission(null);
    setCertificate(null); setRecommendations([]);
    try {
      const ts = Date.now();
      const user = await api("POST", "/api/users", {
        email: `demo-${ts}@nexus.local`,
        name: "Alex Chen",
        role: "student",
      }, "New entity") as DemoUser;
      setDemoUser(user);
      await sleep(300);
      setStep("select");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
    setTimeout(() => demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, [api]);

  const selectCourse = useCallback((course: Course) => {
    setSelectedCourse(course);
    if (course.type === "premium") {
      setStep("paying");
    } else {
      setStep("enrolling");
      doEnroll(course, null);
    }
  }, []); // eslint-disable-line

  const doEnroll = useCallback(async (course: Course, pmt: Payment | null) => {
    if (!demoUser && !course) return;
    setLoading(true);
    try {
      const user = demoUser;
      if (!user) return;
      const enroll = await api("POST", "/api/enrollments", {
        userId: user.id,
        courseId: course.id,
      }, "Singleton check") as Enrollment;
      setEnrollment(enroll);
      await sleep(200);
      // Create evaluation for this course
      const isQuiz = course.type === "free";
      const evalData = await api("POST", "/api/evaluations", {
        courseId: course.id,
        title: isQuiz ? "Knowledge Check" : "Capstone Project",
        type: isQuiz ? "quiz" : "project",
        passingScore: isQuiz ? 60 : 60,
        questions: isQuiz ? [
          { question: `What is the main benefit of ${course.title.split(" ")[0]}?`, options: ["Speed", "Type safety", "Simplicity", "All of the above"], correctIndex: 1 },
          { question: "Which pattern ensures a single instance?", options: ["Factory", "Observer", "Singleton", "Decorator"], correctIndex: 2 },
          { question: "Clean Architecture separates concerns into:", options: ["Files", "Layers", "Functions", "Classes"], correctIndex: 1 },
        ] : [
          { criteria: "Architecture quality", maxScore: 40 },
          { criteria: "Pattern implementation", maxScore: 30 },
          { criteria: "Tests coverage", maxScore: 30 },
        ],
      }, "Factory Method") as Evaluation;
      setEvaluation(evalData);
      setStep("quiz");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [demoUser, api]);

  const doPay = useCallback(async () => {
    if (!demoUser || !selectedCourse) return;
    setLoading(true);
    try {
      const pmt = await api("POST", "/api/payments", {
        userId: demoUser.id,
        courseId: selectedCourse.id,
        amount: selectedCourse.price,
        provider: payProvider,
      }, "Factory Method + Singleton") as Payment;
      setPayment(pmt);
      setStep("enrolling");
      await sleep(400);
      await doEnroll(selectedCourse, pmt);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [demoUser, selectedCourse, payProvider, api, doEnroll]);

  const submitQuiz = useCallback(async (answers: number[]) => {
    if (!demoUser || !evaluation) return;
    setLoading(true);
    try {
      const sub = await api("POST", `/api/evaluations/${evaluation.id}/submit`, {
        userId: demoUser.id,
        answers,
      }) as Submission;
      setSubmission(sub);
      setStep("result");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [demoUser, evaluation, api]);

  const submitProject = useCallback(async () => {
    if (!demoUser || !evaluation) return;
    setLoading(true);
    try {
      const sub = await api("POST", `/api/evaluations/${evaluation.id}/submit`, {
        userId: demoUser.id,
        answers: { projectUrl: "https://github.com/alex-chen/capstone", notes: "Implemented all patterns" },
      }) as Submission;
      setSubmission(sub);
      setStep("result");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [demoUser, evaluation, api]);

  const generateCert = useCallback(async () => {
    if (!demoUser || !selectedCourse) return;
    setLoading(true);
    try {
      const cert = await api("POST", "/api/certificates", {
        userId: demoUser.id,
        courseId: selectedCourse.id,
      }, "Factory Method") as Certificate;
      setCertificate(cert);
      setStep("certificate");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [demoUser, selectedCourse, api]);

  const getRecs = useCallback(async () => {
    if (!demoUser) return;
    setLoading(true);
    try {
      const recs = await api("GET", `/api/recommendations?userId=${demoUser.id}`, undefined, "Singleton") as Recommendation[];
      setRecommendations(recs);
      setStep("recs");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [demoUser, api]);

  const resetDemo = () => {
    setStep("idle");
    setDemoUser(null); setSelectedCourse(null); setPayment(null);
    setEnrollment(null); setEvaluation(null); setSubmission(null);
    setCertificate(null); setRecommendations([]); setApiLog([]);
    setError(null);
  };

  // ─── Steps sidebar ─────────────────────────────────────────────────────────
  const steps = [
    { key: "select", label: "Choose Course" },
    { key: "paying", label: "Process Payment" },
    { key: "enrolling", label: "Enroll" },
    { key: "quiz", label: "Evaluation" },
    { key: "result", label: "Score" },
    { key: "certificate", label: "Certificate" },
    { key: "recs", label: "Recommendations" },
  ];
  const stepOrder = ["select", "paying", "enrolling", "quiz", "result", "certificate", "recs"];
  const currentStepIdx = stepOrder.indexOf(step);

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(8,8,16,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, background: "var(--lime)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }} />
          <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 18, letterSpacing: "0.05em" }}>NEXUS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Courses", "Demo", "About"].map(item => (
            <a key={item} href={item === "Demo" ? "#demo" : "#"} style={{
              color: "var(--muted)", fontSize: 13, textDecoration: "none",
              fontFamily: "var(--font-outfit)", letterSpacing: "0.02em",
              transition: "color 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >{item}</a>
          ))}
          <button style={{
            background: "var(--lime)", color: "var(--bg)",
            border: "none", borderRadius: 7, padding: "7px 18px",
            fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13,
            cursor: "pointer",
          }}>Get Started</button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 40, paddingRight: 40, position: "relative", overflow: "hidden" }}>
        {/* Mesh gradient background */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 80% 50% at 20% 50%, rgba(186,255,41,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 30%, rgba(0,217,204,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 60% 80%, rgba(124,92,252,0.04) 0%, transparent 60%)
          `,
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: "var(--lime)",
                display: "inline-block", animation: "pulse-glow 2s ease-in-out infinite",
              }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--lime)", letterSpacing: "0.1em" }}>
                LIVE SYSTEM — PATTERNS ACTIVE
              </span>
            </div>
            <h1 style={{
              fontSize: 72, fontWeight: 800, lineHeight: 1.0,
              margin: "0 0 24px", letterSpacing: "-0.02em",
              animation: "fadeUp 0.8s ease both",
            }}>
              Master<br />
              <span style={{
                background: "linear-gradient(90deg, var(--lime) 0%, #e0ff8a 50%, var(--teal) 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Software</span><br />
              Architecture
            </h1>
            <p style={{
              color: "var(--muted)", fontSize: 17, maxWidth: 480, lineHeight: 1.7,
              margin: "0 0 36px", animation: "fadeUp 0.8s 0.1s ease both",
            }}>
              Production-grade LMS with <strong style={{ color: "var(--text)" }}>Singleton</strong> &amp; <strong style={{ color: "var(--text)" }}>Factory Method</strong> patterns wired into every layer. Watch them run live.
            </p>
            <div style={{ display: "flex", gap: 12, animation: "fadeUp 0.8s 0.2s ease both" }}>
              <button onClick={startDemo} disabled={loading} style={{
                background: "var(--lime)", color: "var(--bg)",
                border: "none", borderRadius: 10, padding: "14px 28px",
                fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 15,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                animation: "pulse-glow 2s ease-in-out infinite",
              }}>
                {loading ? "Starting…" : "▶  Run Live Demo"}
              </button>
              <a href="#courses" style={{
                background: "transparent", color: "var(--text)",
                border: "1px solid var(--border)", borderRadius: 10, padding: "14px 28px",
                fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: 15,
                cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center",
              }}>Browse Courses</a>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeUp 0.8s 0.3s ease both" }}>
            {[
              { label: "Courses", value: courses.length, accent: "var(--lime)" },
              { label: "Free Courses", value: courses.filter(c => c.type === "free").length, accent: "var(--teal)" },
              { label: "Premium", value: courses.filter(c => c.type === "premium").length, accent: "var(--orange)" },
              { label: "Design Patterns", value: 4, accent: "var(--purple)" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderLeft: `3px solid ${stat.accent}`,
                borderRadius: 10, padding: "14px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                minWidth: 200,
              }}>
                <span style={{ color: "var(--muted)", fontSize: 12, fontFamily: "var(--font-outfit)" }}>{stat.label}</span>
                <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: stat.accent }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PATTERN BADGES ───────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1100, margin: "0 auto 60px", padding: "0 40px",
        display: "flex", gap: 12, flexWrap: "wrap",
      }}>
        {[
          { name: "DatabaseClient", type: "Singleton", desc: "One Prisma instance", color: "var(--teal)" },
          { name: "PaymentProviderRegistry", type: "Singleton", desc: "Idempotency guard", color: "var(--teal)" },
          { name: "VideoConferenceService", type: "Singleton", desc: "Session tracking", color: "var(--teal)" },
          { name: "RecommendationEngine", type: "Singleton", desc: "Adaptive learning", color: "var(--teal)" },
          { name: "CourseFactory", type: "Factory Method", desc: "Free / Premium", color: "var(--purple)" },
          { name: "EvaluationFactory", type: "Factory Method", desc: "Quiz / Project", color: "var(--purple)" },
          { name: "CertificateFactory", type: "Factory Method", desc: "Basic / Verified", color: "var(--purple)" },
          { name: "PaymentProviderFactory", type: "Factory Method", desc: "Stripe / PayPal", color: "var(--purple)" },
        ].map(p => (
          <div key={p.name} style={{
            background: "var(--surface)", border: `1px solid ${p.color}25`,
            borderRadius: 8, padding: "8px 14px",
            display: "flex", flexDirection: "column", gap: 2,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: p.color }}>{p.type}</span>
            </div>
            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: 12, color: "var(--text)" }}>{p.name}</span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>{p.desc}</span>
          </div>
        ))}
      </div>

      {/* ── COURSES ──────────────────────────────────────────────────────────── */}
      <section id="courses" style={{ padding: "0 40px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Catalog</h2>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "free", "premium"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "7px 18px", borderRadius: 7,
                border: `1px solid ${filter === f ? (f === "premium" ? "var(--orange)" : f === "free" ? "var(--lime)" : "var(--border)") : "var(--border)"}`,
                background: filter === f ? (f === "premium" ? "var(--orange-dim)" : f === "free" ? "var(--lime-dim)" : "var(--surface2)") : "transparent",
                color: filter === f ? "var(--text)" : "var(--muted)",
                fontFamily: "var(--font-syne)", fontWeight: 600, fontSize: 12,
                cursor: "pointer", letterSpacing: "0.05em", textTransform: "capitalize",
                transition: "all 0.15s",
              }}>{f === "all" ? "All" : f === "free" ? "Free" : "Premium"}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filteredCourses.map((course, i) => (
            <div key={course.id} onClick={() => {
              if (step === "select" && demoUser) selectCourse(course);
            }} style={{
              background: "var(--surface)", border: `1px solid ${step === "select" ? "var(--border-accent)" : "var(--border)"}`,
              borderRadius: 14, padding: "24px", cursor: step === "select" ? "pointer" : "default",
              transition: "all 0.2s", animation: `fadeUp 0.5s ${i * 0.08}s ease both`,
              position: "relative", overflow: "hidden",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = course.type === "premium" ? "var(--orange)" : "var(--lime)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = step === "select" ? "var(--border-accent)" : "var(--border)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              {/* Category icon */}
              <div style={{ fontSize: 28, marginBottom: 12 }}>
                {CATEGORY_ICONS[course.category] || "📚"}
              </div>

              {/* Type badge */}
              <span style={{
                position: "absolute", top: 16, right: 16,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em",
                padding: "3px 8px", borderRadius: 4,
                background: course.type === "premium" ? "var(--orange-dim)" : "var(--lime-dim)",
                color: course.type === "premium" ? "var(--orange)" : "var(--lime)",
                border: `1px solid ${course.type === "premium" ? "rgba(255,90,31,0.3)" : "rgba(186,255,41,0.3)"}`,
              }}>
                {course.type === "premium" ? `$${course.price}` : "FREE"}
              </span>

              <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, lineHeight: 1.3, paddingRight: 60 }}>{course.title}</h3>
              <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{course.description}</p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{
                  fontSize: 11, color: CATEGORY_COLORS[course.category] || "var(--muted)",
                  fontFamily: "var(--font-mono)",
                }}>{course.category}</span>
                {step === "select" && (
                  <span style={{ fontSize: 12, color: "var(--lime)", fontFamily: "var(--font-mono)" }}>← select</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO PANEL ────────────────────────────────────────────────────────── */}
      <section id="demo" ref={demoRef} style={{ padding: "0 40px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Live Demo</h2>
          <div style={{
            background: "var(--lime-dim)", border: "1px solid rgba(186,255,41,0.3)",
            borderRadius: 6, padding: "4px 12px",
            fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--lime)",
          }}>REAL API CALLS</div>
        </div>

        {step === "idle" ? (
          <div style={{
            background: "var(--surface)", border: "1px dashed var(--border-accent)",
            borderRadius: 16, padding: "60px 40px", textAlign: "center",
            animation: "fadeIn 0.4s ease both",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>
              Watch the Full User Journey
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Creates a real user in PostgreSQL, processes payments through the Factory pattern,
              enforces Singleton idempotency, generates certificates — all live.
            </p>
            <button onClick={startDemo} disabled={loading} style={{
              background: "var(--lime)", color: "var(--bg)",
              border: "none", borderRadius: 10, padding: "14px 36px",
              fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16,
              cursor: "pointer",
            }}>
              {loading ? "Initializing…" : "▶  Start Demo"}
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 300px", gap: 20 }}>

            {/* Steps sidebar */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 16px" }}>
              <div style={{ marginBottom: 20, padding: "10px 12px", background: "var(--lime-dim)", borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: 11, color: "var(--lime)", fontFamily: "var(--font-mono)" }}>DEMO USER</p>
                <p style={{ margin: "4px 0 0", fontWeight: 700, fontSize: 14 }}>{demoUser?.name || "…"}</p>
                <p style={{ margin: "2px 0 0", fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>{demoUser?.email || ""}</p>
              </div>
              {steps.filter(s => selectedCourse?.type === "free" ? s.key !== "paying" : true).map((s, i) => {
                const idx = stepOrder.indexOf(s.key);
                const done = currentStepIdx > idx;
                const active = step === s.key;
                const pending = currentStepIdx < idx;
                return (
                  <div key={s.key} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 8, marginBottom: 4,
                    background: active ? "var(--lime-dim)" : "transparent",
                    border: active ? "1px solid rgba(186,255,41,0.2)" : "1px solid transparent",
                    transition: "all 0.2s",
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      background: done ? "var(--lime)" : active ? "var(--lime)" : "var(--surface2)",
                      border: `1.5px solid ${done || active ? "var(--lime)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, color: done || active ? "var(--bg)" : "var(--muted)",
                      fontFamily: "var(--font-mono)", fontWeight: 700,
                    }}>{done ? "✓" : i + 1}</div>
                    <span style={{
                      fontSize: 12, fontWeight: active ? 700 : 400,
                      color: active ? "var(--lime)" : done ? "var(--text)" : "var(--muted)",
                    }}>{s.label}</span>
                  </div>
                );
              })}
              <button onClick={resetDemo} style={{
                width: "100%", marginTop: 12, padding: "8px",
                background: "transparent", border: "1px solid var(--border)",
                borderRadius: 7, color: "var(--muted)", fontSize: 12,
                cursor: "pointer", fontFamily: "var(--font-outfit)",
              }}>↺ Reset</button>
            </div>

            {/* Active step content */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px" }}>

              {/* SELECT COURSE */}
              {step === "select" && (
                <div style={{ animation: "fadeUp 0.4s ease both" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>Choose a Course</h3>
                  <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 20px" }}>
                    Click any course card above, or select one below. Free courses skip payment.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {courses.map(c => (
                      <button key={c.id} onClick={() => selectCourse(c)} style={{
                        background: "var(--surface2)", border: "1px solid var(--border)",
                        borderRadius: 10, padding: "14px 18px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                        transition: "all 0.15s",
                      }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = c.type === "premium" ? "var(--orange)" : "var(--lime)";
                          (e.currentTarget as HTMLButtonElement).style.background = c.type === "premium" ? "var(--orange-dim)" : "var(--lime-dim)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                          (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)";
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{CATEGORY_ICONS[c.category] || "📚"}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{c.title}</p>
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--muted)" }}>{c.category}</p>
                        </div>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: 12,
                          color: c.type === "premium" ? "var(--orange)" : "var(--lime)",
                          fontWeight: 700,
                        }}>{c.type === "premium" ? `$${c.price}` : "FREE"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT */}
              {step === "paying" && selectedCourse && (
                <div style={{ animation: "fadeUp 0.4s ease both" }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700 }}>Process Payment</h3>
                  <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 24px" }}>
                    <code style={{ color: "var(--orange)" }}>PaymentProviderFactory.create()</code> → instantiates provider.
                    <code style={{ color: "var(--teal)", marginLeft: 6 }}>PaymentProviderRegistry</code> singleton guards against duplicates.
                  </p>
                  <div style={{
                    background: "var(--surface2)", borderRadius: 12, padding: "20px",
                    border: "1px solid var(--border)", marginBottom: 20,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ color: "var(--muted)", fontSize: 13 }}>Course</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{selectedCourse.title}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                      <span style={{ color: "var(--muted)", fontSize: 13 }}>Total</span>
                      <span style={{ fontWeight: 800, fontSize: 20, color: "var(--orange)" }}>${selectedCourse.price}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>Payment provider (Factory creates the implementation):</p>
                  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    {(["stripe", "paypal"] as const).map(p => (
                      <button key={p} onClick={() => setPayProvider(p)} style={{
                        flex: 1, padding: "12px", borderRadius: 8,
                        background: payProvider === p ? "var(--orange-dim)" : "var(--surface2)",
                        border: `1.5px solid ${payProvider === p ? "var(--orange)" : "var(--border)"}`,
                        color: payProvider === p ? "var(--orange)" : "var(--muted)",
                        fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14,
                        cursor: "pointer", textTransform: "capitalize",
                      }}>{p === "stripe" ? "💳 Stripe" : "🅿 PayPal"}</button>
                    ))}
                  </div>
                  <button onClick={doPay} disabled={loading} style={{
                    width: "100%", padding: "14px", background: "var(--orange)",
                    border: "none", borderRadius: 10, color: "#fff",
                    fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 15,
                    cursor: "pointer",
                  }}>
                    {loading ? "Processing…" : `Pay $${selectedCourse.price} with ${payProvider}`}
                  </button>
                </div>
              )}

              {/* ENROLLING */}
              {step === "enrolling" && (
                <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeIn 0.4s ease both" }}>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: "50%", background: "var(--lime)",
                        animation: `bounce-dot 1.2s ${i * 0.2}s ease-in-out infinite`,
                      }} />
                    ))}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 14 }}>Enrolling and creating evaluation…</p>
                </div>
              )}

              {/* QUIZ */}
              {step === "quiz" && evaluation && selectedCourse && (
                evaluation.type === "quiz" ? (
                  <QuizUI evaluation={evaluation} onSubmit={submitQuiz} />
                ) : (
                  <div style={{ animation: "fadeUp 0.4s ease both" }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>Capstone Project</h3>
                    <p style={{ color: "var(--muted)", fontSize: 13, margin: "0 0 20px" }}>
                      Submit your project URL. Score is auto-simulated at 75% (passing = 60%).
                    </p>
                    <div style={{
                      background: "var(--surface2)", border: "1px solid var(--border)",
                      borderRadius: 10, padding: "16px 18px", marginBottom: 20, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--teal)",
                    }}>
                      https://github.com/alex-chen/capstone
                    </div>
                    {(evaluation.questions as unknown as { criteria: string; maxScore: number }[]).map((r, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between",
                        padding: "8px 0", borderBottom: "1px solid var(--border)",
                        fontSize: 13,
                      }}>
                        <span style={{ color: "var(--muted)" }}>{r.criteria}</span>
                        <span style={{ fontFamily: "var(--font-mono)" }}>{r.maxScore}pts</span>
                      </div>
                    ))}
                    <button onClick={submitProject} disabled={loading} style={{
                      width: "100%", marginTop: 20, padding: "14px",
                      background: "var(--purple)", border: "none", borderRadius: 10,
                      color: "#fff", fontFamily: "var(--font-syne)", fontWeight: 700,
                      fontSize: 15, cursor: "pointer",
                    }}>
                      {loading ? "Submitting…" : "Submit Project →"}
                    </button>
                  </div>
                )
              )}

              {/* RESULT */}
              {step === "result" && submission && (
                <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease both" }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: "50%", margin: "0 auto 24px",
                    background: submission.passed ? "var(--lime-dim)" : "rgba(255,90,31,0.1)",
                    border: `3px solid ${submission.passed ? "var(--lime)" : "var(--orange)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 36, animation: "stamp-in 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both",
                  }}>
                    {submission.passed ? "🏆" : "✗"}
                  </div>
                  <h3 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
                    {submission.passed ? "Passed!" : "Not Passed"}
                  </h3>
                  <div style={{
                    fontSize: 52, fontWeight: 800, margin: "0 0 16px",
                    color: submission.score >= 80 ? "var(--lime)" : submission.score >= 60 ? "var(--gold)" : "var(--orange)",
                  }}>{submission.score}<span style={{ fontSize: 24, color: "var(--muted)" }}>%</span></div>
                  {submission.passed && (
                    <button onClick={generateCert} disabled={loading} style={{
                      background: "var(--lime)", color: "var(--bg)",
                      border: "none", borderRadius: 10, padding: "14px 28px",
                      fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 15,
                      cursor: "pointer", marginTop: 8,
                    }}>
                      {loading ? "Generating…" : "🎓 Generate Certificate"}
                    </button>
                  )}
                </div>
              )}

              {/* CERTIFICATE */}
              {step === "certificate" && certificate && selectedCourse && demoUser && (
                <div>
                  <CertificateDisplay cert={certificate} course={selectedCourse} userName={demoUser.name} />
                  <button onClick={getRecs} disabled={loading} style={{
                    width: "100%", marginTop: 16,
                    background: "transparent", border: "1px solid var(--border)",
                    borderRadius: 10, padding: "12px",
                    color: "var(--muted)", fontFamily: "var(--font-outfit)", fontSize: 14,
                    cursor: "pointer",
                  }}>
                    {loading ? "Loading…" : "🤖 Get Recommendations →"}
                  </button>
                </div>
              )}

              {/* RECOMMENDATIONS */}
              {step === "recs" && (
                <div style={{ animation: "fadeUp 0.4s ease both" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <span style={{ fontSize: 20 }}>🤖</span>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>AI Recommendations</h3>
                    <div style={{
                      background: "var(--teal-dim)", border: "1px solid rgba(0,217,204,0.3)",
                      borderRadius: 5, padding: "2px 8px", fontSize: 10,
                      fontFamily: "var(--font-mono)", color: "var(--teal)",
                    }}>Singleton Engine</div>
                  </div>
                  {recommendations.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px", color: "var(--muted)", fontSize: 14 }}>
                      No recommendations yet — enroll in more courses to train the engine! 🎯
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {recommendations.map(rec => (
                        <div key={rec.courseId} style={{
                          background: "var(--surface2)", border: "1px solid var(--border)",
                          borderRadius: 10, padding: "14px 16px",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, fontSize: 14 }}>{rec.courseTitle}</span>
                            <span style={{
                              fontFamily: "var(--font-mono)", fontSize: 12,
                              color: rec.score > 0.8 ? "var(--lime)" : "var(--gold)",
                            }}>{Math.round(rec.score * 100)}% match</span>
                          </div>
                          <p style={{ margin: 0, color: "var(--muted)", fontSize: 12 }}>{rec.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{
                    marginTop: 20, padding: "16px", background: "var(--lime-dim)",
                    border: "1px solid rgba(186,255,41,0.2)", borderRadius: 10,
                    textAlign: "center",
                  }}>
                    <p style={{ margin: 0, color: "var(--lime)", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 15 }}>
                      🎉 Demo Complete!
                    </p>
                    <p style={{ margin: "6px 0 12px", color: "var(--muted)", fontSize: 12 }}>All patterns executed: 4 Singletons + 4 Factory Methods</p>
                    <button onClick={resetDemo} style={{
                      background: "var(--lime)", color: "var(--bg)",
                      border: "none", borderRadius: 8, padding: "10px 20px",
                      fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13,
                      cursor: "pointer",
                    }}>↺ Run Again</button>
                  </div>
                </div>
              )}

              {error && (
                <div style={{
                  marginTop: 16, padding: "12px 16px",
                  background: "rgba(255,90,31,0.08)", border: "1px solid rgba(255,90,31,0.3)",
                  borderRadius: 8, color: "var(--orange)", fontSize: 13,
                  fontFamily: "var(--font-mono)",
                }}>⚠ {error}</div>
              )}
            </div>

            {/* API Log */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "20px",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lime)", animation: "pulse-glow 2s infinite" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>API LOG</span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>{apiLog.length} calls</span>
              </div>
              <div style={{ flex: 1, overflowY: "auto", maxHeight: 500 }}>
                {apiLog.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: 12, textAlign: "center", marginTop: 40 }}>
                    API calls will appear here
                  </p>
                ) : (
                  apiLog.map((l, i) => <LogLine key={i} log={l} />)
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "32px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 20, height: 20, background: "var(--lime)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }} />
          <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14 }}>NEXUS</span>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 12, margin: 0 }}>
          Next.js 14 · Prisma 5 · PostgreSQL · TypeScript · Clean Architecture
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          {["Singleton", "Factory Method", "SOLID", "DI"].map(tag => (
            <span key={tag} style={{
              fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)",
              background: "var(--surface)", padding: "3px 8px", borderRadius: 4,
            }}>{tag}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
