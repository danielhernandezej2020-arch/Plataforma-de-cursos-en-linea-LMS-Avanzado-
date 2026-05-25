"use client";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, radius = "var(--radius)", className, style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className ?? ""}`}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      <Skeleton height={140} radius="var(--radius)" />
      <Skeleton width="60%" height={12} />
      <Skeleton width="90%" height={10} />
      <Skeleton width="75%" height={10} />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <Skeleton width={60} height={24} radius="9999px" />
        <Skeleton width={48} height={24} radius="9999px" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
      <Skeleton width={36} height={36} radius="50%" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width="50%" height={11} />
        <Skeleton width="30%" height={9} />
      </div>
      <Skeleton width={80} height={24} radius="9999px" />
    </div>
  );
}
