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
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.username || "User"}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here&apos;s an overview of your dashboard.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Events Joined</p>
              <h3 className="text-3xl font-bold text-white">
                {profile?.stats?.total_events_joined || 0}
              </h3>
            </div>
            <div className="p-3 bg-indigo-900 bg-opacity-40 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-400"
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
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View all events →
            </Link>
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Points
              </p>
              <h3 className="text-3xl font-bold">
                {profile?.stats?.total_points || 0}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
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
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Rank:{" "}
              {profile?.stats?.total_points && profile?._id
                ? leaderboard.findIndex((user) => user._id === profile._id) +
                    1 || "N/A"
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Badges Earned
              </p>
              <h3 className="text-3xl font-bold">
                {profile?.total_achievements || 0}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
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
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View your badges →
            </Link>
          </div>
        </div>

        {/* Account Completion */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Account Completion
              </p>
              <h3 className="text-3xl font-bold">
                {profile?.stats?.account_completion || 0}%
              </h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
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
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 rounded-full h-2"
                style={{ width: `${profile?.stats?.account_completion || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout for events and badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Participate in community events to earn badges and rewards
            </p>
          </div>
          <div className="p-6">
            {isLoadingEvents ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="mr-4 h-16 w-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
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
                            className="h-8 w-8 text-gray-400"
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
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.start_time).toLocaleDateString()} at{" "}
                        {new Date(event.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {event.event_type}
                        </span>
                        {event.is_virtual && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ml-2">
                            Virtual
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/events/${event._id}`}
                      className="ml-4 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No upcoming events found
                </p>
                <p className="mt-2">
                  <Link
                    href="/events"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all events
                  </Link>
                </p>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/events"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all events →
            </Link>
          </div>
        </div>

        {/* Recent Badges and Leaderboard */}
        <div className="space-y-8">
          {/* Recent Badges */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Recent Badges</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Your latest achievements
              </p>
            </div>
            <div className="p-6">
              {isLoadingBadges ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : recentBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recentBadges.map((item) => (
                    <div key={item._id} className="text-center">
                      <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 p-1 mb-2 overflow-hidden">
                        {item.badge_id && item.badge_id.image_url ? (
                          <img
                            src={item.badge_id.image_url}
                            alt={item.badge_id.name}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <span className="text-blue-700 dark:text-blue-300 font-bold">
                              {item.badge_id?.name
                                ? item.badge_id.name.charAt(0)
                                : "B"}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">
                        {item.badge_id?.name || "Badge"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.earned_at
                          ? new Date(item.earned_at).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No badges earned yet
                  </p>
                  <p className="mt-2">
                    <Link
                      href="/events"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Join events to earn badges
                    </Link>
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/badges"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all badges →
              </Link>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Leaderboard</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Top community members
              </p>
            </div>
            <div className="p-6">
              {isLoadingLeaderboard ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Badges
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((user, index) => (
                        <tr
                          key={user._id || index}
                          className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {index === 0 ? (
                                <span className="text-yellow-500">🏆</span>
                              ) : index === 1 ? (
                                <span className="text-gray-400">🥈</span>
                              ) : index === 2 ? (
                                <span className="text-amber-600">🥉</span>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden mr-3">
                                {user.profile_image_url ? (
                                  <img
                                    src={user.profile_image_url}
                                    alt={user.username || "User"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                                    {user.username
                                      ? user.username.charAt(0).toUpperCase()
                                      : "U"}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {user.username || "User"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <span className="font-medium">
                              {user.total_points || 0}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <span className="font-medium">
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
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/leaderboard"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View full leaderboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
