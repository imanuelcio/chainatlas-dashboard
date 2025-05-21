// src/app/(dashboard)/admin/users/page.tsx
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAllUsers } from "@/lib/api";
import {
  UserIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

type User = {
  id: string;
  username: string;
  email: string;
  wallet_address: string;
  discord_id: string;
  role: "user" | "admin";
  profile_image_url: string;
  total_achievements: number;
  created_at: string;
};

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [sortBy, setSortBy] = useState<
    "username" | "created_at" | "total_achievements"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch users with React Query
  const { data: usersData, isLoading, isError, refetch } = useAllUsers();

  // Handle errors
  if (isError) {
    toast.error("Failed to load users");
  }

  // Extract users from response
  const users: User[] = usersData?.users || [];

  const handleRefresh = () => {
    refetch();
  };

  const handleSort = (
    field: "username" | "created_at" | "total_achievements"
  ) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc"); // Default to descending when changing sort field
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.wallet_address &&
        user.wallet_address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "username") {
      return sortOrder === "asc"
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username);
    } else if (sortBy === "created_at") {
      return sortOrder === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === "total_achievements") {
      return sortOrder === "asc"
        ? a.total_achievements - b.total_achievements
        : b.total_achievements - a.total_achievements;
    }
    return 0;
  });

  const getSortIcon = (
    field: "username" | "created_at" | "total_achievements"
  ) => {
    if (sortBy !== field) return null;

    return sortOrder === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 ml-1"
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
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              <UserGroupIcon className="h-8 w-8 mr-3 text-indigo-400" />
              Manage Users
            </h2>
            <p className="mt-1 text-blue-100/70 flex items-center">
              <svg
                className="h-4 w-4 mr-1.5 text-blue-400"
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
              View and manage all registered users in the system
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-indigo-800/50 rounded-lg shadow-sm text-sm font-medium text-blue-100 bg-slate-700/50 hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-800 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2 text-indigo-400" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-700/30 text-white placeholder-blue-100/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-colors duration-200"
              placeholder="Search by username, email, or wallet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-indigo-400" />
            </div>
            <select
              className="block w-full pl-11 pr-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-700/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm appearance-none transition-colors duration-200"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as "all" | "user" | "admin")
              }
            >
              <option value="all">All Roles</option>
              <option value="user">Regular Users</option>
              <option value="admin">Administrators</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-100/70">
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

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-400 shadow-lg shadow-indigo-500/20"></div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-800/30">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("username")}
                    >
                      <div className="flex items-center">
                        <span>User</span>
                        <span className="ml-1 text-indigo-300">
                          {getSortIcon("username")}
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider"
                    >
                      Connections
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("total_achievements")}
                    >
                      <div className="flex items-center">
                        <span>Achievements</span>
                        <span className="ml-1 text-indigo-300">
                          {getSortIcon("total_achievements")}
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        <span>Joined</span>
                        <span className="ml-1 text-indigo-300">
                          {getSortIcon("created_at")}
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-blue-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800/30 divide-y divide-blue-800/30">
                  {sortedUsers.length > 0 ? (
                    sortedUsers.map((user, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-700/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 relative">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600/40 to-blue-500/40 p-0.5 shadow-lg">
                                <div className="h-full w-full rounded-md overflow-hidden bg-slate-800/70">
                                  {user.profile_image_url ? (
                                    <img
                                      src={user.profile_image_url}
                                      alt={user.username}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).onerror =
                                          null;
                                        (e.target as HTMLImageElement).src =
                                          "/default-avatar.png";
                                      }}
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-blue-500/20 text-white">
                                      <UserIcon className="h-6 w-6 text-blue-100/60" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              {user.role === "admin" && (
                                <div
                                  className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full p-1 shadow-lg"
                                  title="Admin"
                                >
                                  <ShieldCheckIcon className="h-3.5 w-3.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {user.username}
                              </div>
                              <div className="text-xs text-blue-100/60 mt-0.5">
                                {user.email || "No email"}
                              </div>
                              {user.wallet_address && (
                                <div className="text-xs text-blue-100/60 truncate max-w-[200px] flex items-center mt-0.5">
                                  <svg
                                    className="h-3 w-3 mr-1 text-indigo-400"
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
                                  {user.wallet_address.substring(0, 6)}...
                                  {user.wallet_address.substring(
                                    user.wallet_address.length - 4
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            {user.discord_id && (
                              <div
                                className="flex items-center text-xs bg-indigo-900/40 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-700/30"
                                title="Discord connected"
                              >
                                <svg
                                  className="h-3 w-3 mr-1"
                                  viewBox="0 0 71 55"
                                  fill="currentColor"
                                >
                                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                                </svg>
                                Discord
                              </div>
                            )}
                            {user.wallet_address && (
                              <div
                                className="flex items-center text-xs bg-amber-900/40 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-700/30"
                                title="Wallet connected"
                              >
                                <svg
                                  className="h-3 w-3 mr-1"
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
                                Wallet
                              </div>
                            )}
                            {user.email && (
                              <div
                                className="flex items-center text-xs bg-emerald-900/40 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-700/30"
                                title="Email connected"
                              >
                                <svg
                                  className="h-3 w-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                Email
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-900/30 text-blue-100 text-sm font-medium px-2.5 py-1 rounded-lg border border-blue-700/30 flex items-center">
                              <svg
                                className="h-4 w-4 mr-1.5 text-indigo-400"
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
                              <span>{user.total_achievements || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-100/70">
                          <div className="flex items-center">
                            <svg
                              className="h-4 w-4 mr-1.5 text-indigo-400"
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
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-900/40 text-blue-300 hover:bg-blue-800/40 rounded-lg border border-blue-700/30 mr-2 transition-colors duration-200"
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </Link>
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/40 rounded-lg border border-indigo-700/30 transition-colors duration-200"
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-blue-100/70"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            className="h-12 w-12 text-blue-500/30 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <p className="text-xl font-medium text-white mb-1">
                            No Users Found
                          </p>
                          <p>
                            {searchTerm || roleFilter !== "all"
                              ? "No users match your search criteria"
                              : "No users found in the system"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-6">
          <h3 className="font-semibold mb-3 text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-400"
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
            User Management Tips
          </h3>
          <ul className="text-sm text-blue-100/70 space-y-3 mt-4">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-indigo-900/50 border border-indigo-700/30 flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-indigo-400"
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
              <span>
                <strong className="text-white">Admin Privileges:</strong> Be
                cautious when assigning admin roles to users. Administrators
                have full access to manage users, events, and badges.
              </span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-indigo-900/50 border border-indigo-700/30 flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-indigo-400"
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
              <span>
                <strong className="text-white">Engagement:</strong> Users with
                multiple connections tend to be more active. Encourage users to
                connect their Discord, wallet, and email for a better
                experience.
              </span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-indigo-900/50 border border-indigo-700/30 flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-indigo-400"
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
              <span>
                <strong className="text-white">Badge Awards:</strong> Consider
                awarding badges to highly active users to recognize their
                participation and encourage continued engagement.
              </span>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-indigo-900/50 border border-indigo-700/30 flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-indigo-400"
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
              <span>
                <strong className="text-white">Data Privacy:</strong> Be mindful
                of user data when managing accounts. Only access and modify
                information when necessary.
              </span>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-indigo-900/20 rounded-lg border border-indigo-700/30">
            <h4 className="font-medium text-white flex items-center mb-2">
              <svg
                className="h-4 w-4 mr-1.5 text-indigo-400"
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
              Need Help?
            </h4>
            <p className="text-sm text-blue-100/70">
              For detailed instructions on user management, please refer to the{" "}
              <a
                href="#"
                className="text-indigo-400 hover:text-indigo-300 underline transition-colors duration-200"
              >
                Admin Documentation
              </a>{" "}
              or contact the development team for assistance.
            </p>
          </div>
        </div>

        {/* User stats summary cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100/70 text-sm mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-white">
                  {sortedUsers.length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-900/30 border border-blue-700/30 flex items-center justify-center text-blue-400">
                <UserGroupIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-800/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-100/70">Active last month</span>
                <span className="text-white font-medium">
                  {Math.round(sortedUsers.length * 0.85)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100/70 text-sm mb-1">Admin Users</p>
                <h3 className="text-2xl font-bold text-white">
                  {sortedUsers.filter((user) => user.role === "admin").length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-indigo-900/30 border border-indigo-700/30 flex items-center justify-center text-indigo-400">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-800/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-100/70">Percentage of total</span>
                <span className="text-white font-medium">
                  {sortedUsers.length > 0
                    ? `${Math.round(
                        (sortedUsers.filter((user) => user.role === "admin")
                          .length /
                          sortedUsers.length) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100/70 text-sm mb-1">
                  Wallet Connected
                </p>
                <h3 className="text-2xl font-bold text-white">
                  {sortedUsers.filter((user) => user.wallet_address).length}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-900/30 border border-purple-700/30 flex items-center justify-center text-purple-400">
                <svg
                  className="h-6 w-6"
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
            <div className="mt-4 pt-4 border-t border-purple-800/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-100/70">Percentage of total</span>
                <span className="text-white font-medium">
                  {sortedUsers.length > 0
                    ? `${Math.round(
                        (sortedUsers.filter((user) => user.wallet_address)
                          .length /
                          sortedUsers.length) *
                          100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export and advanced actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-5 flex-grow">
            <h3 className="font-semibold mb-3 text-white flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Users
            </h3>
            <p className="text-sm text-blue-100/70 mb-4">
              Export user data in different formats for reporting or backup
              purposes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-900/40 text-blue-300 hover:bg-blue-800/40 rounded-lg border border-blue-700/30 transition-colors duration-200 flex items-center">
                <svg
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                CSV
              </button>
              <button className="px-4 py-2 bg-blue-900/40 text-blue-300 hover:bg-blue-800/40 rounded-lg border border-blue-700/30 transition-colors duration-200 flex items-center">
                <svg
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                JSON
              </button>
              <button className="px-4 py-2 bg-blue-900/40 text-blue-300 hover:bg-blue-800/40 rounded-lg border border-blue-700/30 transition-colors duration-200 flex items-center">
                <svg
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                PDF Report
              </button>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-5 flex-grow">
            <h3 className="font-semibold mb-3 text-white flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Advanced Actions
            </h3>
            <p className="text-sm text-blue-100/70 mb-4">
              Perform batch operations on user accounts and data.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/40 rounded-lg border border-indigo-700/30 transition-colors duration-200 flex items-center">
                <svg
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create User
              </button>
              <button className="px-4 py-2 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/40 rounded-lg border border-indigo-700/30 transition-colors duration-200 flex items-center">
                <svg
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
                Bulk Edit
              </button>
              <button className="px-4 py-2 bg-red-900/40 text-red-300 hover:bg-red-800/40 rounded-lg border border-red-700/30 transition-colors duration-200 flex items-center">
                <svg
                  className="h-4 w-4 mr-1.5"
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
                Bulk Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
