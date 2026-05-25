"use client";

import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { TopNav } from "../components/layout/TopNav";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; breadcrumb: { label: string; href?: string }[] }> = {
  "/dashboard":    { title: "Dashboard",    breadcrumb: [{ label: "NEXUS", href: "/" }, { label: "Dashboard" }] },
  "/courses":      { title: "Courses",      breadcrumb: [{ label: "NEXUS", href: "/" }, { label: "Courses" }] },
  "/quiz":         { title: "Quiz",         breadcrumb: [{ label: "NEXUS", href: "/" }, { label: "Quiz" }] },
  "/certificates": { title: "Certificates", breadcrumb: [{ label: "NEXUS", href: "/" }, { label: "Certificates" }] },
  "/analytics":    { title: "Analytics",    breadcrumb: [{ label: "NEXUS", href: "/" }, { label: "Analytics" }] },
  "/live":         { title: "Live Class",   breadcrumb: [{ label: "NEXUS", href: "/" }, { label: "Live Class" }] },
  "/profile":      { title: "Profile",      breadcrumb: [{ label: "NEXUS", href: "/" }, { label: "Profile" }] },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarW = collapsed ? 64 : 240;

  const pageKey = Object.keys(PAGE_TITLES).find(k => pathname === k || (k !== "/" && pathname.startsWith(k + "/")));
  const meta = pageKey ? PAGE_TITLES[pageKey] : { title: "NEXUS", breadcrumb: [{ label: "NEXUS" }] };

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <TopNav title={meta.title} breadcrumb={meta.breadcrumb} sidebarWidth={sidebarW} />
      <main style={{
        marginLeft: sidebarW,
        paddingTop: "var(--topnav-h)",
        minHeight: "100vh",
        transition: "margin-left 0.3s cubic-bezier(0.16,1,0.3,1)",
        position: "relative",
        zIndex: 1,
      }}>
        {children}
      </main>
    </div>
  );
}
