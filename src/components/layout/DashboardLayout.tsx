"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log(user);
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     setIsLoading(true);
  //     try {
  //       const profileResponse = await usersAPI.getUserProfile();

  //       // Periksa apakah respons mengandung user atau profile
  //       const profileData = profileResponse.profile || profileResponse.user;

  //       if (profileData) {
  //         setUser(profileData);
  //         // Initialize form data with current profile values
  //       } else {
  //         throw new Error("Profile data not found in response");
  //       }

  //       console.log("Profile response:", profileResponse);
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //       toast.error("Failed to load profile data");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  const isActive = (path: string) => {
    return (
      pathname === path || (path !== "/dashboard" && pathname.startsWith(path))
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-blue-900/20 to-slate-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 bg-opacity-80 backdrop-blur-lg border-r border-blue-800/40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        <div className="flex h-16 items-center border-b border-blue-800/40 px-6">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"
          >
            ChainAtlas Dashboard
          </Link>
        </div>

        <nav className="mt-6 px-4 space-y-1">
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
            // {
            //   name: "Hex Map",
            //   href: "/hexmap",
            //   icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
            // },
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
              className={`group flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                isActive(item.href)
                  ? "bg-blue-800/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                  : "text-gray-300 hover:bg-blue-700/20 hover:text-white"
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                  isActive(item.href)
                    ? "text-cyan-400"
                    : "text-gray-400 group-hover:text-cyan-400"
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

        {/* Version info at bottom of sidebar */}
        <div className="mt-6 px-6 py-4 border-t border-blue-800/40">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></div>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-slate-900 bg-opacity-80 backdrop-blur-md border-b border-blue-800/40 px-6">
          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex md:hidden items-center justify-center rounded-md text-gray-300 hover:text-white"
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

          {/* Page title based on current path */}
          <div className="flex-1">
            <h1 className="text-lg font-medium text-white">
              {pathname === "/dashboard" && "Dashboard"}
              {pathname === "/events" && "Events"}
              {pathname === "/badges" && "Badges"}
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

          {/* User dropdown */}
          <div className="flex items-center">
            <div className="relative ml-3">
              <button
                type="button"
                className="flex max-w-xs items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                  {user?.username ? user.username[0].toUpperCase() : ""}
                </div>
                {/* <span className="ml-2 text-sm font-medium text-gray-300">
                  {user?.username || "Loading..."}
                </span> */}
                <svg
                  className="ml-1 h-4 w-4 text-gray-400"
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
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Content cards with blue theme */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-slate-800 to-blue-900/30 rounded-xl p-5 border border-blue-700/20 shadow-lg shadow-blue-900/10">
              <h3 className="text-lg font-medium text-white mb-3">
                Quick Stats
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <svg
                      className="h-6 w-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-400">Total Achievements</p>
                    <h4 className="text-xl font-semibold text-white">247</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-blue-900/30 rounded-xl p-5 border border-blue-700/20 shadow-lg shadow-blue-900/10">
              <h3 className="text-lg font-medium text-white mb-3">
                Upcoming Events
              </h3>
              <div className="text-sm text-gray-300">
                <p className="mb-2">Blockchain Hackathon - May 25</p>
                <p>Web3 Conference - June 3</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-blue-900/30 rounded-xl p-5 border border-blue-700/20 shadow-lg shadow-blue-900/10">
              <h3 className="text-lg font-medium text-white mb-3">
                Latest Badges
              </h3>
              <div className="flex space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div> */}

          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 bg-opacity-80 backdrop-blur-md border-t border-blue-800/40 p-4 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} ChainAtlas Dashboard. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
