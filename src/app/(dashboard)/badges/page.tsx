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
          <h1 className="text-3xl font-bold mb-2">Badges</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Earn badges by participating in community events and activities
          </p>
        </div>

        {/* Filter */}
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <label
            htmlFor="filter"
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Filter by:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 h-9 w-full md:w-auto min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            All Badges
          </button>
          <button
            onClick={() => setActiveTab("earned")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "earned"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Earned ({userBadges.length})
          </button>
        </nav>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  {isEarned && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
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
                    <div className="h-28 w-28 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden mb-4">
                      {badge.image_url ? (
                        <img
                          src={badge.image_url}
                          alt={badge.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                          <span className="text-blue-700 dark:text-blue-300 font-bold text-3xl">
                            {badge.name ? badge.name.charAt(0) : "B"}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-center mb-1">
                      {badge.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mb-2">
                      {badge.category}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3 line-clamp-3">
                      {badge.description}
                    </p>
                    <div className="flex items-center mt-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-yellow-500"
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
                      <span className="text-sm font-medium">
                        {badge.points} points
                      </span>
                    </div>
                    {isEarned && userBadge && (
                      <div className="flex items-center mt-2 text-blue-500">
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
            <div className="bg-gray-100 dark:bg-gray-800 inline-flex rounded-full p-6 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-500 dark:text-gray-400"
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
            <h3 className="text-xl font-medium mb-2">No badges found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {filter
                ? `There are no badges in the "${filter}" category.`
                : "There are no badges available at the moment."}
            </p>
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {userBadge.badge_id && (
                <div className="p-6 flex flex-col items-center">
                  <div className="h-28 w-28 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden mb-4">
                    {userBadge.badge_id.image_url ? (
                      <img
                        src={userBadge.badge_id.image_url}
                        alt={userBadge.badge_id.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                        <span className="text-blue-700 dark:text-blue-300 font-bold text-3xl">
                          {userBadge.badge_id.name
                            ? userBadge.badge_id.name.charAt(0)
                            : "B"}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-center mb-1">
                    {userBadge.badge_id.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mb-2">
                    {userBadge.badge_id.category}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3 line-clamp-3">
                    {userBadge.badge_id.description}
                  </p>
                  <div className="flex items-center mt-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-yellow-500"
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
                    <span className="text-sm font-medium">
                      {userBadge.badge_id.points} points
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-blue-500">
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
          <div className="bg-gray-100 dark:bg-gray-800 inline-flex rounded-full p-6 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-500 dark:text-gray-400"
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
          <h3 className="text-xl font-medium mb-2">No badges earned yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {filter
              ? `You haven't earned any badges in the "${filter}" category yet.`
              : "You haven't earned any badges yet. Participate in events to earn badges!"}
          </p>
          {filter ? (
            <button
              onClick={() => setFilter("")}
              className="px-4 py-2 mr-4 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear filter
            </button>
          ) : null}
          <Link
            href="/events"
            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Events
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
