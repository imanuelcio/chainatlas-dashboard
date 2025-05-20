"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAllUsers, useAllBadges, usePublishedEvents } from "@/lib/api";
import { User } from "@/types/user";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  // Fetch users data with React Query
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useAllUsers();

  // Fetch events data with React Query
  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = usePublishedEvents({ limit: 100 }); // Get all events for counting

  // Fetch badges data with React Query
  const {
    data: badgesData,
    isLoading: isLoadingBadges,
    isError: isErrorBadges,
  } = useAllBadges();

  // Extract data from responses
  const users: User[] = usersData?.users || [];
  const totalEvents = eventsData?.events?.length || 0;
  const totalBadges = badgesData?.badges?.length || 0;

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user) => user.total_achievements > 0
  ).length;

  const stats = {
    totalUsers,
    totalEvents,
    totalBadges,
    activeUsers,
  };

  // Handle errors
  if (isErrorUsers || isErrorEvents || isErrorBadges) {
    toast.error("Failed to load admin dashboard data");
  }

  // Overall loading state
  const isLoading = isLoadingUsers || isLoadingEvents || isLoadingBadges;

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white flex items-center">
          <svg
            className="h-8 w-8 text-blue-400 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Admin Dashboard
        </h1>
        <p className="text-blue-100/70 text-base">
          Manage your community, events, and badges
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-slate-800 to-blue-900/30 rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-6 transition-transform duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {stats.totalUsers}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/users"
              className="text-sm text-blue-400 hover:text-cyan-300 inline-flex items-center transition-colors duration-200"
            >
              Manage users
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

        {/* Active Users */}
        <div className="bg-gradient-to-br from-slate-800 to-green-900/30 rounded-xl border border-green-700/20 shadow-lg shadow-green-900/10 p-6 transition-transform duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Active Users</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {stats.activeUsers}
              </h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="h-2 flex-grow bg-slate-700/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                style={{
                  width: `${
                    totalUsers > 0
                      ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <span className="text-sm text-green-300 ml-3 font-medium">
              {totalUsers > 0
                ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
                : 0}
              %
            </span>
          </div>
        </div>

        {/* Total Events */}
        <div className="bg-gradient-to-br from-slate-800 to-blue-900/30 rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-6 transition-transform duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Events</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {stats.totalEvents}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/events"
              className="text-sm text-blue-400 hover:text-cyan-300 inline-flex items-center transition-colors duration-200"
            >
              Manage events
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

        {/* Total Badges */}
        <div className="bg-gradient-to-br from-slate-800 to-yellow-900/30 rounded-xl border border-yellow-700/20 shadow-lg shadow-yellow-900/10 p-6 transition-transform duration-300 hover:transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-300 text-sm font-medium">
                Total Badges
              </p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {stats.totalBadges}
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/badges"
              className="text-sm text-yellow-400 hover:text-yellow-300 inline-flex items-center transition-colors duration-200"
            >
              Manage badges
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

      {/* Quick actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 mb-8">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/events/new"
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-blue-700/20 flex items-center justify-center space-x-2 transition-all duration-200"
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Create Event</span>
          </Link>
          <Link
            href="/admin/badges/new"
            className="px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-cyan-700/20 flex items-center justify-center space-x-2 transition-all duration-200"
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Create Badge</span>
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-3 border border-blue-800/40 text-blue-300 rounded-lg text-center bg-blue-900/20 hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 flex items-center justify-center space-x-2"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Recent users */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10">
        <div className="p-6 border-b border-blue-800/30 flex items-center justify-between">
          <div className="flex items-center">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-white">Recent Users</h2>
          </div>
          <Link
            href="/admin/users"
            className="text-sm text-blue-400 hover:text-cyan-300 inline-flex items-center transition-colors duration-200"
          >
            View all users
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-800/30 bg-slate-800/80">
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Badges
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-800/20">
              {users.slice(0, 5).map((user, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/30"
                  } hover:bg-blue-900/20 transition-colors duration-150`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600/50 to-cyan-500/50 overflow-hidden mr-3 shadow-md">
                        {user.profile_image_url ? (
                          <img
                            src={user.profile_image_url}
                            alt={user.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-blue-500/20 text-white font-bold">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user.username}
                        </div>
                        <div className="text-sm text-blue-100/60">
                          {user.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {user.wallet_address ? (
                      <div className="flex items-center">
                        <span className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-md font-mono text-xs">
                          {user.wallet_address.substring(0, 6)}...
                          {user.wallet_address.substring(
                            user.wallet_address.length - 4
                          )}
                        </span>
                        <button className="ml-2 text-blue-400 hover:text-blue-300 transition-colors duration-200">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-md text-xs">
                        Not connected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin"
                          ? "bg-cyan-900/50 text-cyan-300 border border-cyan-500/30"
                          : "bg-slate-700/50 text-slate-300 border border-slate-600/30"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
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
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="text-white font-medium">
                        {user.total_achievements}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-100/70">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link
                        href={`/admin/users/${user.id}`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
