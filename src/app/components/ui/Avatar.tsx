"use client";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: number;
  online?: boolean;
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  ["#191919", "#ffffff"],
  ["#1a1c20", "#ffffff"],
  ["#363a3f", "#ffffff"],
  ["#212327", "#dadbdf"],
  ["#0a0a0a", "#7d8187"],
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function Avatar({ name = "User", src, size = 36, online }: AvatarProps) {
  const [bg, fg] = getColor(name);

  return (
    <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: bg,
          border: "1px solid var(--hairline)",
          color: fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.36,
          fontWeight: 400,
          fontFamily: "var(--font-sans)",
          flexShrink: 0,
        }}>
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span style={{
          position: "absolute",
          bottom: 1,
          right: 1,
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: "50%",
          background: online ? "#3d9e6e" : "var(--body-mid)",
          border: "2px solid var(--canvas)",
        }} />
      )}
    </div>
  );
}
