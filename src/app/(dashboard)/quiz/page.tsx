"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useCommandHistory } from "../../hooks/useCommandHistory";
import {
  AnswerQuestionCommand,
  NavigateQuestionCommand,
} from "../../patterns/commands/QuizCommands";

const QUESTIONS = [
  {
    q: "What does the `infer` keyword do in TypeScript conditional types?",
    options: [
      "Declares an inference variable to capture a type within a conditional type",
      "Converts a type to a JavaScript value at runtime",
      "Marks a type as automatically inferred by the compiler",
      "Extends an interface with inferred properties",
    ],
    correct: 0,
  },
  {
    q: "Which of the following creates a distributive conditional type?",
    options: [
      "type D<T> = [T] extends [string] ? 'yes' : 'no'",
      "type D<T> = T extends string ? 'yes' : 'no'",
      "type D = string extends string ? 'yes' : 'no'",
      "type D<T> = T & string ? 'yes' : 'no'",
    ],
    correct: 1,
  },
  {
    q: "What does `keyof typeof obj` produce when `obj` is a plain JavaScript object?",
    options: [
      "The string literal union of obj's property names",
      "The type of the object's values",
      "A mapped type of all properties",
      "The number of keys in the object",
    ],
    correct: 0,
  },
  {
    q: "Which utility type makes all properties of an interface optional?",
    options: [
      "Required<T>",
      "Readonly<T>",
      "Partial<T>",
      "Pick<T, K>",
    ],
    correct: 2,
  },
  {
    q: "In a template literal type `type E = `${A}-${B}`;`, what happens when A and B are string unions?",
    options: [
      "TypeScript generates a compilation error",
      "Only the first combination is used",
      "TypeScript distributes and generates all combinations",
      "The result is always the `string` type",
    ],
    correct: 2,
  },
];

