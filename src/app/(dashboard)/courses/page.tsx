"use client";

import Link from "next/link";
import { Badge } from "../../components/ui/Badge";
import { useCourseFilter } from "../../hooks/useCourseFilter";
import type { CourseData } from "../../patterns/strategies/CourseFilterStrategy";

const ALL_COURSES: CourseData[] = [
  { id: "1",  title: "Advanced TypeScript Patterns",     category: "programming",  instructor: "Sarah Kim",     rating: 4.9, students: 3200, duration: "28h", price: 89,  type: "premium" },
  { id: "2",  title: "Machine Learning with Python",     category: "data-science", instructor: "Carlos Reyes",  rating: 4.8, students: 5100, duration: "40h", price: 0,   type: "free" },
  { id: "3",  title: "UI Design Systems",                category: "design",       instructor: "Mia Tanaka",    rating: 4.9, students: 2800, duration: "22h", price: 69,  type: "premium" },
  { id: "4",  title: "System Design at Scale",           category: "programming",  instructor: "Raj Patel",     rating: 4.7, students: 7400, duration: "36h", price: 99,  type: "premium" },
  { id: "5",  title: "Data Visualization Mastery",       category: "data-science", instructor: "Emma Liu",      rating: 4.8, students: 4100, duration: "18h", price: 0,   type: "free" },
  { id: "6",  title: "Product Strategy & Growth",        category: "business",     instructor: "James White",   rating: 4.6, students: 2200, duration: "14h", price: 59,  type: "premium" },
  { id: "7",  title: "React Architecture Deep Dive",     category: "programming",  instructor: "Nina Wolf",     rating: 4.8, students: 6100, duration: "32h", price: 79,  type: "premium" },
  { id: "8",  title: "Figma to Production",              category: "design",       instructor: "Leo Santos",    rating: 4.7, students: 1900, duration: "16h", price: 0,   type: "free" },
  { id: "9",  title: "Python for Data Engineers",        category: "data-science", instructor: "Aisha Patel",   rating: 4.9, students: 3800, duration: "26h", price: 89,  type: "premium" },
  { id: "10", title: "Startup Finance Fundamentals",     category: "business",     instructor: "Marcus Berg",   rating: 4.5, students: 1400, duration: "10h", price: 0,   type: "free" },
  { id: "11", title: "Go Backend Engineering",           category: "programming",  instructor: "Chen Wei",      rating: 4.8, students: 4500, duration: "30h", price: 89,  type: "premium" },
  { id: "12", title: "Motion Design with Figma",         category: "design",       instructor: "Kai Nakamura",  rating: 4.6, students: 1600, duration: "12h", price: 49,  type: "premium" },
];

const CATEGORIES = ["all", "programming", "data-science", "design", "business"];
const SORTS = ["Featured", "Newest", "Highest Rated", "Price: Low→High", "Price: High→Low"];

const CAT_BADGE: Record<string, "cyan" | "emerald" | "violet" | "rose"> = {
  programming: "cyan",
  "data-science": "emerald",
  design: "violet",
  business: "rose",
};

export default function CoursesPage() {
  // Strategy: el hook encapsula las estrategias de filtro y ordenamiento,
  // corrigiendo el bug donde `sort` se inicializaba pero nunca se aplicaba.
  const { filtered, filter, sort, search, setFilter, setSort, setSearch, reset } =
    useCourseFilter(ALL_COURSES);

  return (
    <div style={{ padding: 32, maxWidth: 1200, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 28 }}>
        <p className="eyebrow" style={{ marginBottom: 10 }}>Catalog</p>
        <h1 style={{
          fontFamily: "var(--font-sans)",
          fontSize: 32, fontWeight: 400, lineHeight: "36px",
          letterSpacing: "-0.6px", color: "var(--ink)", marginBottom: 4,
        }}>Course Catalog</h1>
        <p style={{ fontSize: 14, color: "var(--body)", fontWeight: 400 }}>{ALL_COURSES.length} courses across 4 disciplines</p>
      </div>

      {/* Search + filter bar */}
      <div className="anim-fade-up delay-1" style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--body-mid)", fontSize: 15, pointerEvents: "none" }}>⌕</span>
          <input
            className="input"
            placeholder="Search courses or instructors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input"
          style={{ width: 180 }}
        >
          {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Category pills */}
      <div className="anim-fade-up delay-2" style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? "var(--canvas-soft)" : "transparent",
              border: filter === cat ? "1px solid rgba(255,255,255,0.25)" : "1px solid var(--hairline)",
              color: filter === cat ? "var(--ink)" : "var(--body-mid)",
              borderRadius: 9999, padding: "7px 18px",
              fontSize: 13, fontWeight: 400, cursor: "pointer",
              transition: "all 0.15s ease",
              textTransform: "capitalize",
            }}
          >
            {cat === "all" ? "All Courses" : cat.replace("-", " ")}
            {cat !== "all" && (
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>
                ({ALL_COURSES.filter(c => c.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.8px", color: "var(--body-mid)", marginBottom: 20, textTransform: "uppercase" }}>
        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        {filter !== "all" && ` in ${filter.replace("-", " ")}`}
        {search && ` for "${search}"`}
      </p>

      {/* Course grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          background: "var(--canvas-card)", border: "1px solid var(--hairline)",
          borderRadius: 8,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontSize: 20, fontWeight: 400, color: "var(--ink)", marginBottom: 8 }}>No courses found</h3>
          <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 20, fontWeight: 400 }}>Try adjusting your search or filter.</p>
          <button onClick={reset} className="btn btn-outline" style={{ fontSize: 14 }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {filtered.map((course, i) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="anim-fade-up"
              style={{
                animationDelay: `${Math.min(i, 8) * 0.06}s`,
                background: "var(--canvas-card)", border: "1px solid var(--hairline)",
                borderRadius: 8, overflow: "hidden",
                textDecoration: "none", display: "flex", flexDirection: "column",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)"}
            >
              {/* Cover */}
              <div style={{
                height: 120,
                background: "var(--canvas-soft)",
                display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                padding: "0 16px 14px",
              }}>
                <Badge variant={CAT_BADGE[course.category] ?? "neutral"} size="sm">
                  {course.category.replace("-", " ")}
                </Badge>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11, fontWeight: 400,
                  background: course.type === "free" ? "rgba(61,158,110,0.1)" : "rgba(255,122,23,0.1)",
                  color: course.type === "free" ? "#3d9e6e" : "var(--accent-sunset)",
                  border: `1px solid ${course.type === "free" ? "rgba(61,158,110,0.25)" : "rgba(255,122,23,0.25)"}`,
                  borderRadius: 9999, padding: "2px 8px",
                }}>
                  {course.type === "free" ? "FREE" : `$${course.price}`}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 14, fontWeight: 400, color: "var(--ink)", marginBottom: 6, lineHeight: 1.4 }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: 12, color: "var(--body-mid)", fontWeight: 400, marginBottom: 12 }}>
                  by {course.instructor}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-sunset)" }}>★ {course.rating}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>({course.students.toLocaleString()})</span>
                  <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--body-mid)" }}>
                    ⏱ {course.duration}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
