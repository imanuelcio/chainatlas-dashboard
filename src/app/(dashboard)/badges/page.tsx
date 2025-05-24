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
                  className="group relative block"
                >
                  {/* Animated background glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                  {/* Main card */}
                  <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1">
                    {/* Shine effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    {/* Earned indicator with pulse animation */}
                    {isEarned && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40"></div>
                          <div className="relative bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900 rounded-full p-2 shadow-lg shadow-emerald-500/40">
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative p-8">
                      {/* Badge image container with enhanced styling */}
                      <div className="relative mx-auto mb-6 w-32 h-32">
                        {/* Rotating border gradient */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-0.5 animate-spin-slow">
                          <div className="h-full w-full rounded-2xl bg-slate-900"></div>
                        </div>

                        {/* Inner image container */}
                        <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-sm overflow-hidden group-hover:scale-110 transition-transform duration-500">
                          {badge.image_url ? (
                            <img
                              src={badge.image_url}
                              alt={badge.name}
                              className="h-full w-full object-cover transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-white">
                              <span className="font-black text-4xl bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                                {badge.name ? badge.name.charAt(0) : "B"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Badge name with gradient text */}
                      <h3 className="text-xl font-black text-center mb-3 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent leading-tight">
                        {badge.name}
                      </h3>

                      {/* Category tag with glassmorphism */}
                      <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/10 backdrop-blur-md text-purple-200 border border-white/20 shadow-lg shadow-purple-500/10">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2 animate-pulse"></div>
                          {badge.category}
                        </span>
                      </div>

                      {/* Description with better typography */}
                      <p className="text-sm text-slate-300 text-center mb-6 leading-relaxed line-clamp-3 font-medium">
                        {badge.description}
                      </p>

                      {/* Points display with enhanced styling */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border border-yellow-500/30">
                          <div className="relative mr-2">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
                            <svg
                              className="relative h-5 w-5 text-yellow-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-base font-bold bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">
                            {badge.points} points
                          </span>
                        </div>
                      </div>

                      {/* Earned date with improved styling */}
                      {isEarned && userBadge && (
                        <div className="flex items-center justify-center">
                          <div className="flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-300">
                            <svg
                              className="h-4 w-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-xs font-medium">
                              Earned{" "}
                              {userBadge.earned_at
                                ? new Date(
                                    userBadge.earned_at
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "Unknown"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom gradient accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              className="group relative block"
            >
              {/* Animated background glow with enhanced earned badge effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-purple-600 to-gold-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-tilt-earned"></div>

              {/* Main card */}
              <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-emerald-400/20 overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:-rotate-1 shadow-xl shadow-emerald-500/10">
                {/* Premium shine effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 left-4 w-1 h-1 bg-emerald-400 rounded-full animate-float-1 opacity-60"></div>
                  <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-gold-400 rounded-full animate-float-2 opacity-70"></div>
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full animate-float-3 opacity-50"></div>
                </div>

                {userBadge.badge_id && (
                  <div className="relative p-8">
                    {/* Enhanced earned indicator with crown effect */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="relative">
                        {/* Multiple pulsing rings */}
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
                        <div className="absolute inset-1 bg-gold-400 rounded-full animate-ping opacity-20 animation-delay-300"></div>

                        {/* Main earned badge */}
                        <div className="relative bg-gradient-to-r from-emerald-400 via-gold-400 to-emerald-400 text-slate-900 rounded-full p-2.5 shadow-lg shadow-emerald-500/50 border-2 border-white/20">
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>

                        {/* Crown decoration */}
                        <div className="absolute -top-2 -right-1 text-gold-400 animate-bounce">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced badge image container */}
                    <div className="relative mx-auto mb-6 w-36 h-36">
                      {/* Multi-layered rotating borders */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 via-gold-400 to-purple-500 p-0.5 animate-spin-slow">
                        <div className="h-full w-full rounded-2xl bg-slate-900"></div>
                      </div>
                      <div className="absolute inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 p-0.5 animate-spin-reverse">
                        <div className="h-full w-full rounded-2xl bg-slate-900"></div>
                      </div>

                      {/* Inner image container with enhanced glow */}
                      <div className="absolute inset-3 rounded-xl bg-gradient-to-br from-emerald-600/30 via-gold-600/20 to-purple-600/30 backdrop-blur-sm overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-inner shadow-emerald-500/20">
                        {userBadge.badge_id.image_url ? (
                          <img
                            src={userBadge.badge_id.image_url}
                            alt={userBadge.badge_id.name}
                            className="h-full w-full object-cover transition-all duration-500 group-hover:brightness-125 group-hover:contrast-110 group-hover:saturate-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-emerald-500/40 to-gold-500/40 text-white">
                            <span className="font-black text-5xl bg-gradient-to-r from-emerald-200 via-gold-200 to-white bg-clip-text text-transparent drop-shadow-lg">
                              {userBadge.badge_id.name
                                ? userBadge.badge_id.name.charAt(0)
                                : "B"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Sparkle effects */}
                      <div className="absolute top-2 left-2 w-2 h-2 bg-gold-300 rounded-full animate-sparkle opacity-70"></div>
                      <div className="absolute bottom-3 right-2 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-sparkle-delayed opacity-60"></div>
                    </div>

                    {/* Enhanced badge name with premium styling */}
                    <div className="relative mb-4">
                      <h3 className="text-2xl font-black text-center bg-gradient-to-r from-emerald-200 via-gold-200 to-emerald-200 bg-clip-text text-transparent leading-tight drop-shadow-sm">
                        {userBadge.badge_id.name}
                      </h3>
                      {/* Underline accent */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
                    </div>

                    {/* Premium category tag */}
                    <div className="flex justify-center mb-4">
                      <span className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-500/20 to-gold-500/20 backdrop-blur-md text-emerald-200 border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-300 to-gold-300 rounded-full mr-3 animate-pulse-glow"></div>
                        EARNED • {userBadge.badge_id.category}
                      </span>
                    </div>

                    {/* Enhanced description */}
                    <p className="text-sm text-slate-200 text-center mb-6 leading-relaxed line-clamp-3 font-medium px-2">
                      {userBadge.badge_id.description}
                    </p>

                    {/* Premium points display */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-gold-500/30 to-yellow-500/30 backdrop-blur-sm border border-gold-400/40 shadow-lg shadow-gold-500/20">
                        <div className="relative mr-3">
                          <div className="absolute inset-0 bg-gold-300 rounded-full animate-ping opacity-40"></div>
                          <div className="absolute inset-0.5 bg-yellow-300 rounded-full animate-ping opacity-30 animation-delay-200"></div>
                          <svg
                            className="relative h-6 w-6 text-gold-200"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-lg font-black bg-gradient-to-r from-gold-100 to-yellow-100 bg-clip-text text-transparent">
                          {userBadge.badge_id.points} POINTS
                        </span>
                      </div>
                    </div>

                    {/* Premium earned date display */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 backdrop-blur-sm border border-emerald-400/25 text-emerald-200 shadow-lg shadow-emerald-500/10">
                        <div className="relative mr-2">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <div className="absolute inset-0 bg-emerald-300 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <span className="text-sm font-semibold">
                          🏆 Earned{" "}
                          {userBadge.earned_at
                            ? new Date(userBadge.earned_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Premium bottom accent with animated gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-gold-400 to-emerald-400 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-slide"></div>
                </div>
              </div>
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
