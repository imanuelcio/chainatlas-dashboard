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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Badge not found
  if (!badge) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">Badge not found</h3>
          <p className="text-muted-foreground mb-6">
            The badge you're looking for might have been removed or is no longer
            available.
          </p>
          <Link href="/badges" className="btn btn-primary">
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
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to all badges
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badge Image and Basic Info */}
        <div className="lg:col-span-1">
          <div className="card flex flex-col items-center p-8">
            <div className="relative">
              <div className="h-40 w-40 rounded-full bg-muted overflow-hidden mb-6">
                {badge.image_url ? (
                  <img
                    src={badge.image_url}
                    alt={badge.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary-200">
                    <span className="text-primary-700 font-bold text-5xl">
                      {badge.name ? badge.name.charAt(0) : "B"}
                    </span>
                  </div>
                )}
              </div>

              {isEarned && (
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-2">
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

            <h1 className="text-2xl font-bold text-center mb-2">
              {badge.name}
            </h1>
            <span className="badge badge-outline mb-4">{badge.category}</span>

            <div className="flex items-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-secondary"
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
              <span className="font-medium">{badge.points} points</span>
            </div>

            {isEarned && earnedDate && (
              <div className="bg-primary bg-opacity-10 text-primary rounded-lg p-4 w-full text-center">
                <p className="font-medium">Badge Earned!</p>
                <p className="text-sm mt-1">
                  Earned on {new Date(earnedDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Badge Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Badge Details</h2>
            </div>
            <div className="card-content">
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-line">{badge.description}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  How to Earn This Badge
                </h3>
                <div className="bg-muted rounded-lg p-6">
                  <p className="text-muted-foreground">
                    Badges can be earned through various activities in our
                    community:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5"
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
                      <span>
                        Attending community events and participating in
                        activities
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5"
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
                      <span>
                        Completing specific challenges related to this badge's
                        category
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5"
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
                      <span>
                        Being awarded by admins for special contributions to the
                        community
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Related Events</h3>
                <div className="bg-muted rounded-lg p-6">
                  <p className="text-center text-muted-foreground">
                    Looking for events where you can earn this badge?
                  </p>
                  <div className="flex justify-center mt-4">
                    <Link href="/events" className="btn btn-primary">
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
        <h2 className="text-2xl font-bold mb-6">
          More Badges in {badge.category}
        </h2>

        {isLoadingRelated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card p-6 flex flex-col items-center text-center animate-pulse"
              >
                <div className="h-24 w-24 rounded-full bg-muted mb-4"></div>
                <div className="h-5 w-2/3 bg-muted rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-muted rounded mb-4"></div>
                <div className="h-4 w-5/6 bg-muted rounded mb-1"></div>
                <div className="h-4 w-4/6 bg-muted rounded mb-4"></div>
                <div className="h-4 w-2/6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : relatedBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedBadges.map((relatedBadge) => (
              <Link
                href={`/badges/${relatedBadge._id}`}
                key={relatedBadge._id}
                className="card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-muted overflow-hidden mb-4">
                    {relatedBadge.image_url ? (
                      <img
                        src={relatedBadge.image_url}
                        alt={relatedBadge.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary-200">
                        <span className="text-primary-700 font-bold text-2xl">
                          {relatedBadge.name
                            ? relatedBadge.name.charAt(0)
                            : "B"}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-center mb-1">
                    {relatedBadge.name}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-3 line-clamp-2">
                    {relatedBadge.description}
                  </p>
                  <div className="flex items-center mt-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-secondary"
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
                      {relatedBadge.points} points
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              No other badges found in this category.
            </p>
            <Link href="/badges" className="btn btn-primary mt-4">
              View All Badges
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
