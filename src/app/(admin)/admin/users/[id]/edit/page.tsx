// src/app/(dashboard)/admin/users/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usersAPI } from "@/lib/api";
import {
  UserIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  AtSymbolIcon,
  WalletIcon,
  UserCircleIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";

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

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profile_image_url: "",
    role: "user" as "user" | "admin",
    // Add more fields as needed
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);

        // In a real implementation, you would have a dedicated API endpoint
        // For now, simulate with the existing API
        const userResponse = await usersAPI.getAllUsers();
        const foundUser = userResponse.users.find((u: User) => u._id === id);

        if (foundUser) {
          setOriginalUser(foundUser);
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
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.profile_image_url &&
      !/^https?:\/\/.+/.test(formData.profile_image_url)
    ) {
      newErrors.profile_image_url =
        "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      setIsSaving(true);

      // In a real implementation, you would call an API endpoint
      // await usersAPI.updateUserProfile(id, formData);

      // Simulate successful update
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("User updated successfully");
      router.push(`/admin/users/${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      // In a real implementation, you would call an API endpoint
      // await usersAPI.deleteUser(id);

      // Simulate successful deletion
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("User deleted successfully");
      router.push("/admin/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  if (isLoading) {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/admin/users/${id}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to User Details
          </Link>
        </div>

        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              <UserCircleIcon className="h-8 w-8 mr-3 text-blue-500" />
              Edit User: {originalUser?.username}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update user information and settings
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              User Information
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information Section */}
              <div className="md:col-span-2">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Basic Information
                </h4>
              </div>

              {/* Username */}
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
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Role */}
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
                {formData.role === "admin" && (
                  <p className="mt-1 text-sm text-yellow-500 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    Admin users have full system access
                  </p>
                )}
              </div>

              {/* Contact Information Section */}
              <div className="md:col-span-2 mt-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <AtSymbolIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Contact Information
                </h4>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
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
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Display external connections as read-only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  External Connections
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {originalUser?.wallet_address ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        <WalletIcon className="h-3 w-3 mr-1" />
                        Wallet Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <WalletIcon className="h-3 w-3 mr-1" />
                        No Wallet
                      </span>
                    )}

                    {originalUser?.discord_id ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                        Discord Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        No Discord
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    External connections can only be modified by the user
                  </p>
                </div>
              </div>

              {/* Profile Section */}
              <div className="md:col-span-2 mt-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Profile
                </h4>
              </div>

              {/* Profile Image */}
              <div className="md:col-span-2">
                <label
                  htmlFor="profile_image_url"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Profile Image URL
                </label>
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-grow">
                    <input
                      type="url"
                      id="profile_image_url"
                      name="profile_image_url"
                      value={formData.profile_image_url}
                      onChange={handleChange}
                      placeholder="https://example.com/profile.jpg"
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

                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {formData.profile_image_url ? (
                        <img
                          src={formData.profile_image_url}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src =
                              "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <UserCircleIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Provide a URL to an image for the user's profile picture
                </p>
              </div>

              {/* Additional fields can be added here */}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete User
              </button>

              <div className="flex space-x-3">
                <Link
                  href={`/admin/users/${id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Security Notes */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <LockClosedIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            Security Notes
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              <span className="font-medium text-gray-900 dark:text-white">
                Role Changes:
              </span>{" "}
              Changing a user's role to "Admin" grants them full access to the
              administrative dashboard.
            </p>
            <p>
              <span className="font-medium text-gray-900 dark:text-white">
                External Identities:
              </span>{" "}
              Wallet addresses and Discord connections can only be modified by
              the user themselves through the authentication flow.
            </p>
            <p>
              <span className="font-medium text-gray-900 dark:text-white">
                User Deletion:
              </span>{" "}
              Deleting a user is permanent and will remove all associated data,
              including badges, event participations, and other records.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-auto p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
              Confirm User Deletion
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Are you sure you want to delete the user "{originalUser?.username}
              "? This action cannot be undone and will remove all associated
              data.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
