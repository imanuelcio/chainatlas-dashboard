// src/app/(dashboard)/admin/users/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  useAllUsers,
  useUserBadges,
  useUserEvents,
  useUserStats,
  useUpdateUserProfile,
  useAwardBadgeToUser,
} from "@/lib/api";
import {
  UserIcon,
  ArrowLeftIcon,
  TrophyIcon,
  CalendarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  AtSymbolIcon,
  WalletIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  FireIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

type User = {
  _id: string;
  username: string;
  email: string;
  wallet_address: string;
  discord_id: string;
  role: "user" | "admin";
  profile_image_url: string;
  total_achievements: number;
  created_at: string;
  updated_at: string;
};

type UserBadge = {
  _id: string;
  badge_id: {
    _id: string;
    name: string;
    description: string;
    image_url: string;
    category: string;
    points: number;
  };
  earned_at: string;
};

type UserEvent = {
  _id: string;
  event_id: {
    _id: string;
    title: string;
    image_url: string;
    event_type: string;
    start_time: string;
  };
  registration_date: string;
  attended: boolean;
};

type UserStats = {
  total_points: number;
  total_events_joined: number;
  total_events_attended: number;
};

export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id;

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profile_image_url: "",
    role: "user" as "user" | "admin",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch user data with React Query
  const { data: usersData, isLoading: isLoadingUsers } = useAllUsers();
  const { data: badgesData } = useUserBadges();
  const { data: eventsData } = useUserEvents();
  const { data: statsData } = useUserStats();

  // Update user mutation
  const updateUserMutation = useUpdateUserProfile();

  useEffect(() => {
    if (usersData?.users && userId) {
      const foundUser = usersData.users.find((u: User) => u._id === userId);

      if (foundUser) {
        setUser(foundUser);
        setFormData({
          username: foundUser.username,
          email: foundUser.email || "",
          profile_image_url: foundUser.profile_image_url || "",
          role: foundUser.role,
        });
      } else {
        toast.error("User not found");
        router.push("/admin/users");
      }
    }
  }, [usersData, userId, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.profile_image_url &&
      !/^https?:\/\/.+/.test(formData.profile_image_url)
    ) {
      newErrors.profile_image_url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Use the mutation to update user profile
      await updateUserMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        profile_image_url: formData.profile_image_url,
        role: formData.role,
      });

      // Update the user state with the new data
      if (user) {
        setUser({
          ...user,
          ...formData,
        });
      }

      toast.success("User updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data to original user data if canceling edit
      if (user) {
        setFormData({
          username: user.username,
          email: user.email || "",
          profile_image_url: user.profile_image_url || "",
          role: user.role,
        });
      }
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  // Get user badges from the badgesData
  const userBadges: UserBadge[] = badgesData?.badges || [];

  // Get user events from the eventsData
  const userEvents: UserEvent[] = eventsData?.events || [];

  // Get user stats from the statsData
  const userStats: UserStats | null = statsData?.stats || null;

  if (isLoadingUsers) {
    return (
      <DashboardLayout>
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/users"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Users
          </Link>
        </div>

        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              {user?.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={user.username}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
              ) : (
                <UserIcon className="h-12 w-12 bg-blue-500 p-2 rounded-full text-white mr-4" />
              )}
              {user?.username || "User Details"}
              {user?.role === "admin" && (
                <ShieldCheckIcon
                  className="h-6 w-6 ml-2 text-blue-500"
                  title="Admin"
                />
              )}
            </h2>
            <p className="mt-1 text-sm text-gray-500">User ID: {user?._id}</p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={toggleEditMode}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel Edit
                </>
              ) : (
                <>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit User
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main User Info Card */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                User Information
              </h3>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Username*
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.username
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="profile_image_url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Profile Image URL
                    </label>
                    <input
                      type="url"
                      id="profile_image_url"
                      name="profile_image_url"
                      value={formData.profile_image_url}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        errors.profile_image_url
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.profile_image_url && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.profile_image_url}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateUserMutation.isPending}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {updateUserMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Username
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {user?.username}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Role
                    </h4>
                    <div className="flex items-center">
                      {user?.role === "admin" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          <ShieldCheckIcon className="h-3 w-3 mr-1" />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          <UserIcon className="h-3 w-3 mr-1" />
                          Regular User
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Email
                    </h4>
                    <div className="flex items-center">
                      {user?.email ? (
                        <p className="text-gray-900 dark:text-white flex items-center">
                          <AtSymbolIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                          {user.email}
                        </p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          No email provided
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Wallet Address
                    </h4>
                    <div className="flex items-center">
                      {user?.wallet_address ? (
                        <p className="text-gray-900 dark:text-white flex items-center">
                          <WalletIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                          <span
                            className="truncate max-w-[200px]"
                            title={user.wallet_address}
                          >
                            {user.wallet_address.substring(0, 6)}...
                            {user.wallet_address.substring(
                              user.wallet_address.length - 4
                            )}
                          </span>
                        </p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          No wallet connected
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Discord ID
                    </h4>
                    <div className="flex items-center">
                      {user?.discord_id ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                          Discord Connected
                        </span>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          Not connected
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Member Since
                    </h4>
                    <p className="text-gray-900 dark:text-white flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-5">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    User Statistics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center">
                        <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {user?.total_achievements || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Badges Earned
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {userStats?.total_events_joined || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Events Joined
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center">
                        <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
                        <div>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {userStats?.total_points || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Points
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Badges Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />
                Badges Earned
              </h3>
              <Link
                href={`/admin/users/${userId}/badges`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View All
              </Link>
            </div>
            <div className="p-6">
              {userBadges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {userBadges.slice(0, 4).map((userBadge) => (
                    <div
                      key={userBadge._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-col items-center"
                    >
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2">
                        {userBadge.badge_id.image_url ? (
                          <img
                            src={userBadge.badge_id.image_url}
                            alt={userBadge.badge_id.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <TrophyIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full">
                          {userBadge.badge_id.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(userBadge.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <TrophyIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No badges earned yet
                  </p>
                </div>
              )}

              {userBadges.length > 4 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/admin/users/${userId}/badges`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    View {userBadges.length - 4} more badges
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <Link
                    href={`/admin/users/${userId}/award-badge`}
                    className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Award Badge
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
              Recent Events
            </h3>
            <Link
              href={`/admin/users/${userId}/events`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            {userEvents.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Registered On
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Attended
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {userEvents.slice(0, 5).map((userEvent, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {userEvent.event_id.image_url ? (
                              <img
                                src={userEvent.event_id.image_url}
                                alt={userEvent.event_id.title}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {userEvent.event_id.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(
                                userEvent.event_id.start_time
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {userEvent.event_id.event_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(
                          userEvent.registration_date
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {userEvent.attended ? (
                          <span className="inline-flex items-center justify-center text-green-500">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center text-red-500">
                            <XMarkIcon className="h-5 w-5" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No event participation records found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
