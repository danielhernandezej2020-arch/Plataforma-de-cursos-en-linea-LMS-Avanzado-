"use client";

export type BadgeVariant =
  | "blue" | "green" | "orange" | "red" | "purple" | "neutral"
  | "cyan" | "emerald" | "amber" | "violet" | "rose";

type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const styles: Record<BadgeVariant, React.CSSProperties> = {
  blue:    { background: "rgba(255,255,255,0.06)", color: "var(--ink)",           border: "1px solid var(--hairline)" },
  neutral: { background: "rgba(255,255,255,0.06)", color: "var(--body)",          border: "1px solid var(--hairline)" },
  cyan:    { background: "rgba(255,122,23,0.1)",   color: "var(--accent-sunset)", border: "1px solid rgba(255,122,23,0.25)" },
  amber:   { background: "rgba(255,122,23,0.1)",   color: "var(--accent-sunset)", border: "1px solid rgba(255,122,23,0.25)" },
  orange:  { background: "rgba(255,122,23,0.1)",   color: "var(--accent-sunset)", border: "1px solid rgba(255,122,23,0.25)" },
  green:   { background: "rgba(61,158,110,0.1)",   color: "#3d9e6e",              border: "1px solid rgba(61,158,110,0.25)" },
  emerald: { background: "rgba(61,158,110,0.1)",   color: "#3d9e6e",              border: "1px solid rgba(61,158,110,0.25)" },
  red:     { background: "rgba(224,92,106,0.1)",   color: "#e05c6a",              border: "1px solid rgba(224,92,106,0.25)" },
  rose:    { background: "rgba(224,92,106,0.1)",   color: "#e05c6a",              border: "1px solid rgba(224,92,106,0.25)" },
  purple:  { background: "rgba(124,58,237,0.1)",   color: "var(--accent-twilight)", border: "1px solid rgba(124,58,237,0.25)" },
  violet:  { background: "rgba(124,58,237,0.1)",   color: "var(--accent-twilight)", border: "1px solid rgba(124,58,237,0.25)" },
};

export function Badge({ children, variant = "neutral", size = "md", dot, className, style: extraStyle }: BadgeProps) {
  return (
    <span
      className={`badge ${className ?? ""}`}
      style={{
        ...styles[variant],
        ...extraStyle,
        fontSize: size === "sm" ? 10 : 11,
        padding: size === "sm" ? "2px 7px" : "3px 8px",
      }}
    >
      {dot && (
        <span style={{
          display: "inline-block",
          width: 5, height: 5,
          borderRadius: "50%",
          background: "currentColor",
          opacity: 0.8,
        }} />
      )}
      {children}
    </span>
  );
}
