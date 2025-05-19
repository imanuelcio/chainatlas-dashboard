// src/app/(dashboard)/admin/badges/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCreateBadge } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CreateBadgePage() {
  const router = useRouter();
  const [badgeData, setBadgeData] = useState({
    name: "",
    description: "",
    image_url: "",
    category: "",
    points: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use the createBadge mutation from React Query
  const createBadgeMutation = useCreateBadge();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!badgeData.name.trim()) {
      newErrors.name = "Badge name is required";
    }

    if (!badgeData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!badgeData.image_url.trim()) {
      newErrors.image_url = "Image URL is required";
    } else if (!/^https?:\/\/.+/.test(badgeData.image_url)) {
      newErrors.image_url =
        "Please enter a valid URL starting with http:// or https://";
    }

    if (!badgeData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (badgeData.points < 0) {
      newErrors.points = "Points cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setBadgeData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createBadgeMutation.mutateAsync(badgeData, {
        onSuccess: () => {
          toast.success("Badge created successfully!");
          router.push("/admin/badges");
        },
        onError: (error) => {
          console.error("Error creating badge:", error);
          toast.error("Failed to create badge. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error creating badge:", error);
      toast.error("Failed to create badge. Please try again.");
    }
  };

  const categoryOptions = [
    "Achievement",
    "Participation",
    "Contribution",
    "Event",
    "Special",
    "Community",
    "Technical",
    "Engagement",
    "Other",
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/badges"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            {/* <ArrowLeftIcon className="h-4 w-4 mr-1" /> */}
            Back to Badges
          </Link>
        </div>

        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              {/* <TrophyIcon className="h-8 w-8 mr-3 text-yellow-500" /> */}
              Create New Badge
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a new badge to recognize and reward community members.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Badge Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={badgeData.name}
                    onChange={handleChange}
                    placeholder="e.g. Early Contributor"
                    className={`w-full px-3 py-2 border ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={badgeData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe what this badge represents and how to earn it"
                    className={`w-full px-3 py-2 border ${
                      errors.description
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="image_url"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Image URL*
                  </label>
                  <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    value={badgeData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/badge-image.png"
                    className={`w-full px-3 py-2 border ${
                      errors.image_url
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.image_url && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.image_url}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Provide a URL to the badge image (recommended size:
                    200x200px)
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  {badgeData.image_url && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image Preview
                      </label>
                      <div className="h-20 w-20 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={badgeData.image_url}
                          alt="Badge Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiPjxwYXRoIHN0cm9rZUxpbmVjYXA9InJvdW5kIiBzdHJva2VMaW5lam9pbj0icm91bmQiIHN0cm9rZVdpZHRoPSIxIiBkPSJNMTIgOHY0bDMgM20tNiAwaDEyYTIgMiAwIDAwMi0yVjZhMiAyIDAgMDAtMi0ySDZhMiAyIDAgMDAtMiAydjEyYTIgMiAwIDAwMiAyaDIiLz48L3N2Zz4=";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={badgeData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.category
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="points"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Points
                  </label>
                  <input
                    type="number"
                    id="points"
                    name="points"
                    value={badgeData.points}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-3 py-2 border ${
                      errors.points
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.points && (
                    <p className="mt-1 text-sm text-red-500">{errors.points}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    The number of XP points awarded when this badge is earned
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  href="/admin/badges"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm font-medium mr-3 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createBadgeMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50"
                >
                  {createBadgeMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    "Create Badge"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400"
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
            Tips for Creating Effective Badges
          </h3>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 mt-3">
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
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
                <strong>Clear Criteria:</strong> Make sure members understand
                exactly how to earn the badge
              </span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
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
                <strong>Meaningful Rewards:</strong> Assign point values that
                reflect the effort required
              </span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
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
                <strong>Visual Design:</strong> Use distinct and recognizable
                images for each badge category
              </span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
