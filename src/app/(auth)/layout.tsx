export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh", display: "grid",
      gridTemplateColumns: "1fr 1fr",
      position: "relative", zIndex: 1,
      background: "var(--canvas)",
    }}>
      {children}
    </div>
  );
}
