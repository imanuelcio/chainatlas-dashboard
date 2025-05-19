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
    <div className="flex min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/10 to-black">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-black bg-opacity-70 backdrop-blur-lg border-r border-purple-900/30 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        <div className="flex h-16 items-center border-b border-purple-900/30 px-6">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500"
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
                  ? "bg-purple-900/30 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                  : "text-gray-300 hover:bg-purple-800/20 hover:text-white"
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                  isActive(item.href)
                    ? "text-violet-400"
                    : "text-gray-400 group-hover:text-violet-400"
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

          {/* {user && user.role === "admin" && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Admin
                </p>
              </div>

              <Link
                href="/admin"
                className={`group flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                  isActive("/admin") &&
                  !isActive("/admin/users") &&
                  !isActive("/admin/badges") &&
                  !isActive("/admin/events")
                    ? "bg-fuchsia-900/30 text-white shadow-[0_0_10px_rgba(192,38,211,0.3)]"
                    : "text-gray-300 hover:bg-fuchsia-800/20 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                    isActive("/admin") &&
                    !isActive("/admin/users") &&
                    !isActive("/admin/badges") &&
                    !isActive("/admin/events")
                      ? "text-fuchsia-400"
                      : "text-gray-400 group-hover:text-fuchsia-400"
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                </svg>
                Overview
              </Link>

              <Link
                href="/admin/users"
                className={`group flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                  isActive("/admin/users")
                    ? "bg-fuchsia-900/30 text-white shadow-[0_0_10px_rgba(192,38,211,0.3)]"
                    : "text-gray-300 hover:bg-fuchsia-800/20 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                    isActive("/admin/users")
                      ? "text-fuchsia-400"
                      : "text-gray-400 group-hover:text-fuchsia-400"
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Users
              </Link>

              <Link
                href="/admin/badges"
                className={`group flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                  isActive("/admin/badges")
                    ? "bg-fuchsia-900/30 text-white shadow-[0_0_10px_rgba(192,38,211,0.3)]"
                    : "text-gray-300 hover:bg-fuchsia-800/20 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                    isActive("/admin/badges")
                      ? "text-fuchsia-400"
                      : "text-gray-400 group-hover:text-fuchsia-400"
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Badges
              </Link>

              <Link
                href="/admin/events"
                className={`group flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                  isActive("/admin/events")
                    ? "bg-fuchsia-900/30 text-white shadow-[0_0_10px_rgba(192,38,211,0.3)]"
                    : "text-gray-300 hover:bg-fuchsia-800/20 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                    isActive("/admin/events")
                      ? "text-fuchsia-400"
                      : "text-gray-400 group-hover:text-fuchsia-400"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Events
              </Link>
              <Link
                href="/admin/stats"
                className={`group flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                  isActive("/admin/stats")
                    ? "bg-fuchsia-900/30 text-white shadow-[0_0_10px_rgba(192,38,211,0.3)]"
                    : "text-gray-300 hover:bg-fuchsia-800/20 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                    isActive("/admin/stats")
                      ? "text-fuchsia-400"
                      : "text-gray-400 group-hover:text-fuchsia-400"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics
              </Link>

              <Link
                href="/admin/settings"
                className={`group flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                  isActive("/admin/settings")
                    ? "bg-fuchsia-900/30 text-white shadow-[0_0_10px_rgba(192,38,211,0.3)]"
                    : "text-gray-300 hover:bg-fuchsia-800/20 hover:text-white"
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                    isActive("/admin/settings")
                      ? "text-fuchsia-400"
                      : "text-gray-400 group-hover:text-fuchsia-400"
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                </svg>
                Settings
              </Link>
            </>
          )} */}
        </nav>

        {/* Version info at bottom of sidebar */}
        <div className="mt-6 px-6 py-4 border-t border-purple-900/30">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-black bg-opacity-80 backdrop-blur-md border-b border-purple-900/30 px-6">
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
                className="flex max-w-xs items-center rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white">
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
        <main className="flex-1 p-6 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-black bg-opacity-60 backdrop-blur-md border-t border-purple-900/30 p-4 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} ChainAtlas Dashboard. All rights
            reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
