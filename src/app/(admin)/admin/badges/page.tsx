// src/app/(dashboard)/admin/badges/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Badge } from "@/types/badges";
import { UserProfile } from "@/types/user";
import { useUserProfile, useAllBadges, useUserBadges } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminBadgesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch profile data with React Query
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useUserProfile();

  // Fetch all badges with React Query
  const {
    data: badgesData,
    isLoading: isLoadingBadges,
    isError: isErrorBadges,
  } = useAllBadges();

  // Extract data from responses
  const profile: UserProfile | null =
    profileData?.profile || profileData?.user || null;
  const badges: Badge[] = badgesData?.badges || [];

  // Get unique badge categories
  const categories = [
    "All",
    ...Array.from(new Set(badges.map((badge) => badge.category))),
  ].filter(Boolean);

  // Filter badges based on search term and category
  const filteredBadges = badges.filter((badge) => {
    const matchesSearch =
      searchTerm === "" ||
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || badge.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle errors
  if (isErrorProfile || isErrorBadges) {
    toast.error("Failed to load data");
  }

  // Display loading state while fetching data
  const loading = isLoadingProfile || isLoadingBadges;
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              <svg
                className="w-8 h-8 mr-3 text-blue-400"
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
              Manage Badges
            </h2>
            <p className="mt-1 text-sm text-blue-100/70">
              Create, edit, and manage badges for the community.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/admin/badges/new"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-md font-medium mt-4 md:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-blue-500/20 transition-all duration-200"
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Badge
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 overflow-hidden">
          <div className="p-4 border-b border-blue-800/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center">
                <span className="text-sm text-blue-100/70 mr-4">
                  Filter by:
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`${
                        selectedCategory === category
                          ? "bg-blue-600/80 text-white ring-2 ring-blue-400/50"
                          : "bg-slate-700/80 text-gray-300 hover:bg-slate-600/80 hover:text-white"
                      } px-3 py-1 rounded-full text-sm font-medium transition-all duration-200`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative flex-grow max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-blue-300/50"
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
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-600 bg-slate-700/80 text-white rounded-lg"
                  placeholder="Search badges"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-800/30 bg-slate-800/80">
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Badge
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800/20">
                {filteredBadges.length > 0 ? (
                  filteredBadges.map((badge: any, index: number) => (
                    <tr
                      key={badge.id}
                      className={`${
                        index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/30"
                      } hover:bg-blue-900/20 transition-colors duration-150`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600/50 to-cyan-500/50 overflow-hidden flex-shrink-0 mr-4 shadow-md">
                            {badge.image_url ? (
                              <img
                                src={badge.image_url}
                                alt={badge.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <svg
                                  className="h-7 w-7 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white text-base">
                              {badge.name}
                            </div>
                            <div className="text-sm text-blue-100/60 line-clamp-1 max-w-xs">
                              {badge.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-900/50 text-blue-300 border border-blue-500/30 font-medium">
                          {badge.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-yellow-400 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-white font-medium">
                            {badge.points || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-100/70">
                        {badge.created_at
                          ? new Date(badge.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            href={`/admin/badges/${badge.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </Link>
                          <button
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center"
                            onClick={() => {
                              /* Delete logic */
                            }}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-16 h-16 text-blue-800/50 mb-4"
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
                        <p className="text-blue-100/70 mb-4">
                          {searchTerm || selectedCategory !== "All"
                            ? "No badges match your search criteria"
                            : "No badges found in the system yet"}
                        </p>
                        <Link
                          href="/admin/badges/new"
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-blue-500/20 transition-all duration-200"
                        >
                          <span className="flex items-center">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Create First Badge
                          </span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredBadges.length > 0 && (
            <div className="bg-slate-800/80 px-4 py-3 border-t border-blue-800/30 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-blue-800/30 text-sm font-medium rounded-md text-blue-300 bg-slate-800 hover:bg-slate-700">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-blue-800/30 text-sm font-medium rounded-md text-blue-300 bg-slate-800 hover:bg-slate-700">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-blue-100/70">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">10</span> of{" "}
                    <span className="font-medium">{filteredBadges.length}</span>{" "}
                    badges
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-blue-800/30 bg-slate-800 text-sm font-medium text-blue-300 hover:bg-slate-700">
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      aria-current="page"
                      className="z-10 bg-blue-600/50 border-blue-500 text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </button>
                    <button className="bg-slate-800 border-blue-800/30 text-blue-300 hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      2
                    </button>
                    <button className="bg-slate-800 border-blue-800/30 text-blue-300 hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      3
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-blue-800/30 bg-slate-800 text-sm font-medium text-blue-300 hover:bg-slate-700">
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
