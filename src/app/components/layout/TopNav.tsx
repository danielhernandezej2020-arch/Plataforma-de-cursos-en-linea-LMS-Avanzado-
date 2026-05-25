"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { useEventBus } from "../../hooks/useEventBus";

interface TopNavProps {
  title: string;
  breadcrumb?: { label: string; href?: string }[];
  sidebarWidth?: number;
}

export function TopNav({ title, breadcrumb, sidebarWidth = 240 }: TopNavProps) {
  const [showMenu, setShowMenu] = useState(false);
  // Observer: se suscribe a eventos de notificación publicados por cualquier página
  const [notifCount, setNotifCount] = useState(0);
  useEventBus("notification:new", () => setNotifCount(c => c + 1));

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: sidebarWidth,
      right: 0,
      height: "var(--topnav-h)",
      background: "var(--canvas)",
      borderBottom: "1px solid var(--hairline)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 16,
      zIndex: 90,
      transition: "left 0.3s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Breadcrumb / title */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
        {breadcrumb ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 14, fontWeight: 400,
          }}>
            {breadcrumb.map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: "var(--hairline)" }}>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} style={{
                    color: "var(--body-mid)", textDecoration: "none",
                    transition: "color 0.15s",
                  }}>{crumb.label}</Link>
                ) : (
                  <span style={{ color: "var(--ink)", fontWeight: 400 }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <h1 style={{
            fontSize: 14, fontWeight: 400,
            color: "var(--ink)",
          }}>{title}</h1>
        )}
      </div>

      {/* Search */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{
          position: "absolute", left: 14, color: "var(--body-mid)",
          fontSize: 13, pointerEvents: "none",
        }}>⌕</span>
        <input
          className="input"
          placeholder="Search..."
          style={{ width: 180, paddingLeft: 34, height: 34, fontSize: 13, borderRadius: 8 }}
        />
      </div>

      {/* Notification bell — Observer: el punto/contador reacciona a eventos del bus */}
      <button
        onClick={() => setNotifCount(0)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          position: "relative", padding: 6,
          borderRadius: 8,
          color: "var(--body-mid)", fontSize: 17, lineHeight: 1,
          transition: "color 0.15s",
        }}
        title={notifCount > 0 ? `${notifCount} notificación${notifCount > 1 ? "es" : ""}` : "Sin notificaciones"}
      >
        🔔
        {notifCount > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2,
            minWidth: 16, height: 16,
            background: "var(--accent-sunset)",
            borderRadius: 9999,
            border: "1.5px solid var(--canvas)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 400,
            color: "#fff", paddingInline: 3,
          }}>
            {notifCount > 9 ? "9+" : notifCount}
          </span>
        )}
      </button>

      {/* User menu */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowMenu(v => !v)}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 9999,
            cursor: "pointer",
            padding: "3px 10px 3px 4px",
            display: "flex", alignItems: "center", gap: 8,
            transition: "border-color 0.15s",
            color: "var(--ink)",
          }}
        >
          <Avatar name="Alex Chen" size={26} />
          <span style={{
            fontSize: 14, color: "var(--ink)", fontWeight: 400,
          }}>Alex</span>
          <span style={{ fontSize: 9, color: "var(--body-mid)" }}>▾</span>
        </button>

        {showMenu && (
          <div
            className="anim-fade-down"
            style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "var(--canvas-card)",
              border: "1px solid var(--hairline)",
              borderRadius: 8,
              padding: "6px",
              minWidth: 160, zIndex: 200,
            }}
          >
            {[
              { label: "Profile",    href: "/profile", icon: "◐" },
              { label: "Settings",   href: "/profile", icon: "⚙" },
              { label: "Admin Panel",href: "/admin",   icon: "⊞" },
              { label: "Sign out",   href: "/login",   icon: "→", danger: true },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setShowMenu(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px",
                  borderRadius: 4,
                  color: item.danger ? "#e05c6a" : "var(--body)",
                  fontSize: 14,
                  fontWeight: 400,
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--canvas-soft)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
