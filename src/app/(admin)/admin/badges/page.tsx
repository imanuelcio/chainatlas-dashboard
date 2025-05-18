// src/app/(dashboard)/admin/badges/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Badge } from "@/types/badges";
import { UserProfile } from "@/types/user";
import { usersAPI } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminBadgesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  console.log(profile?.role);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileResponse = await usersAPI.getUserProfile();
        const badgesData = await usersAPI.getUserBadges();
        setBadges(badgesData.badges);
        // Periksa apakah respons mengandung user atau profile
        const profileData = profileResponse.profile || profileResponse.user;

        if (profileData) {
          setProfile(profileData);
          // Initialize form data with current profile values
        } else {
          throw new Error("Profile data not found in response");
        }

        console.log("Profile response:", profileResponse);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Filter badges based on search term and category
  const filteredBadges = badges.filter((badge) => {
    const matchesSearch =
      searchTerm === "" ||
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || badge.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              Manage Badges
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create, edit, and manage badges for the community.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/admin/badges/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium mt-4 md:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            >
              <span className="flex items-center">New Badge</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center">
                  <h1>funnel</h1>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                    Filter by:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`${
                          selectedCategory === category
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        } px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative flex-grow max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image
                      alt="magnifying"
                      src={"/icons/magnifying.svg"}
                      width={15}
                      height={15}
                    />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md"
                    placeholder="Search badges"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Badge
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBadges.length > 0 ? (
                    filteredBadges.map((badge: any) => (
                      <tr
                        key={badge._id}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 mr-3">
                              {badge.image_url ? (
                                <img
                                  src={badge.image_url}
                                  alt={badge.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Image
                                    alt="Trophy"
                                    src={"/icons/trophy.svg"}
                                    width={30}
                                    height={30}
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {badge.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {badge.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                            {badge.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {badge.points || 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(badge.created_at).toLocaleDateString()}
                        </td>
                        {/* <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/badges/${badge._id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Edit
                            </Link>
                            {showConfirmDelete === badge._id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteBadge(badge._id)}
                                  disabled={isDeleting === badge._id}
                                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                >
                                  {isDeleting === badge._id ? "Deleting..." : "Confirm"}
                                </button>
                                <button
                                  onClick={() => setShowConfirmDelete(null)}
                                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowConfirmDelete(badge._id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        {searchTerm || selectedCategory !== "All"
                          ? "No badges match your search criteria"
                          : "No badges found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredBadges.length === 0 && (
              <div className="text-center py-8">
                <Link
                  href="/admin/badges/new"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                >
                  Create First Badge
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
