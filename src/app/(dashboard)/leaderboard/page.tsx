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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white flex items-center">
              <TrophyIcon className="h-8 w-8 text-indigo-400 mr-3" />
              Community Leaderboard
            </h1>
            <p className="text-blue-100/70">
              See who's leading the way in our community
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 overflow-hidden">
          <div className="border-b border-indigo-800/40">
            <div className="flex flex-col sm:flex-row">
              <button
                onClick={() => handleTabChange("points")}
                className={`py-4 px-6 text-center font-medium text-sm flex items-center justify-center ${
                  activeTab === "points"
                    ? "border-b-2 border-indigo-500 text-indigo-400"
                    : "text-blue-100/70 hover:text-white"
                }`}
              >
                <FireIcon className="h-5 w-5 mr-2" />
                Points Leaders
              </button>
              <button
                onClick={() => handleTabChange("badges")}
                className={`py-4 px-6 text-center font-medium text-sm flex items-center justify-center ${
                  activeTab === "badges"
                    ? "border-b-2 border-indigo-500 text-indigo-400"
                    : "text-blue-100/70 hover:text-white"
                }`}
              >
                <TrophyIcon className="h-5 w-5 mr-2" />
                Badge Collectors
              </button>
              <button
                onClick={() => handleTabChange("events")}
                className={`py-4 px-6 text-center font-medium text-sm flex items-center justify-center ${
                  activeTab === "events"
                    ? "border-b-2 border-indigo-500 text-indigo-400"
                    : "text-blue-100/70 hover:text-white"
                }`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Event Participants
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-400 shadow-lg shadow-indigo-500/20"></div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <ul className="divide-y divide-indigo-800/40">
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => {
                    // Get the username and profile image based on the leaderboard type
                    const username =
                      item.user_id?.username || item.username || "Unknown User";
                    const profileImage =
                      item.user_id?.profile_image_url ||
                      item.profile_image_url ||
                      "/logo/logo.svg";

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
                        className="px-6 py-5 flex items-center hover:bg-slate-700/30 transition-colors duration-200"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-700 border border-indigo-700/30">
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
                                <UserGroupIcon className="h-6 w-6 text-indigo-300" />
                              </div>
                            )}
                          </div>
                          {getRankBadge(index)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="font-medium text-white">
                            {username}
                          </div>
                          <div className="text-sm text-blue-100/70">
                            Rank #{index + 1}
                          </div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-lg font-semibold text-white">
                            {score.toLocaleString()}
                          </div>
                          <div className="text-xs text-blue-100/70">
                            {scoreLabel}
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-blue-100/70">
                      No leaderboard data available
                    </p>
                  </div>
                )}
              </ul>

              {leaderboard.length > 0 && (
                <div className="px-6 py-4 border-t border-indigo-800/40">
                  <button
                    onClick={handleLoadMore}
                    className="w-full py-2 px-4 rounded-lg text-white bg-slate-800/50 hover:bg-indigo-900/30 border border-indigo-800/40 transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 p-6">
            <h3 className="font-semibold mb-2 text-white flex items-center">
              <FireIcon className="h-5 w-5 mr-2 text-indigo-400" />
              Points System
            </h3>
            <p className="text-sm text-blue-100/70 mb-4">
              Points are earned through various activities in our community:
            </p>
            <ul className="text-sm text-blue-100/70 space-y-2">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 p-6">
            <h3 className="font-semibold mb-2 text-white flex items-center">
              <TrophyIcon className="h-5 w-5 mr-2 text-indigo-400" />
              Badges Collection
            </h3>
            <p className="text-sm text-blue-100/70 mb-4">
              Badges are awarded for specific achievements and milestones:
            </p>
            <ul className="text-sm text-blue-100/70 space-y-2">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 p-6">
            <h3 className="font-semibold mb-2 text-white flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-indigo-400" />
              Event Participation
            </h3>
            <p className="text-sm text-blue-100/70 mb-4">
              Active event participants enjoy these benefits:
            </p>
            <ul className="text-sm text-blue-100/70 space-y-2">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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
                  className="h-4 w-4 mr-2 text-indigo-400 flex-shrink-0 mt-0.5"
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
