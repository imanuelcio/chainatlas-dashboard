"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/user";
import toast from "react-hot-toast";
import { useLogout } from "@/lib/api";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const logoutMutation = useLogout();
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Redirect to login page after successful logout
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };
  const isActive = (path: string) => {
    return (
      pathname === path || (path !== "/dashboard" && pathname.startsWith(path))
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-blue-950/30 to-slate-950">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        {/* Logo section */}
        <div className="flex h-16 items-center border-b border-slate-700/50 px-6">
          <Link href="/dashboard" className="group flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 group-hover:from-blue-300 group-hover:to-cyan-200 transition-all duration-200">
              ChainAtlas
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {[
            {
              name: "Dashboard",
              href: "/dashboard",
              icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            },
            {
              name: "Events",
              href: "/events",
              icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            },
            {
              name: "Honor",
              href: "/badges",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            },
            {
              name: "Leaderboard",
              href: "/leaderboard",
              icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
            },
            {
              name: "Profile",
              href: "/profile",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out rounded-xl relative ${
                isActive(item.href)
                  ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-white border border-blue-500/30"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              {/* Active indicator */}
              {isActive(item.href) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full"></div>
              )}

              <svg
                className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                  isActive(item.href)
                    ? "text-cyan-400"
                    : "text-slate-400 group-hover:text-cyan-400"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={item.icon}
                />
              </svg>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Version info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-emerald-400 mr-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                System Online
              </p>
            </div>
            <p className="text-xs text-slate-500">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Page title */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">
              {pathname === "/dashboard" && "Dashboard"}
              {pathname === "/events" && "Events"}
              {pathname === "/badges" && "Honor System"}
              {pathname === "/hexmap" && "Hex Map"}
              {pathname === "/leaderboard" && "Leaderboard"}
              {pathname === "/profile" && "Profile"}
              {pathname === "/admin" && "Admin Overview"}
              {pathname.startsWith("/admin/users") && "User Management"}
              {pathname.startsWith("/admin/badges") && "Badge Management"}
              {pathname.startsWith("/admin/events") && "Event Management"}
              {pathname.startsWith("/admin/stats") && "Analytics"}
              {pathname.startsWith("/admin/settings") && "Settings"}
            </h1>
          </div>

          {/* User section */}
          <div className="flex items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="cursor-pointer flex items-center space-x-3 rounded-xl px-3 py-2 hover:bg-slate-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold shadow-lg">
                  {user?.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs text-slate-400">Online</p>
                </div>
                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl shadow-black/20 py-2 z-50">
                  {/* Menu Items */}
                  <div className="border-t border-slate-700/50 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                  >
                    <svg
                      className="mr-3 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 p-4 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} ChainAtlas Dashboard. Built with
            ❤️
          </p>
        </footer>
      </div>
    </div>
  );
}