type ModalState = "none" | "pass" | "fail";

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState<ModalState>("none");
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Command: refs para que los comandos lean el estado actual sin closures obsoletos
  const currentRef = useRef(current);
  currentRef.current = current;
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const { execute, undo, canUndo, clearHistory } = useCommandHistory();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Command: seleccionar respuesta crea un comando con soporte de undo
  const select = (optIdx: number) => {
    if (submitted) return;
    execute(new AnswerQuestionCommand(
      current,
      optIdx,
      () => answersRef.current,
      setAnswers,
    ));
  };

  const submit = () => {
    if (submitted) return;
    clearInterval(timerRef.current!);
    setSubmitted(true);
    clearHistory();
    const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
    setModal(score / QUESTIONS.length >= 0.6 ? "pass" : "fail");
  };

  const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
  const pct = Math.round((score / QUESTIONS.length) * 100);
  const answeredCount = answers.filter(a => a !== -1).length;
  const q = QUESTIONS[current];

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{
        background: "var(--canvas-card)", borderBottom: "1px solid var(--hairline)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 400, color: "var(--ink)" }}>
              Advanced TypeScript Patterns — Final Quiz
            </span>
            <span style={{
              fontSize: 13, fontFamily: "var(--font-mono)",
              color: timeLeft < 60 ? "#e05c6a" : "var(--body-mid)",
            }}>
              ⏱ {formatTime(timeLeft)}
            </span>
          </div>
          <ProgressBar value={answeredCount} max={QUESTIONS.length} color="cyan" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--body-mid)" }}>
              {answeredCount} / {QUESTIONS.length} answered
            </span>
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--body-mid)" }}>Passing: 60%</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 0, minHeight: "calc(100vh - 150px)" }}>
        {/* Question navigator */}
        <div style={{
          background: "var(--canvas-card)", borderRight: "1px solid var(--hairline)",
          padding: "24px 16px",
        }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 400, color: "var(--body-mid)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 14 }}>
            Questions
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {QUESTIONS.map((_, i) => {
              const isAnswered = answers[i] !== -1;
              const isCurrent = i === current;
              const isCorrect = submitted && answers[i] === QUESTIONS[i].correct;
              const isWrong = submitted && isAnswered && answers[i] !== QUESTIONS[i].correct;

              return (
                <button
                  key={i}
                  onClick={() => execute(new NavigateQuestionCommand(
                    () => currentRef.current, setCurrent, i,
                  ))}
                  style={{
                    background: isCurrent ? "rgba(255,255,255,0.08)" : isCorrect ? "rgba(61,158,110,0.1)" : isWrong ? "rgba(224,92,106,0.1)" : isAnswered ? "var(--canvas-soft)" : "none",
                    border: `1px solid ${isCurrent ? "rgba(255,255,255,0.25)" : isCorrect ? "rgba(61,158,110,0.3)" : isWrong ? "rgba(224,92,106,0.3)" : "var(--hairline)"}`,
                    borderRadius: 8,
                    padding: "10px 12px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: isCurrent ? "var(--ink)" : isCorrect ? "#3d9e6e" : isWrong ? "#e05c6a" : isAnswered ? "var(--canvas-mid)" : "var(--canvas-soft)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 400,
                    color: isCurrent ? "var(--canvas)" : isCorrect || isWrong ? "#0a0a0a" : "var(--body-mid)",
                    flexShrink: 0,
                  }}>
                    {isCorrect ? "✓" : isWrong ? "✗" : i + 1}
                  </span>
                  <span style={{
                    fontSize: 12, color: isCurrent ? "var(--ink)" : "var(--body)",
                    fontWeight: 400,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    Question {i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question area */}
        <div style={{ padding: "40px 48px", display: "flex", flexDirection: "column" }}>
          <div className="anim-fade-up" key={current} style={{ flex: 1, maxWidth: 640 }}>
            <p style={{ fontSize: 11, color: "var(--body-mid)", fontFamily: "var(--font-mono)", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 20 }}>
              Question {current + 1} of {QUESTIONS.length}
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 400, color: "var(--ink)", lineHeight: 1.5, marginBottom: 32 }}>
              {q.q}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[current] === i;
                const isCorrect = submitted && i === q.correct;
                const isWrong = submitted && isSelected && i !== q.correct;

                let bg = "transparent";
                let border = "var(--hairline)";
                let color = "var(--body)";

                if (isCorrect) { bg = "rgba(61,158,110,0.1)"; border = "rgba(61,158,110,0.4)"; color = "#3d9e6e"; }
                else if (isWrong) { bg = "rgba(224,92,106,0.1)"; border = "rgba(224,92,106,0.4)"; color = "#e05c6a"; }
                else if (isSelected && !submitted) { bg = "rgba(255,255,255,0.08)"; border = "rgba(255,255,255,0.25)"; color = "var(--ink)"; }

                return (
                  <button
                    key={i}
                    onClick={() => select(i)}
                    style={{
                      background: bg, border: `1px solid ${border}`,
                      borderRadius: 8, padding: "14px 18px",
                      cursor: submitted ? "default" : "pointer",
                      display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                      transition: "border-color 0.15s ease",
                    }}
                    onMouseEnter={e => { if (!submitted && !isSelected) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; }}
                    onMouseLeave={e => { if (!submitted && !isSelected) (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)"; }}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 400,
                      background: isCorrect ? "#3d9e6e" : isWrong ? "#e05c6a" : isSelected ? "var(--ink)" : "var(--canvas-soft)",
                      color: isCorrect || isWrong ? "#0a0a0a" : isSelected ? "var(--canvas)" : "var(--body-mid)",
                      border: `1px solid ${border}`,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span style={{ fontSize: 14, color, lineHeight: 1.5, fontWeight: 400 }}>{opt}</span>
                    {isCorrect && <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>}
                    {isWrong && <span style={{ marginLeft: "auto", fontSize: 16 }}>✗</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation — Command: Previous usa undo(), Next crea un NavigateQuestionCommand */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, maxWidth: 640 }}>
            <button
              onClick={undo}
              disabled={!canUndo}
              className="btn btn-outline"
              style={{ fontSize: 14, opacity: !canUndo ? 0.4 : 1 }}
            >
              ← Previous
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              {current < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => execute(new NavigateQuestionCommand(
                    () => currentRef.current, setCurrent, current + 1,
                  ))}
                  className="btn btn-outline"
                  style={{ fontSize: 14 }}
                >
                  Next →
                </button>
              ) : !submitted ? (
                <button
                  onClick={submit}
                  disabled={answeredCount < QUESTIONS.length}
                  className="btn btn-primary"
                  style={{ fontSize: 14, opacity: answeredCount < QUESTIONS.length ? 0.5 : 1 }}
                >
                  Submit Quiz →
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Score modal */}
      {modal !== "none" && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(10,10,10,0.9)",
          display: "flex", alignItems: "flex-end",
          justifyContent: "center", zIndex: 200, padding: "0 0 0 240px",
        }}>
          <div className="anim-slide-up" style={{
            background: "var(--canvas-card)", border: "1px solid var(--hairline)",
            borderRadius: "8px 8px 0 0",
            padding: "40px 48px 48px", maxWidth: 560, width: "100%",
          }}>
            <div style={{ textAlign: "center" }}>
              {/* Score gauge */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                <svg width={120} height={120} viewBox="0 0 120 120">
                  <circle cx={60} cy={60} r={50} fill="none" stroke="var(--canvas-mid)" strokeWidth={8} />
                  <circle
                    cx={60} cy={60} r={50} fill="none"
                    stroke={modal === "pass" ? "#3d9e6e" : "#e05c6a"}
                    strokeWidth={8} strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{
                    fontSize: 26, fontWeight: 400, fontFamily: "var(--font-mono)",
                    color: modal === "pass" ? "#3d9e6e" : "#e05c6a",
                  }}>
                    {pct}%
                  </span>
                </div>
              </div>

              <h2 style={{ fontSize: 28, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>
                {modal === "pass" ? "Quiz Passed" : "Not quite yet"}
              </h2>
              <p style={{ fontSize: 15, color: "var(--body)", marginBottom: 8, fontWeight: 400 }}>
                You scored {score} out of {QUESTIONS.length} questions correctly.
              </p>
              <p style={{ fontSize: 13, color: "var(--body-mid)", marginBottom: 32, fontWeight: 400 }}>
                {modal === "pass" ? "You've met the passing threshold. Your certificate is ready." : "You need 60% to pass. Review the material and try again."}
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {modal === "pass" ? (
                  <Link href="/certificates" className="btn btn-primary" style={{ fontSize: 14, padding: "11px 24px" }}>
                    ✦ Get Certificate →
                  </Link>
                ) : (
                  <button
                    onClick={() => { setModal("none"); setAnswers(new Array(QUESTIONS.length).fill(-1)); setSubmitted(false); setCurrent(0); setTimeLeft(600); clearHistory(); }}
                    className="btn btn-primary"
                    style={{ fontSize: 14, padding: "11px 24px" }}
                  >
                    Try Again
                  </button>
                )}
                <Link href="/courses/1" className="btn btn-outline" style={{ fontSize: 14, padding: "11px 24px" }}>
                  Review Course
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
