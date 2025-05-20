"use client";

import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import toast from "react-hot-toast";
import { UserProfile } from "@/types/user";
import { Event } from "@/types/event";
import { Badge } from "@/types/badges";
import {
  useUserProfile,
  usePublishedEvents,
  useUserBadges,
  useLeaderboard,
} from "@/lib/api";

export default function DashboardPage() {
  // Fetch user profile using React Query
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useUserProfile();

  // Fetch upcoming events using React Query
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = usePublishedEvents({ limit: 3 });

  // Fetch user badges using React Query
  const {
    data: badgesData,
    isLoading: isLoadingBadges,
    isError: isErrorBadges,
  } = useUserBadges();

  // Fetch leaderboard using React Query
  const {
    data: leaderboardData,
    isLoading: isLoadingLeaderboard,
    isError: isErrorLeaderboard,
  } = useLeaderboard(5);

  // Extract data from responses
  const profile: UserProfile | null =
    profileData?.profile || profileData?.user || null;
  const upcomingEvents: Event[] = eventsData?.events || [];

  // Sort badges by earned_at and take the 4 most recent badges
  const userBadges = badgesData?.badges || [];
  const recentBadges = [...userBadges]
    .sort(
      (a, b) =>
        new Date(b.earned_at || 0).getTime() -
        new Date(a.earned_at || 0).getTime()
    )
    .slice(0, 4);

  const leaderboard = leaderboardData?.leaderboard || [];

  // Handle errors - notify user if any of the key data failed to load
  if (isErrorProfile || isErrorEvents || isErrorBadges || isErrorLeaderboard) {
    toast.error("Failed to load some dashboard data");
  }

  // Overall loading state - consider done when profile and events are loaded
  const isLoading = isLoadingProfile || isLoadingEvents;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-16">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-400 shadow-lg shadow-blue-500/20"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome section */}
      <div className="mb-8 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl opacity-70"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2 text-white flex items-center">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 ml-2">
              {profile?.username || "User"}
            </span>
            !
          </h1>
          <p className="text-blue-100/70">
            Here&apos;s an overview of your dashboard and recent activities.
          </p>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events */}
        <div className="bg-gradient-to-br from-slate-800 to-indigo-900/30 rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 p-6 transition-transform duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-300 text-sm font-medium">
                Total Events Joined
              </p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {profile?.stats?.total_events_joined || 0}
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-indigo-400"
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
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/events"
              className="text-sm text-indigo-400 hover:text-indigo-300 inline-flex items-center transition-colors duration-200"
            >
              View all events
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-gradient-to-br from-slate-800 to-yellow-900/30 rounded-xl border border-yellow-700/20 shadow-lg shadow-yellow-900/10 p-6 transition-transform duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-300 text-sm font-medium">
                Total Points
              </p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {profile?.stats?.total_points || 0}
              </h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-yellow-400"
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
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <div className="px-2 py-1 bg-slate-700/70 rounded-lg inline-flex items-center">
              <svg
                className="h-4 w-4 text-yellow-400 mr-1"
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
              <span className="text-sm text-white font-medium">
                Rank:{" "}
                {profile?.stats?.total_points && profile?._id
                  ? leaderboard.findIndex((user) => user._id === profile._id) +
                      1 || "N/A"
                  : "N/A"}
              </span>
            </div>
            <Link
              href="/leaderboard"
              className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
            >
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-gradient-to-br from-slate-800 to-purple-900/30 rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10 p-6 transition-transform duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">
                Badges Earned
              </p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {profile?.total_achievements || 0}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-purple-400"
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
          </div>
          <div className="mt-4">
            <Link
              href="/badges"
              className="text-sm text-purple-400 hover:text-purple-300 inline-flex items-center transition-colors duration-200"
            >
              View your badges
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Account Completion */}
        <div className="bg-gradient-to-br from-slate-800 to-blue-900/30 rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-6 transition-transform duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">
                Account Completion
              </p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {profile?.stats?.account_completion || 0}%
              </h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative w-full bg-slate-700/70 rounded-full h-2.5 overflow-hidden group">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full group-hover:animate-pulse"
                style={{ width: `${profile?.stats?.account_completion || 0}%` }}
              ></div>
            </div>
            <Link
              href="/profile"
              className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center mt-2 transition-colors duration-200"
            >
              Complete profile
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Two-column layout for events and badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 overflow-hidden">
          <div className="p-6 border-b border-blue-800/30 flex items-center">
            <svg
              className="h-5 w-5 text-indigo-400 mr-2"
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
            <div>
              <h2 className="text-xl font-semibold text-white">
                Upcoming Events
              </h2>
              <p className="text-blue-100/70 text-sm mt-1">
                Participate in community events to earn badges and rewards
              </p>
            </div>
          </div>
          <div className="p-6">
            {isLoadingEvents ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400 shadow-lg shadow-indigo-500/20"></div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event, i) => (
                  <div
                    key={i}
                    className="flex items-center p-4 border border-blue-800/20 rounded-xl bg-slate-800/30 hover:bg-indigo-900/20 transition-all duration-200"
                  >
                    <div className="mr-4 h-16 w-16 flex-shrink-0 bg-gradient-to-br from-indigo-600/50 to-blue-500/50 rounded-lg overflow-hidden shadow-md">
                      {event?.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-indigo-300"
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
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <p className="text-sm text-blue-100/70 flex items-center">
                        <svg
                          className="w-3.5 h-3.5 mr-1 text-indigo-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {new Date(event.start_time).toLocaleDateString()} at{" "}
                        {new Date(event.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700/30">
                          {event.event_type}
                        </span>
                        {event.is_virtual && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/30">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Virtual
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/events/${event._id}`}
                      className="ml-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center"
                    >
                      <span>View</span>
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-slate-700/50 rounded-lg p-6 max-w-sm mx-auto">
                  <svg
                    className="h-12 w-12 text-indigo-400/50 mx-auto mb-4"
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
                  <p className="text-blue-100/70 mb-4">
                    No upcoming events found
                  </p>
                  <Link
                    href="/events"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200 inline-flex items-center"
                  >
                    Browse all events
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-blue-800/30">
            <Link
              href="/events"
              className="text-indigo-400 hover:text-indigo-300 inline-flex items-center transition-colors duration-200"
            >
              View all events
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent Badges and Leaderboard */}
        <div className="space-y-8">
          {/* Recent Badges */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10 overflow-hidden">
            <div className="p-6 border-b border-purple-800/30 flex items-center">
              <svg
                className="h-5 w-5 text-purple-400 mr-2"
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
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Recent Badges
                </h2>
                <p className="text-blue-100/70 text-sm mt-1">
                  Your latest achievements
                </p>
              </div>
            </div>
            <div className="p-6">
              {isLoadingBadges ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-400 shadow-lg shadow-purple-500/20"></div>
                </div>
              ) : recentBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recentBadges.map((item) => (
                    <div key={item._id} className="text-center group">
                      <div className="mx-auto h-16 w-16 rounded-lg bg-gradient-to-br from-purple-600/50 to-blue-500/50 p-1 mb-2 overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                        <div className="h-full w-full rounded-md bg-slate-900/50 overflow-hidden">
                          {item.badge_id && item.badge_id.image_url ? (
                            <img
                              src={item.badge_id.image_url}
                              alt={item.badge_id.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-purple-500/20 text-white font-bold">
                              {item.badge_id?.name
                                ? item.badge_id.name.charAt(0)
                                : "B"}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white truncate px-2">
                        {item.badge_id?.name || "Badge"}
                      </p>
                      <p className="text-xs text-blue-100/60">
                        {item.earned_at
                          ? new Date(item.earned_at).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-slate-700/50 rounded-lg p-6 max-w-sm mx-auto">
                    <svg
                      className="h-12 w-12 text-purple-400/50 mx-auto mb-4"
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
                      No badges earned yet
                    </p>
                    <Link
                      href="/events"
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-purple-500/20 transition-all duration-200 inline-flex items-center"
                    >
                      Join events to earn badges
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-purple-800/30">
              <Link
                href="/badges"
                className="text-purple-400 hover:text-purple-300 inline-flex items-center transition-colors duration-200"
              >
                View all badges
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-yellow-700/20 shadow-lg shadow-yellow-900/10 overflow-hidden">
            <div className="p-6 border-b border-yellow-800/30 flex items-center">
              <svg
                className="h-5 w-5 text-yellow-400 mr-2"
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
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Leaderboard
                </h2>
                <p className="text-blue-100/70 text-sm mt-1">
                  Top community members
                </p>
              </div>
            </div>
            <div className="p-6">
              {isLoadingLeaderboard ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400 shadow-lg shadow-yellow-500/20"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-yellow-800/30 bg-slate-800/80">
                        <th className="px-4 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-yellow-300 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-yellow-300 uppercase tracking-wider">
                          Badges
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-yellow-800/20">
                      {leaderboard.map((user, index) => (
                        <tr
                          key={user._id || index}
                          className={`${
                            index % 2 === 0
                              ? "bg-slate-800/30"
                              : "bg-slate-700/30"
                          } hover:bg-yellow-900/20 transition-colors duration-150 ${
                            user._id === profile?._id
                              ? "bg-yellow-900/30 border-l-2 border-yellow-500"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {index === 0 ? (
                                <div className="w-7 h-7 flex items-center justify-center bg-yellow-500/20 text-yellow-500 rounded-full">
                                  🏆
                                </div>
                              ) : index === 1 ? (
                                <div className="w-7 h-7 flex items-center justify-center bg-slate-300/20 text-slate-300 rounded-full">
                                  🥈
                                </div>
                              ) : index === 2 ? (
                                <div className="w-7 h-7 flex items-center justify-center bg-amber-600/20 text-amber-600 rounded-full">
                                  🥉
                                </div>
                              ) : (
                                <div className="w-7 h-7 flex items-center justify-center bg-slate-700/50 text-slate-400 rounded-full font-medium text-sm">
                                  {index + 1}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-yellow-600/50 to-amber-500/50 p-0.5 overflow-hidden mr-3 shadow-md">
                                <div className="h-full w-full rounded-md bg-slate-900/50 overflow-hidden">
                                  {user.profile_image_url ? (
                                    <img
                                      src={user.profile_image_url}
                                      alt={user.username || "User"}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-yellow-500/20 text-white font-bold">
                                      {user.username
                                        ? user.username.charAt(0).toUpperCase()
                                        : "U"}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div
                                  className={`font-medium ${
                                    user._id === profile?._id
                                      ? "text-yellow-300"
                                      : "text-white"
                                  }`}
                                >
                                  {user.username || "User"}
                                  {user._id === profile?._id && (
                                    <span className="ml-2 text-xs bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-500/30">
                                      You
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <span className="font-medium text-white inline-flex items-center justify-end">
                              <svg
                                className="w-4 h-4 text-yellow-400 mr-1"
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
                              {user.total_points || 0}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <span className="font-medium text-white inline-flex items-center justify-end">
                              <svg
                                className="w-4 h-4 text-purple-400 mr-1"
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
                              {user.total_achievements || 0}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-yellow-800/30">
              <Link
                href="/leaderboard"
                className="text-yellow-400 hover:text-yellow-300 inline-flex items-center transition-colors duration-200"
              >
                View full leaderboard
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Connecting animation at bottom of page */}
      <div className="relative mt-12 h-16 overflow-hidden">
        <div className="absolute inset-0 flex justify-center">
          <div className="w-full h-1 bg-slate-700/50 absolute top-8"></div>
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 animate-ping"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-8 w-2 h-2 rounded-full bg-green-500 opacity-75"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-2 h-2 rounded-full bg-purple-500 opacity-75"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-2/4 w-2 h-2 rounded-full bg-yellow-500 opacity-75"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-3/4 w-2 h-2 rounded-full bg-indigo-500 opacity-75"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-8 w-2 h-2 rounded-full bg-cyan-500 opacity-75"></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
