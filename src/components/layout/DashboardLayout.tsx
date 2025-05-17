"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";
import { authAPI } from "@/lib/api";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // useEffect(() => {
  //   // Fetch user data on component mount
  //   const fetchUser = async () => {
  //     try {
  //       const response = await authAPI.getCurrentUser();
  //       setUser(response.user);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //       // Handle authentication error - redirect to login
  //       // window.location.href = "/login";
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUser();
  // }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-black bg-opacity-90 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/20 to-black flex items-center justify-center">
  //       <div className="relative flex h-16 w-16 items-center justify-center">
  //         <div className="absolute h-full w-full animate-ping rounded-full bg-purple-500 opacity-20"></div>
  //         <div className="absolute h-12 w-12 animate-pulse rounded-full bg-violet-500 opacity-40"></div>
  //         <div className="h-8 w-8 rounded-full bg-violet-600"></div>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="flex min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/10 to-black">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-black bg-opacity-70 backdrop-blur-lg border-r border-purple-900/30 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
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
              name: "Badges",
              href: "/badges",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            },
            {
              name: "Hex Map",
              href: "/hexmap",
              icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
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

          {user && user.role === "admin" && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Admin
                </p>
              </div>
              {[
                {
                  name: "Admin Panel",
                  href: "/admin",
                  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
                },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${
                    isActive(item.href)
                      ? "bg-fuchsia-900/30 text-white shadow-[0_0_10px_rgba(192,38,211,0.3)]"
                      : "text-gray-300 hover:bg-fuchsia-800/20 hover:text-white"
                  }`}
                >
                  <svg
                    className={`mr-3 h-5 w-5 transition-colors duration-200 ease-in-out ${
                      isActive(item.href)
                        ? "text-fuchsia-400"
                        : "text-gray-400 group-hover:text-fuchsia-400"
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
            </>
          )}
        </nav>
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

          {/* Search */}
          <div className="flex-1">
            <div className="relative max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="h-9 w-full rounded-lg bg-gray-900/60 border border-purple-900/30 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* User dropdown */}
          <div className="flex items-center">
            <div className="relative">
              <button
                type="button"
                className="flex max-w-xs items-center rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white">
                  {user?.username ? user.username[0].toUpperCase() : "U"}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>

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
