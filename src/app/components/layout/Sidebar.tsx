"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "../ui/Avatar";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",    label: "Dashboard",    icon: "⊞" },
  { href: "/courses",      label: "Courses",      icon: "⬡" },
  { href: "/quiz",         label: "Quiz",         icon: "◈" },
  { href: "/certificates", label: "Certificates", icon: "✦" },
  { href: "/analytics",    label: "Analytics",    icon: "⌇" },
  { href: "/live",         label: "Live Class",   icon: "◎", badge: 2 },
  { href: "/profile",      label: "Profile",      icon: "◐" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed: externalCollapsed, onToggle }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const pathname = usePathname();

  const collapsed = externalCollapsed ?? internalCollapsed;
  const toggle = onToggle ?? (() => setInternalCollapsed(v => !v));
  const w = collapsed ? 64 : 240;

  return (
    <aside style={{
      position: "fixed",
      top: 0, left: 0, bottom: 0,
      width: w,
      background: "var(--canvas)",
      borderRight: "1px solid var(--hairline)",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
      zIndex: 100,
      overflow: "hidden",
    }}>
      {/* Logo header */}
      <div style={{
        padding: collapsed ? "0" : "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        height: "var(--topnav-h)",
        borderBottom: "1px solid var(--hairline)",
        flexShrink: 0,
      }}>
        {!collapsed && (
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
          }}>
            <div style={{
              width: 22, height: 22,
              background: "transparent",
              border: "1px solid var(--hairline)",
              borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 400, color: "var(--ink)", flexShrink: 0,
              fontFamily: "var(--font-mono)",
            }}>N</div>
            <span style={{
              fontSize: 14, fontWeight: 400,
              letterSpacing: "1.4px", color: "var(--ink)",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
            }}>NEXUS</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 22, height: 22,
              background: "transparent",
              border: "1px solid var(--hairline)",
              borderRadius: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 400, color: "var(--ink)",
              fontFamily: "var(--font-mono)",
            }}>N</div>
          </Link>
        )}
        {!collapsed && (
          <button onClick={toggle} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--body-mid)", fontSize: 14, padding: 4,
            borderRadius: 4, transition: "color 0.15s",
          }}>⟨</button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "9px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
                margin: "2px 8px",
                borderRadius: 8,
                textDecoration: "none",
                color: active ? "var(--ink)" : "var(--body-mid)",
                background: active ? "var(--canvas-soft)" : "transparent",
                transition: "all 0.15s ease",
                position: "relative",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span style={{ whiteSpace: "nowrap", flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10, fontWeight: 400,
                      background: "var(--accent-sunset)",
                      color: "#0a0a0a",
                      borderRadius: 9999,
                      padding: "1px 6px",
                      letterSpacing: 0,
                    }}>{item.badge}</span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      {!collapsed && (
        <div style={{ padding: "0 8px 8px" }}>
          <button onClick={toggle} style={{
            width: "100%",
            background: "var(--canvas-soft)",
            border: "1px solid var(--hairline)",
            borderRadius: 9999,
            color: "var(--body-mid)",
            fontSize: 12,
            padding: "7px 14px",
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
          }}>
            <span>⟨⟨</span>
            <span>Collapse</span>
          </button>
        </div>
      )}

      {collapsed && (
        <div style={{ padding: "0 8px 8px", display: "flex", justifyContent: "center" }}>
          <button onClick={toggle} style={{
            background: "var(--canvas-soft)",
            border: "1px solid var(--hairline)",
            borderRadius: 9999,
            color: "var(--body-mid)",
            fontSize: 14, padding: "7px 10px", cursor: "pointer",
          }}>⟩</button>
        </div>
      )}

      {/* User footer */}
      <div style={{
        padding: collapsed ? "12px 0" : "12px 16px",
        borderTop: "1px solid var(--hairline)",
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 10, flexShrink: 0,
      }}>
        <Avatar name="Alex Chen" size={30} online={true} />
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{
              fontSize: 14, fontWeight: 400,
              color: "var(--ink)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>Alex Chen</div>
            <div style={{
              fontSize: 12, fontWeight: 400, color: "var(--body-mid)",
            }}>Student</div>
          </div>
        )}
      </div>
    </aside>
  );
}
