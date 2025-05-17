"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usersAPI, authAPI } from "@/lib/api";
import { UserProfile } from "@/types/user";
import toast from "react-hot-toast";
import { logout } from "@/lib/auth";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profile_image_url: "",
  });
  const [activeTab, setActiveTab] = useState<
    "profile" | "connections" | "security"
  >("profile");
  const router = useRouter();
  // Solusi 1: Ubah response handler di halaman profil
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profileResponse = await usersAPI.getUserProfile();

        // Periksa apakah respons mengandung user atau profile
        const profileData = profileResponse.profile || profileResponse.user;

        if (profileData) {
          setProfile(profileData);
          // Initialize form data with current profile values
          setFormData({
            username: profileData.username || "",
            email: profileData.email || "",
            profile_image_url: profileData.profile_image_url || "",
          });
        } else {
          throw new Error("Profile data not found in response");
        }

        console.log("Profile response:", profileResponse);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsUpdating(true);
    try {
      const response = await usersAPI.updateUserProfile(formData);
      setProfile(response.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConnect = async (platform: string) => {
    // This is a placeholder for connecting to external platforms
    // Would normally open a popup or redirect to OAuth flow
    toast.error(`${platform} connection not implemented yet.`);
  };

  const handleLogout = async () => {
    try {
      // await authAPI.logout();
      logout(); // Clear local storage and redirect
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
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account settings and connected platforms
        </p>
      </div>

      {/* Profile header */}
      <div className="rounded-lg shadow mb-8 bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile image */}
            <div className="relative h-24 w-24 rounded-full bg-blue-200 flex items-center justify-center">
              {profile.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={profile.username}
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <span className="text-blue-700 font-bold text-3xl">
                  {profile.username ? profile.username.toUpperCase() : "U"}
                </span>
              )}
            </div>

            {/* Profile info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">
                {profile.username}
                {/* cio */}
              </h2>
              <p className="text-blue-100">
                {profile.wallet_address
                  ? `${profile.wallet_address.substring(
                      0,
                      6
                    )}...${profile.wallet_address.substring(
                      profile.wallet_address.length - 4
                    )}`
                  : "No wallet connected"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="bg-blue-800 bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {profile.total_achievements} Badges
                </div>
                <div className="bg-blue-800 bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {profile.stats?.total_points || 0} Points
                </div>
                <div className="bg-blue-800 bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {profile.stats?.total_events_joined || 0} Events
                </div>
                {profile.role === "admin" && (
                  <div className="flex gap-2">
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                      Admin
                    </div>
                    <button
                      onClick={() => router.push("/admin")}
                      className="cursor-pointer bg-green-500 hover:bg-green-800 transition-colors bg-opacity-50 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => router.push("/admin/events")}
                      className="cursor-pointer bg-yellow-500 hover:bg-yellow-800 transition-colors bg-opacity-50 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Events Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account completion */}
            <div className="bg-blue-800 bg-opacity-50 rounded-lg p-4 w-full md:w-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">
                  Account Completion
                </span>
                <span className="text-white font-bold">
                  {profile.stats?.account_completion || 0}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-purple-500 rounded-full h-2"
                  style={{
                    width: `${profile.stats?.account_completion || 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-blue-100 mt-2">
                Complete your profile to earn more points
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("connections")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "connections"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Connected Platforms
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "security"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
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
                    className="block text-sm font-medium mb-1"
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
                    className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This is how you will appear to other users
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    We'll never share your email with anyone else
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="profile_image_url"
                    className="block text-sm font-medium mb-1"
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
                    className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter a URL to your profile image
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
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
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Connected Platforms Tab */}
          {activeTab === "connections" && (
            <div className="space-y-6">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Connect your accounts to unlock special features and rewards
              </p>

              {/* Wallet */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
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
                      <h3 className="font-medium">Ethereum Wallet</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {profile.wallet_address
                          ? `Connected: ${profile.wallet_address.substring(
                              0,
                              6
                            )}...${profile.wallet_address.substring(
                              profile.wallet_address.length - 4
                            )}`
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect("wallet")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      profile.wallet_address
                        ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    disabled={!!profile.wallet_address}
                  >
                    {profile.wallet_address ? "Connected" : "Connect"}
                  </button>
                </div>
              </div>

              {/* Discord */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-[#5865F2] bg-opacity-20 rounded-full flex items-center justify-center mr-4">
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
                      <h3 className="font-medium">Discord</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {profile.discord_id
                          ? "Connected"
                          : "Link your Discord account to participate in community channels"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect("discord")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      profile.discord_id
                        ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    disabled={!!profile.discord_id}
                  >
                    {profile.discord_id ? "Connected" : "Connect"}
                  </button>
                </div>
              </div>

              {/* Twitter */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-[#1DA1F2] bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-[#1DA1F2]"
                      >
                        <path
                          fill="currentColor"
                          d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.159 1.207 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Twitter</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {profile.connections?.some(
                          (c) => c.platform === "twitter"
                        )
                          ? "Connected"
                          : "Connect your Twitter account to share achievements"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect("twitter")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      profile.connections?.some((c) => c.platform === "twitter")
                        ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    disabled={profile.connections?.some(
                      (c) => c.platform === "twitter"
                    )}
                  >
                    {profile.connections?.some((c) => c.platform === "twitter")
                      ? "Connected"
                      : "Connect"}
                  </button>
                </div>
              </div>

              {/* Telegram */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-[#0088cc] bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-[#0088cc]"
                      >
                        <path
                          fill="currentColor"
                          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.37 17.754c-.38.107-.8.07-1.195-.008-.39-.078-.78-.26-1.128-.547l-2.98-2.395.787-.62 2.704 1.92c.154.12.306.163.448.132.14-.03.27-.13.38-.3l4.216-6.607-4.733 7.465c-.262.41-.566.846-1.117.96zm4.286-1.504c-.306.34-.69.577-1.13.68-.44.104-.885.078-1.302-.022-.416-.1-.814-.295-1.178-.576-.364-.28-.687-.643-.958-1.067-.57-.894-.957-1.977-1.234-3.138-.29-1.16-.467-2.394-.526-3.61-.05-1.22.02-2.414.24-3.46.11-.512.276-.986.5-1.397.21-.404.49-.742.815-.984.324-.243.695-.384 1.08-.41.385-.026.775.042 1.146.2.376.16.73.41 1.043.736l.654.73-5.95 9.313c-.107.168-.164.35-.157.538.006.19.073.37.19.518.117.153.28.266.463.33.18.057.38.066.567.02.187-.05.36-.15.503-.29.145-.143.255-.32.32-.516.066-.198.086-.413.053-.62-.033-.208-.114-.403-.233-.57l.43-.673L18.496 8.1l-3.614 5.733c-.125.197-.158.44-.086.67.073.228.243.418.47.535.228.116.498.136.75.05.253-.084.468-.26.6-.488.135-.232.182-.506.143-.77-.04-.268-.16-.514-.34-.696z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Telegram</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {profile.connections?.some(
                          (c) => c.platform === "telegram"
                        )
                          ? "Connected"
                          : "Receive notifications via Telegram"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect("telegram")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      profile.connections?.some(
                        (c) => c.platform === "telegram"
                      )
                        ? "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    disabled={profile.connections?.some(
                      (c) => c.platform === "telegram"
                    )}
                  >
                    {profile.connections?.some((c) => c.platform === "telegram")
                      ? "Connected"
                      : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Account Security</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Manage your account security settings
                </p>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                  <h4 className="font-medium mb-2">Authentication Method</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    You are currently authenticated using:
                  </p>

                  {profile.wallet_address && (
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-600 dark:text-blue-400"
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
                        <p className="font-medium">Ethereum Wallet</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {profile.wallet_address.substring(0, 6)}...
                          {profile.wallet_address.substring(
                            profile.wallet_address.length - 4
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.discord_id && (
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-[#5865F2] bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 127.14 96.36"
                          className="h-4 w-4 text-[#5865F2]"
                        >
                          <path
                            fill="currentColor"
                            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Discord</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Connected via Discord OAuth
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium mb-2">Sign Out</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Sign out from your account on this device
                </p>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
