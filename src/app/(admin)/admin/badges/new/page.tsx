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
            className="inline-flex items-center text-blue-400 hover:text-cyan-300 transition-colors duration-200"
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

        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              <svg
                className="h-8 w-8 mr-3 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Create New Badge
            </h2>
            <p className="mt-1 text-sm text-blue-100/70">
              Add a new badge to recognize and reward community members.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    Badge Name
                    <span className="text-cyan-400 ml-1">*</span>
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
                        ? "border-red-500 focus:ring-red-500"
                        : "border-blue-900/30 focus:ring-blue-500"
                    } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white placeholder-slate-400`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    Description
                    <span className="text-cyan-400 ml-1">*</span>
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
                        ? "border-red-500 focus:ring-red-500"
                        : "border-blue-900/30 focus:ring-blue-500"
                    } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white placeholder-slate-400`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="image_url"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    Image URL
                    <span className="text-cyan-400 ml-1">*</span>
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
                        ? "border-red-500 focus:ring-red-500"
                        : "border-blue-900/30 focus:ring-blue-500"
                    } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white placeholder-slate-400`}
                  />
                  {errors.image_url && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.image_url}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-blue-100/60">
                    Provide a URL to the badge image (recommended size:
                    200x200px)
                  </p>
                </div>

                <div className="flex flex-col space-y-1">
                  {badgeData.image_url && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-white mb-1">
                        Image Preview
                      </label>
                      <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-blue-600/50 to-cyan-500/50 p-1 overflow-hidden shadow-lg shadow-blue-900/20">
                        <div className="h-full w-full rounded-md bg-slate-900/50 overflow-hidden">
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
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    Category
                    <span className="text-cyan-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={badgeData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 appearance-none border ${
                        errors.category
                          ? "border-red-500 focus:ring-red-500"
                          : "border-blue-900/30 focus:ring-blue-500"
                      } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white placeholder-slate-400`}
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map((category) => (
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
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="points"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    Points
                    <div className="ml-2 bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                      Optional
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="number"
                      id="points"
                      name="points"
                      value={badgeData.points}
                      onChange={handleChange}
                      min="0"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.points
                          ? "border-red-500 focus:ring-red-500"
                          : "border-blue-900/30 focus:ring-blue-500"
                      } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white placeholder-slate-400`}
                    />
                  </div>
                  {errors.points && (
                    <p className="mt-1 text-sm text-red-400">{errors.points}</p>
                  )}
                  <p className="mt-1 text-xs text-blue-100/60">
                    The number of XP points awarded when this badge is earned
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  href="/admin/badges"
                  className="px-4 py-2 border border-blue-800/40 text-blue-300 rounded-lg shadow-sm font-medium mr-3 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createBadgeMutation.isPending}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 shadow-lg shadow-blue-500/20 transition-all duration-200"
                >
                  {createBadgeMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
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
                      Create Badge
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-6">
          <h3 className="font-semibold mb-4 text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-cyan-400"
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
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <ul className="text-sm text-blue-100/80 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-cyan-400"
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
                  <strong className="text-white">Clear Criteria:</strong> Make
                  sure members understand exactly how to earn the badge. Be
                  specific about requirements and expectations.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-cyan-400"
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
                  <strong className="text-white">Meaningful Rewards:</strong>{" "}
                  Assign point values that reflect the effort required. Higher
                  difficulty achievements should have correspondingly higher
                  rewards.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-cyan-400"
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
                  <strong className="text-white">Visual Design:</strong> Use
                  distinct and recognizable images for each badge category.
                  Consistent style with clear differentiation helps users
                  identify achievements at a glance.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-cyan-400"
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
                  <strong className="text-white">Progressive System:</strong>{" "}
                  Create a badge hierarchy that encourages continued
                  participation. Consider beginner, intermediate, and expert
                  levels for key activities.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
