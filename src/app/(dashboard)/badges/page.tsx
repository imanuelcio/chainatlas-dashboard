"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import toast from "react-hot-toast";
import { Badge } from "@/types/badges";
import { useAllBadges, useUserBadges } from "@/lib/api"; // Import our React Query hooks

// Updated type definition to match the actual API response
type UserBadge = {
  _id: string;
  earned_at: string;
  badge_id: Badge; // Badge data is nested under badge_id
};

export default function BadgesPage() {
  const [filter, setFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "earned">("all");

  // Use React Query hooks
  const {
    data: allBadgesData,
    isLoading: isLoadingAllBadges,
    isError: isErrorAllBadges,
  } = useAllBadges();

  const {
    data: userBadgesData,
    isLoading: isLoadingUserBadges,
    isError: isErrorUserBadges,
  } = useUserBadges();

  // Handle loading states
  const isLoading = isLoadingAllBadges || isLoadingUserBadges;

  // Handle error states
  if (isErrorAllBadges || isErrorUserBadges) {
    toast.error("Failed to load badges");
  }

  // Process data once it's available
  const allBadges = allBadgesData?.badges || [];
  const userBadges = userBadgesData?.badges || [];

  // Get unique badge categories
  const categories = [
    ...new Set(allBadges.map((badge) => badge.category).filter(Boolean)),
  ].sort();

  // Filter badges by category
  const filteredBadges = filter
    ? allBadges.filter((badge) => badge.category === filter)
    : allBadges;

  // Get user's earned badge IDs for easier lookup
  const earnedBadgeIds = userBadges
    .filter((item) => item.badge_id) // Ensure badge_id exists
    .map((item) => item.badge_id._id);

  // Filter earned badges for "Earned" tab
  const earnedBadges = userBadges.filter((item) =>
    filter ? item.badge_id?.category === filter : true
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white flex items-center">
            <svg
              className="h-8 w-8 text-purple-400 mr-3"
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
          </h1>
          <p className="text-blue-100/70">
            Earn badges by participating in community events and activities
          </p>
        </div>

        {/* Filter */}
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <label htmlFor="filter" className="text-sm text-blue-100/70">
            Filter by:
          </label>
          <div className="relative">
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none rounded-lg border border-blue-900/30 bg-slate-700/80 text-white px-4 py-2 pr-8 w-full md:w-auto min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-300">
              <svg
                className="h-5 w-5"
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
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-blue-800/30 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "all"
                ? "border-purple-400 text-purple-400"
                : "border-transparent text-blue-100/70 hover:text-white hover:border-blue-800/60"
            } transition-colors duration-200`}
          >
            All Badges
          </button>
          <button
            onClick={() => setActiveTab("earned")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "earned"
                ? "border-purple-400 text-purple-400"
                : "border-transparent text-blue-100/70 hover:text-white hover:border-blue-800/60"
            } transition-colors duration-200 flex items-center`}
          >
            Earned
            {/* <span className="ml-2 bg-purple-900/40 text-purple-300 text-xs px-2 py-0.5 rounded-full">
              {userBadges.length}
            </span> */}
          </button>
        </nav>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-400 shadow-lg shadow-purple-500/20"></div>
        </div>
      ) : activeTab === "all" ? (
        filteredBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge._id);
              const userBadge = userBadges.find(
                (item) => item.badge_id?._id === badge._id
              );

              return (
                <Link
                  href={`/badges/${badge._id}`}
                  key={badge._id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 relative group"
                >
                  {isEarned && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-full p-1 z-10 shadow-lg shadow-purple-500/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="p-6 flex flex-col items-center">
                    <div className="h-28 w-28 rounded-lg bg-gradient-to-br from-purple-600/50 to-blue-500/50 p-1 mb-4 overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                      <div className="h-full w-full rounded-md bg-slate-900/50 overflow-hidden">
                        {badge.image_url ? (
                          <img
                            src={badge.image_url}
                            alt={badge.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-purple-500/20 text-white">
                            <span className="font-bold text-3xl">
                              {badge.name ? badge.name.charAt(0) : "B"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-center mb-1 text-white">
                      {badge.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700/30 mb-2">
                      {badge.category}
                    </span>
                    <p className="text-sm text-blue-100/70 text-center mb-3 line-clamp-3">
                      {badge.description}
                    </p>
                    <div className="flex items-center mt-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white">
                        {badge.points} points
                      </span>
                    </div>
                    {isEarned && userBadge && (
                      <div className="flex items-center mt-2 text-purple-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
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
                        <span className="text-xs">
                          Earned on{" "}
                          {userBadge.earned_at
                            ? new Date(userBadge.earned_at).toLocaleDateString()
                            : "Unknown date"}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-slate-700/50 rounded-lg p-6 inline-flex mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 text-purple-400/50"
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
            </div>
            <h3 className="text-xl font-medium mb-2 text-white">
              No badges found
            </h3>
            <p className="text-blue-100/70 mb-6">
              {filter
                ? `There are no badges in the "${filter}" category.`
                : "There are no badges available at the moment."}
            </p>
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-purple-500/20 transition-all duration-200"
              >
                View all badges
              </button>
            )}
          </div>
        )
      ) : earnedBadges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {earnedBadges.map((userBadge) => (
            <Link
              href={`/badges/${userBadge.badge_id?._id || ""}`}
              key={userBadge._id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 relative group"
            >
              {userBadge.badge_id && (
                <div className="p-6 flex flex-col items-center">
                  <div className="h-28 w-28 rounded-lg bg-gradient-to-br from-purple-600/50 to-blue-500/50 p-1 mb-4 overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <div className="h-full w-full rounded-md bg-slate-900/50 overflow-hidden">
                      {userBadge.badge_id.image_url ? (
                        <img
                          src={userBadge.badge_id.image_url}
                          alt={userBadge.badge_id.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-purple-500/20 text-white">
                          <span className="font-bold text-3xl">
                            {userBadge.badge_id.name
                              ? userBadge.badge_id.name.charAt(0)
                              : "B"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-full p-1 z-10 shadow-lg shadow-purple-500/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg text-center mb-1 text-white">
                    {userBadge.badge_id.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700/30 mb-2">
                    {userBadge.badge_id.category}
                  </span>
                  <p className="text-sm text-blue-100/70 text-center mb-3 line-clamp-3">
                    {userBadge.badge_id.description}
                  </p>
                  <div className="flex items-center mt-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-white">
                      {userBadge.badge_id.points} points
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-purple-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
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
                    <span className="text-xs">
                      Earned on{" "}
                      {userBadge.earned_at
                        ? new Date(userBadge.earned_at).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-slate-700/50 rounded-lg p-6 inline-flex mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-purple-400/50"
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
          </div>
          <h3 className="text-xl font-medium mb-2 text-white">
            No badges earned yet
          </h3>
          <p className="text-blue-100/70 mb-6">
            {filter
              ? `You haven't earned any badges in the "${filter}" category yet.`
              : "You haven't earned any badges yet. Participate in events to earn badges!"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="px-4 py-2 rounded-lg border border-blue-800/40 text-blue-300 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 flex items-center"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear filter
              </button>
            )}
            <Link
              href="/events"
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center"
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View Events
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
