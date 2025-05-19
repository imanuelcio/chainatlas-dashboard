// src/app/(dashboard)/leaderboard/page.tsx
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useLeaderboard } from "@/lib/api";
import {
  FireIcon,
  TrophyIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

type LeaderboardItem = {
  _id: string;
  user_id?: {
    _id: string;
    username: string;
    profile_image_url: string;
  };
  username?: string;
  profile_image_url?: string;
  total_points?: number;
  total_achievements?: number;
  total_events_joined?: number;
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"points" | "badges" | "events">(
    "points"
  );
  const [limit, setLimit] = useState(10);

  // Use React Query for data fetching
  const { data, isLoading, refetch } = useLeaderboard(limit);

  const leaderboard: LeaderboardItem[] = data?.leaderboard || [];

  const handleTabChange = (type: "points" | "badges" | "events") => {
    setActiveTab(type);
    // In a real implementation, you might want to call a different endpoint based on the tab
    // For now, we'll just use the existing leaderboard data
  };

  const handleLoadMore = () => {
    setLimit((prev) => prev + 10);
  };

  // Helper to get the rank badge based on position
  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <div className="absolute -left-1 -top-1 h-6 w-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
          1
        </div>
      );
    } else if (index === 1) {
      return (
        <div className="absolute -left-1 -top-1 h-6 w-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
          2
        </div>
      );
    } else if (index === 2) {
      return (
        <div className="absolute -left-1 -top-1 h-6 w-6 bg-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
          3
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              <TrophyIcon className="h-8 w-8 mr-3 text-yellow-500" />
              Community Leaderboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              See who's leading the way in our community
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row">
              <button
                onClick={() => handleTabChange("points")}
                className={`py-4 px-6 text-center font-medium text-sm flex items-center justify-center ${
                  activeTab === "points"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <FireIcon className="h-5 w-5 mr-2" />
                Points Leaders
              </button>
              <button
                onClick={() => handleTabChange("badges")}
                className={`py-4 px-6 text-center font-medium text-sm flex items-center justify-center ${
                  activeTab === "badges"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <TrophyIcon className="h-5 w-5 mr-2" />
                Badge Collectors
              </button>
              <button
                onClick={() => handleTabChange("events")}
                className={`py-4 px-6 text-center font-medium text-sm flex items-center justify-center ${
                  activeTab === "events"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Event Participants
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => {
                    // Get the username and profile image based on the leaderboard type
                    const username =
                      item.user_id?.username || item.username || "Unknown User";
                    const profileImage =
                      item.user_id?.profile_image_url ||
                      item.profile_image_url ||
                      "/default-avatar.png";

                    // Get the score based on the active tab
                    let score = 0;
                    let scoreLabel = "";

                    if (activeTab === "points") {
                      score = item.total_points || 0;
                      scoreLabel = "points";
                    } else if (activeTab === "badges") {
                      score = item.total_achievements || 0;
                      scoreLabel = "badges";
                    } else if (activeTab === "events") {
                      score = item.total_events_joined || 0;
                      scoreLabel = "events";
                    }

                    return (
                      <li
                        key={item._id}
                        className="px-6 py-5 flex items-center"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            {profileImage ? (
                              <img
                                src={profileImage}
                                alt={username}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).onerror = null;
                                  (e.target as HTMLImageElement).src =
                                    "/default-avatar.png";
                                }}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <UserGroupIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                          </div>
                          {getRankBadge(index)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Rank #{index + 1}
                          </div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {score.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {scoreLabel}
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No leaderboard data available
                    </p>
                  </div>
                )}
              </ul>

              {leaderboard.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLoadMore}
                    className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
              <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
              Points System
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Points are earned through various activities in our community:
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Earning badges (+varies by badge)</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Attending events (+50 each)</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Contributing to projects (+100)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
              <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Badges Collection
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Badges are awarded for specific achievements and milestones:
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Completing special challenges</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Participating in specific events</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Reaching community milestones</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
              Event Participation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Active event participants enjoy these benefits:
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Early access to new features</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Special recognition in community</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5"
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
                <span>Exclusive event-specific badges</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
