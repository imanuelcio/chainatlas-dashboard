"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import toast from "react-hot-toast";
import { Badge } from "@/types/badges";
import { useBadge, useUserBadges, useAllBadges } from "@/lib/api";

export default function BadgeDetailPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const badgeId = params.id;

  // Fetch badge details using React Query
  const {
    data: badgeData,
    isLoading: isLoadingBadge,
    isError: isErrorBadge,
  } = useBadge(badgeId);

  // Fetch user badges to check if this badge is earned
  const {
    data: userBadgesData,
    isLoading: isLoadingUserBadges,
    isError: isErrorUserBadges,
  } = useUserBadges();

  // Extract badge from response data
  const badge: Badge | null = badgeData?.badge || null;

  // Check if badge is earned and get earned date
  const userBadges = userBadgesData?.badges || [];
  // Use _id instead of id to match MongoDB document structure
  const earnedBadge = userBadges.find((item) => item.badge_id?._id === badgeId);
  const isEarned = !!earnedBadge;
  const earnedDate = earnedBadge?.earned_at || null;

  // Fetch related badges in the same category
  const {
    data: relatedBadgesData,
    isLoading: isLoadingRelated,
    isError: isErrorRelated,
  } = useAllBadges(badge?.category);

  const relatedBadges = badge
    ? (relatedBadgesData?.badges || [])
        // Use _id instead of id for comparison
        .filter((b) => b._id !== badge._id)
        .slice(0, 3)
    : [];

  // Handle errors
  if (isErrorBadge) {
    toast.error("Failed to load badge details");
    router.push("/badges");
    return null;
  }

  // Loading state
  const isLoading = isLoadingBadge || isLoadingUserBadges;
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-16">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-400 shadow-lg shadow-purple-500/20"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Badge not found
  if (!badge) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <div className="bg-slate-700/50 rounded-lg p-6 inline-flex mb-6">
            <svg
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
            Badge not found
          </h3>
          <p className="text-blue-100/70 mb-6">
            The badge you're looking for might have been removed or is no longer
            available.
          </p>
          <Link
            href="/badges"
            className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-purple-500/20 transition-all duration-200 flex items-center inline-flex"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Badges
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back button */}
      <Link
        href="/badges"
        className="inline-flex items-center text-blue-400 hover:text-cyan-300 transition-colors duration-200 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to all badges
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badge Image and Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10 flex flex-col items-center p-8">
            <div className="relative">
              <div className="h-40 w-40 rounded-lg bg-gradient-to-br from-purple-600/50 to-blue-500/50 p-1 mb-6 overflow-hidden shadow-lg">
                <div className="h-full w-full rounded-md bg-slate-900/50 overflow-hidden">
                  {badge.image_url ? (
                    <img
                      src={badge.image_url}
                      alt={badge.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-purple-500/20 text-white">
                      <span className="font-bold text-5xl">
                        {badge.name ? badge.name.charAt(0) : "B"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isEarned && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-full p-2 shadow-lg shadow-purple-500/30 z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 text-white">
              {badge.name}
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-300 border border-purple-700/30 mb-4">
              {badge.category}
            </span>

            <div className="flex items-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-400"
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
              <span className="font-medium text-white">
                {badge.points} points
              </span>
            </div>

            {isEarned && earnedDate && (
              <div className="bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg p-4 w-full text-center">
                <div className="flex justify-center mb-2">
                  <svg
                    className="h-10 w-10 text-purple-400"
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
                <p className="font-medium text-white">Badge Earned!</p>
                <p className="text-sm mt-1 flex items-center justify-center">
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
                  Earned on {new Date(earnedDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Badge Details */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 overflow-hidden">
            <div className="p-6 border-b border-blue-800/30 flex items-center">
              <svg
                className="h-5 w-5 text-blue-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-white">
                Badge Details
              </h2>
            </div>
            <div className="p-6">
              <div className="prose prose-invert max-w-none text-blue-100/80">
                <p className="whitespace-pre-line">{badge.description}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  How to Earn This Badge
                </h3>
                <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-700/30">
                  <p className="text-blue-100/70">
                    Badges can be earned through various activities in our
                    community:
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-400"
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
                      <span className="text-white">
                        Attending community events and participating in
                        activities
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-400"
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
                      <span className="text-white">
                        Completing specific challenges related to this badge's
                        category
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-400"
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
                      <span className="text-white">
                        Being awarded by admins for special contributions to the
                        community
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
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
                  Related Events
                </h3>
                <div className="bg-indigo-900/20 rounded-lg p-6 border border-indigo-700/30">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="h-12 w-12 text-indigo-400/50"
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
                  <p className="text-center text-blue-100/70 mb-4">
                    Looking for events where you can earn this badge?
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href="/events"
                      className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center"
                    >
                      <svg
                        className="h-5 w-5 mr-2"
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
                      Browse Events
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Badges in Same Category */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
          <svg
            className="h-6 w-6 text-purple-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          More Badges in {badge.category}
        </h2>

        {isLoadingRelated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-800/30 rounded-xl border border-purple-700/10 p-6 flex flex-col items-center text-center animate-pulse"
              >
                <div className="h-24 w-24 rounded-lg bg-slate-700/50 mb-4"></div>
                <div className="h-5 w-2/3 bg-slate-700/50 rounded-full mb-2"></div>
                <div className="h-4 w-1/3 bg-slate-700/50 rounded-full mb-4"></div>
                <div className="h-4 w-5/6 bg-slate-700/50 rounded-full mb-1"></div>
                <div className="h-4 w-4/6 bg-slate-700/50 rounded-full mb-4"></div>
                <div className="h-4 w-2/6 bg-slate-700/50 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : relatedBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedBadges.map((relatedBadge) => (
              <Link
                href={`/badges/${relatedBadge._id}`}
                key={relatedBadge._id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 relative group"
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-purple-600/50 to-blue-500/50 p-1 mb-4 overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <div className="h-full w-full rounded-md bg-slate-900/50 overflow-hidden">
                      {relatedBadge.image_url ? (
                        <img
                          src={relatedBadge.image_url}
                          alt={relatedBadge.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-purple-500/20 text-white">
                          <span className="font-bold text-2xl">
                            {relatedBadge.name
                              ? relatedBadge.name.charAt(0)
                              : "B"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-center mb-1 text-white">
                    {relatedBadge.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700/30 mb-2">
                    {relatedBadge.category}
                  </span>
                  <p className="text-sm text-blue-100/70 text-center mb-3 line-clamp-2">
                    {relatedBadge.description}
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
                      {relatedBadge.points} points
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10">
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
              No other badges found in this category.
            </p>
            <Link
              href="/badges"
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-purple-500/20 transition-all duration-200 inline-flex items-center"
            >
              <svg
                className="h-5 w-5 mr-2"
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
              View All Badges
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
