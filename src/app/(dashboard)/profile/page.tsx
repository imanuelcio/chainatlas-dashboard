"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  useUserProfile,
  useUpdateUserProfile,
  useConnectPlatform,
  useLogout,
} from "@/lib/api";
import { UserProfile } from "@/types/user";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profile_image_url: "",
  });
  const [activeTab, setActiveTab] = useState<
    "profile" | "connections" | "security"
  >("profile");
  const router = useRouter();

  // Use React Query hooks
  const { data: profileData, isLoading } = useUserProfile();

  const updateProfileMutation = useUpdateUserProfile();
  const connectPlatformMutation = useConnectPlatform();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (profileData) {
      // Extract profile data from the response
      const userData = profileData.profile || profileData.user;

      if (userData) {
        setProfile(userData);
        // Initialize form data with current profile values
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
          profile_image_url: userData.profile_image_url || "",
        });
      }
    }
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await updateProfileMutation.mutateAsync(formData);
      setProfile(response.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      await connectPlatformMutation.mutateAsync({ platform });
      toast.success(`Connected to ${platform} successfully`);
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast.error(`${platform} connection not implemented yet.`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Redirect to login page after successful logout
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">Profile not found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Unable to load your profile. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh
          </button>
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
          Profile Settings
        </h1>
        <p className="text-blue-100/70">
          Manage your account settings and connected platforms
        </p>
      </div>

      {/* Profile header */}
      <div className="rounded-xl shadow-lg mb-8 bg-gradient-to-r from-slate-800/70 to-slate-900/70 overflow-hidden border border-blue-700/20 backdrop-blur-sm">
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="p-8 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile image */}
              <div className="relative">
                <div className="h-28 w-28 rounded-xl bg-gradient-to-br from-blue-600/50 to-indigo-500/50 p-1 shadow-lg">
                  <div className="h-full w-full rounded-lg overflow-hidden bg-slate-900/50">
                    {profile.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt={profile.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-500/20 text-white">
                        <span className="font-bold text-4xl">
                          {profile.username
                            ? profile.username.charAt(0).toUpperCase()
                            : "U"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit profile image button */}
                <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200">
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>

              {/* Profile info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {profile.username}
                </h2>
                <div className="flex items-center justify-center md:justify-start mt-1 text-blue-300">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <p>
                    {profile.wallet_address
                      ? `${profile.wallet_address.substring(
                          0,
                          6
                        )}...${profile.wallet_address.substring(
                          profile.wallet_address.length - 4
                        )}`
                      : "No wallet connected"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <div className="bg-indigo-900/40 text-indigo-300 px-3 py-1 rounded-lg text-sm border border-indigo-700/30 flex items-center">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    {profile.total_achievements} Badges
                  </div>
                  <div className="bg-indigo-900/40 text-indigo-300 px-3 py-1 rounded-lg text-sm border border-indigo-700/30 flex items-center">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {profile.stats?.total_points || 0} Points
                  </div>
                  <div className="bg-indigo-900/40 text-indigo-300 px-3 py-1 rounded-lg text-sm border border-indigo-700/30 flex items-center">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {profile.stats?.total_events_joined || 0} Events
                  </div>
                  {profile.role === "admin" && (
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded-lg text-sm border border-purple-700/30 flex items-center">
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
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Admin
                      </div>
                      <button
                        onClick={() => router.push("/admin")}
                        className="cursor-pointer bg-gradient-to-r from-green-600/70 to-green-500/70 hover:from-green-700/70 hover:to-green-600/70 text-white px-3 py-1 rounded-lg text-sm border border-green-500/30 shadow-sm shadow-green-500/10 transition-all duration-200 flex items-center"
                      >
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
                        Admin Dashboard
                      </button>
                      <button
                        onClick={() => router.push("/admin/events")}
                        className="cursor-pointer bg-gradient-to-r from-amber-600/70 to-amber-500/70 hover:from-amber-700/70 hover:to-amber-600/70 text-white px-3 py-1 rounded-lg text-sm border border-amber-500/30 shadow-sm shadow-amber-500/10 transition-all duration-200 flex items-center"
                      >
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Events Dashboard
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Account completion */}
              <div className="w-full md:max-w-xs bg-slate-800/60 rounded-lg p-5 border border-blue-800/30 shadow-inner shadow-blue-900/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium flex items-center">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Account Completion
                  </span>
                  <span className="text-white font-bold">
                    {profile.stats?.account_completion || 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-700/70 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (profile.stats?.account_completion || 0) < 50
                        ? "bg-gradient-to-r from-red-500 to-orange-400"
                        : (profile.stats?.account_completion || 0) < 80
                        ? "bg-gradient-to-r from-orange-400 to-yellow-300"
                        : "bg-gradient-to-r from-green-500 to-emerald-400"
                    }`}
                    style={{
                      width: `${profile.stats?.account_completion || 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-blue-100/70 mt-2 flex items-center">
                  <svg
                    className="h-3 w-3 mr-1 text-blue-300"
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
                  Complete your profile to earn more points
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 overflow-hidden">
        <div className="border-b border-blue-900/30">
          <nav className="flex flex-wrap">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 font-medium text-sm flex items-center transition-colors duration-200 ${
                activeTab === "profile"
                  ? "border-b-2 border-indigo-500 text-indigo-400 bg-indigo-900/10"
                  : "text-blue-100/70 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <svg
                className={`h-4 w-4 mr-2 ${
                  activeTab === "profile" ? "text-indigo-400" : "text-blue-400"
                }`}
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
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("connections")}
              className={`py-4 px-6 font-medium text-sm flex items-center transition-colors duration-200 ${
                activeTab === "connections"
                  ? "border-b-2 border-indigo-500 text-indigo-400 bg-indigo-900/10"
                  : "text-blue-100/70 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <svg
                className={`h-4 w-4 mr-2 ${
                  activeTab === "connections"
                    ? "text-indigo-400"
                    : "text-blue-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Connected Platforms
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-6 font-medium text-sm flex items-center transition-colors duration-200 ${
                activeTab === "security"
                  ? "border-b-2 border-indigo-500 text-indigo-400 bg-indigo-900/10"
                  : "text-blue-100/70 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <svg
                className={`h-4 w-4 mr-2 ${
                  activeTab === "security" ? "text-indigo-400" : "text-blue-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Security
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    Username
                  </label>
                  <input
                    disabled
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full max-w-md px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-700/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    required
                  />
                  <p className="text-xs text-blue-100/60 mt-1.5 flex items-center">
                    <svg
                      className="h-3 w-3 mr-1 text-blue-400"
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
                    This is how you will appear to other users
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full max-w-md px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-700/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                  <p className="text-xs text-blue-100/60 mt-1.5 flex items-center">
                    <svg
                      className="h-3 w-3 mr-1 text-blue-400"
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
                    We'll never share your email with anyone else
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="profile_image_url"
                    className="block text-sm font-medium mb-1 text-blue-100"
                  >
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    disabled
                    id="profile_image_url"
                    name="profile_image_url"
                    value={formData.profile_image_url}
                    onChange={handleInputChange}
                    className="w-full max-w-md px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-700/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-blue-100/60 mt-1.5 flex items-center">
                    <svg
                      className="h-3 w-3 mr-1 text-blue-400"
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
                    Enter a URL to your profile image
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-5 py-2.5 disabled:bg-slate-600 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center"
                    disabled
                  >
                    {updateProfileMutation.isPending ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Connected Platforms Tab */}
          {activeTab === "connections" && (
            <div className="space-y-6">
              <p className="text-blue-100/70 mb-4 flex items-start">
                <svg
                  className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5"
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
                <span>
                  Connect your accounts to unlock special features and rewards
                </span>
              </p>

              {/* Wallet */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 shadow-md overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-blue-900/30 border border-blue-700/30 flex items-center justify-center mr-4 shadow-inner shadow-blue-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-400"
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
                    <div>
                      <h3 className="font-medium text-white">
                        Ethereum Wallet
                      </h3>
                      <p className="text-sm text-blue-100/70">
                        {profile.wallet_address
                          ? `Connected: ${profile.wallet_address.substring(
                              0,
                              6
                            )}...${profile.wallet_address.substring(
                              profile.wallet_address.length - 4
                            )}`
                          : "Connect your wallet to authenticate and earn badges"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect("wallet")}
                    className={`${
                      profile.wallet_address
                        ? "border border-slate-600/50 bg-slate-700/50 text-blue-100/80 hover:bg-slate-600/50"
                        : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white shadow-lg shadow-blue-500/20"
                    } px-4 py-2 text-sm rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 flex items-center justify-center min-w-[100px]`}
                    disabled={
                      !!profile.wallet_address ||
                      connectPlatformMutation.isPending
                    }
                  >
                    {profile.wallet_address ? (
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1.5 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Connected
                      </div>
                    ) : (
                      <div className="flex items-center">
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        Connect
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Discord */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 shadow-md overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center mr-4 shadow-inner shadow-[#5865F2]/10">
                      <Image
                        src="/icons/discord.svg"
                        alt="Discord"
                        width={28}
                        height={28}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Discord</h3>
                      <p className="text-sm text-blue-100/70">
                        {profile.discord_id
                          ? "Connected to Discord account"
                          : "Link your Discord account to participate in community channels"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect("discord")}
                    className={`${
                      profile.discord_id
                        ? "border border-slate-600/50 bg-slate-700/50 text-blue-100/80 hover:bg-slate-600/50"
                        : "bg-gradient-to-r from-[#5865F2] to-[#5865F2]/80 hover:from-[#5865F2]/90 hover:to-[#5865F2]/70 text-white shadow-lg shadow-[#5865F2]/20"
                    } px-4 py-2 text-sm rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 flex items-center justify-center min-w-[100px]`}
                    disabled={
                      !!profile.discord_id || connectPlatformMutation.isPending
                    }
                  >
                    {profile.discord_id ? (
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1.5 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Connected
                      </div>
                    ) : (
                      <div className="flex items-center">
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        Connect
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Twitter */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 shadow-md overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 flex items-center justify-center mr-4 shadow-inner shadow-[#1DA1F2]/10">
                      <Image
                        src="/icons/twitter.svg"
                        alt="Twitter"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Twitter</h3>
                      <p className="text-sm text-blue-100/70">
                        {profile.connections?.some(
                          (c) => c.platform === "twitter"
                        )
                          ? "Connected to Twitter account"
                          : "Connect your Twitter account to share achievements"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect("twitter")}
                    className={`${
                      profile.connections?.some((c) => c.platform === "twitter")
                        ? "border border-slate-600/50 bg-slate-700/50 text-blue-100/80 hover:bg-slate-600/50"
                        : "bg-gradient-to-r from-[#1DA1F2] to-[#1DA1F2]/80 hover:from-[#1DA1F2]/90 hover:to-[#1DA1F2]/70 text-white shadow-lg shadow-[#1DA1F2]/20"
                    } px-4 py-2 text-sm rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 flex items-center justify-center min-w-[100px]`}
                    disabled={
                      profile.connections?.some(
                        (c) => c.platform === "twitter"
                      ) || connectPlatformMutation.isPending
                    }
                  >
                    {profile.connections?.some(
                      (c) => c.platform === "twitter"
                    ) ? (
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1.5 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Connected
                      </div>
                    ) : (
                      <div className="flex items-center">
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        Connect
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Telegram */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 shadow-md overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-[#0088cc]/10 border border-[#0088cc]/30 flex items-center justify-center mr-4 shadow-inner shadow-[#0088cc]/10">
                      <Image
                        src="/icons/telegram.svg"
                        alt="Telegram"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Telegram</h3>
                      <p className="text-sm text-blue-100/70">
                        {profile.connections?.some(
                          (c) => c.platform === "telegram"
                        )
                          ? "Connected to Telegram account"
                          : "Receive notifications via Telegram"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect("telegram")}
                    className={`${
                      profile.connections?.some(
                        (c) => c.platform === "telegram"
                      )
                        ? "border border-slate-600/50 bg-slate-700/50 text-blue-100/80 hover:bg-slate-600/50"
                        : "bg-gradient-to-r from-[#0088cc] to-[#0088cc]/80 hover:from-[#0088cc]/90 hover:to-[#0088cc]/70 text-white shadow-lg shadow-[#0088cc]/20"
                    } px-4 py-2 text-sm rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#0088cc] focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 flex items-center justify-center min-w-[100px]`}
                    disabled={
                      profile.connections?.some(
                        (c) => c.platform === "telegram"
                      ) || connectPlatformMutation.isPending
                    }
                  >
                    {profile.connections?.some(
                      (c) => c.platform === "telegram"
                    ) ? (
                      <div className="flex items-center">
                        <svg
                          className="h-4 w-4 mr-1.5 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Connected
                      </div>
                    ) : (
                      <div className="flex items-center">
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        Connect
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Connection benefits card */}
              <div className="mt-8 p-5 bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-xl border border-indigo-700/20 shadow-lg">
                <h3 className="text-lg font-medium mb-3 text-white flex items-center">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Benefits of Connecting
                </h3>
                <ul className="space-y-3 text-blue-100/80">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-green-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      Earn special badges for connecting multiple platforms
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-green-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Receive notifications about events and rewards</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-green-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      Share your achievements with your social networks
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-green-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Access to platform-specific exclusive content</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-white flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-blue-400"
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
                  Account Security
                </h3>
                <p className="text-blue-100/70 mb-4 flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5"
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
                  <span>Manage your account security settings</span>
                </p>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 shadow-md p-6 mb-6">
                  <h4 className="font-medium mb-3 text-white flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Authentication Method
                  </h4>
                  <p className="text-sm text-blue-100/70 mb-4">
                    You are currently authenticated using:
                  </p>

                  {profile.wallet_address && (
                    <div className="flex items-center mb-4 bg-blue-900/20 rounded-lg p-3 border border-blue-700/20">
                      <div className="h-10 w-10 rounded-lg bg-blue-900/30 border border-blue-700/30 flex items-center justify-center mr-3 shadow-inner shadow-blue-500/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-400"
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
                      <div>
                        <p className="font-medium text-white">
                          Ethereum Wallet
                        </p>
                        <p className="text-xs text-blue-100/70 flex items-center">
                          <svg
                            className="h-3 w-3 mr-1 text-blue-300"
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
                          {profile.wallet_address.substring(0, 6)}...
                          {profile.wallet_address.substring(
                            profile.wallet_address.length - 4
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.discord_id && (
                    <div className="flex items-center bg-[#5865F2]/10 rounded-lg p-3 border border-[#5865F2]/20">
                      <div className="h-10 w-10 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/30 flex items-center justify-center mr-3 shadow-inner shadow-[#5865F2]/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 127.14 96.36"
                          className="h-5 w-5 text-[#5865F2]"
                        >
                          <path
                            fill="currentColor"
                            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-white">Discord</p>
                        <p className="text-xs text-blue-100/70 flex items-center">
                          <svg
                            className="h-3 w-3 mr-1 text-blue-300"
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
                          Connected via Discord OAuth
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security features */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-800/20 shadow-md p-6">
                  <h4 className="font-medium mb-3 text-white flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Security Features
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-3 text-blue-400"
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
                          <p className="font-medium text-white">
                            Login Notifications
                          </p>
                          <p className="text-xs text-blue-100/70">
                            Receive alerts when your account is accessed
                          </p>
                        </div>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle">
                        <input
                          type="checkbox"
                          id="toggle-login-notifications"
                          className="opacity-0 absolute h-0 w-0"
                          defaultChecked={true}
                        />
                        <label
                          htmlFor="toggle-login-notifications"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer border border-slate-600/50 shadow-inner"
                        >
                          <span className="block h-6 w-6 rounded-full bg-indigo-600 shadow transform transition-transform duration-200 ease-in-out translate-x-4"></span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-3 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-white">
                            Two-Factor Authentication
                          </p>
                          <p className="text-xs text-blue-100/70">
                            Add an extra layer of security (Coming soon)
                          </p>
                        </div>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle">
                        <input
                          type="checkbox"
                          id="toggle-2fa"
                          className="opacity-0 absolute h-0 w-0"
                          disabled
                        />
                        <label
                          htmlFor="toggle-2fa"
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-700 cursor-not-allowed border border-slate-600/50 shadow-inner"
                        >
                          <span className="block h-6 w-6 rounded-full bg-slate-600 shadow transform transition-transform duration-200 ease-in-out"></span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-3 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                          />
                        </svg>
                        <div>
                          <p className="font-medium text-white">
                            Authorized Devices
                          </p>
                          <p className="text-xs text-blue-100/70">
                            Manage devices that can access your account
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 rounded-lg bg-slate-700/50 text-blue-300 text-sm border border-slate-600/50 hover:bg-slate-600/50 transition-colors duration-200 shadow-sm">
                        View Devices
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-blue-800/30 pt-6">
                <h3 className="text-lg font-medium mb-2 text-white flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </h3>
                <p className="text-blue-100/70 mb-4 flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5"
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
                  <span>Sign out from your account on this device</span>
                </p>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-red-800/20 shadow-md p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-white mb-1">
                        End Your Current Session
                      </h4>
                      <p className="text-sm text-blue-100/70">
                        You'll need to log in again after signing out
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="px-4 py-2.5 bg-gradient-to-r from-red-600/90 to-red-500/90 hover:from-red-700/90 hover:to-red-600/90 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-red-500/20 transition-all duration-200 flex items-center justify-center"
                    >
                      {logoutMutation.isPending ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Signing Out...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Best Practices */}
              <div className="mt-8 p-5 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/20 shadow-lg">
                <h3 className="text-lg font-medium mb-3 text-white flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-blue-400"
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
                  Security Best Practices
                </h3>
                <ul className="space-y-3 text-blue-100/80">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5"
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
                    <span>
                      Never share your private keys or seed phrases with anyone
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5"
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
                    <span>
                      Always verify you're on the correct website before
                      connecting your wallet
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5"
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
                    <span>
                      Be cautious of phishing attempts through messages or
                      emails
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5"
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
                    <span>
                      Consider using a hardware wallet for additional security
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
