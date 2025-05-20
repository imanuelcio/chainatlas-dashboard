// src/app/(dashboard)/admin/events/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCreateEvent, useAllBadges } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { Badge } from "@/types/badges";

export default function CreateEventPage() {
  const router = useRouter();
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    image_url: "",
    event_type: "",
    start_time: "",
    end_time: "",
    location: "",
    is_virtual: false,
    special_reward: "",
    reward_badge_id: "",
    is_published: false,
    max_participants: 0,
    registration_deadline: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use React Query to fetch badges
  const {
    data: badgesData,
    isLoading: isLoadingBadges,
    isError: isErrorBadges,
  } = useAllBadges();

  // Extract badges from response
  const badges: Badge[] = badgesData?.badges || [];

  // Use createEvent mutation
  const createEventMutation = useCreateEvent();

  // Handle errors for badge fetching
  if (isErrorBadges) {
    toast.error("Failed to load badges for rewards");
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!eventData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!eventData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!eventData.event_type.trim()) {
      newErrors.event_type = "Event type is required";
    }

    if (!eventData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!eventData.end_time) {
      newErrors.end_time = "End time is required";
    } else if (new Date(eventData.end_time) <= new Date(eventData.start_time)) {
      newErrors.end_time = "End time must be after start time";
    }

    if (eventData.is_virtual === false && !eventData.location.trim()) {
      newErrors.location = "Location is required for in-person events";
    }

    if (eventData.max_participants < 0) {
      newErrors.max_participants = "Maximum participants cannot be negative";
    }

    if (
      eventData.registration_deadline &&
      new Date(eventData.registration_deadline) > new Date(eventData.start_time)
    ) {
      newErrors.registration_deadline =
        "Registration deadline must be before the event starts";
    }

    if (eventData.image_url && !/^https?:\/\/.+/.test(eventData.image_url)) {
      newErrors.image_url =
        "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEventData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "max_participants") {
      setEventData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseInt(value),
      }));
    } else {
      setEventData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createEventMutation.mutateAsync(eventData, {
        onSuccess: () => {
          toast.success("Event created successfully!");
          router.push("/admin/events");
        },
        onError: (error) => {
          console.error("Error creating event:", error);
          toast.error("Failed to create event. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  const eventTypeOptions = [
    "Workshop",
    "Meetup",
    "Conference",
    "Hackathon",
    "AMA",
    "Competition",
    "Presentation",
    "Party",
    "Other",
  ];

  // Format datetime-local input
  const formatDateTimeForInput = (date: Date | null): string => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/events"
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
            Back to Events
          </Link>
        </div>

        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              <svg
                className="h-8 w-8 text-indigo-400 mr-3"
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
              Create New Event
            </h2>
            <p className="mt-1 text-sm text-blue-100/70">
              Schedule a new event for your community
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Title */}
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-white mb-1 items-center"
                  >
                    Event Title
                    <span className="text-cyan-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    placeholder="e.g. Community Hackathon 2025"
                    className={`w-full px-3 py-2 border ${
                      errors.title
                        ? "border-red-500 focus:ring-red-500"
                        : "border-blue-900/30 focus:ring-blue-500"
                    } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white placeholder-slate-400`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                  )}
                </div>

                {/* Event Description */}
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
                    value={eventData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the event, its purpose, and what attendees can expect"
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

                {/* Event Type */}
                <div>
                  <label
                    htmlFor="event_type"
                    className="block text-sm font-medium text-white mb-1 items-center"
                  >
                    Event Type
                    <span className="text-cyan-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="event_type"
                      name="event_type"
                      value={eventData.event_type}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 appearance-none border ${
                        errors.event_type
                          ? "border-red-500 focus:ring-red-500"
                          : "border-blue-900/30 focus:ring-blue-500"
                      } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white placeholder-slate-400`}
                    >
                      <option value="">Select event type</option>
                      {eventTypeOptions.map((type, i) => (
                        <option key={i} value={type}>
                          {type}
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
                  {errors.event_type && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.event_type}
                    </p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label
                    htmlFor="image_url"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    Image URL
                    <div className="ml-2 bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                      Optional
                    </div>
                  </label>
                  <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    value={eventData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/event-image.jpg"
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
                    Add an image for better visibility (recommended size:
                    1200x600px)
                  </p>
                </div>

                {/* Start Time */}
                <div>
                  <label
                    htmlFor="start_time"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    Start Time
                    <span className="text-cyan-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-blue-300/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="datetime-local"
                      id="start_time"
                      name="start_time"
                      value={eventData.start_time}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.start_time
                          ? "border-red-500 focus:ring-red-500"
                          : "border-blue-900/30 focus:ring-blue-500"
                      } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white`}
                    />
                  </div>
                  {errors.start_time && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.start_time}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div>
                  <label
                    htmlFor="end_time"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    End Time
                    <span className="text-cyan-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-blue-300/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="datetime-local"
                      id="end_time"
                      name="end_time"
                      value={eventData.end_time}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.end_time
                          ? "border-red-500 focus:ring-red-500"
                          : "border-blue-900/30 focus:ring-blue-500"
                      } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white`}
                    />
                  </div>
                  {errors.end_time && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.end_time}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-white mb-1 flex items-center"
                  >
                    Location
                    {!eventData.is_virtual && (
                      <span className="text-cyan-400 ml-1">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-blue-300/50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={eventData.location}
                      onChange={handleChange}
                      placeholder="e.g. Conference Room A, 123 Main St"
                      disabled={eventData.is_virtual}
                      className={`w-full pl-10 pr-3 py-2 border ${
                        errors.location
                          ? "border-red-500 focus:ring-red-500"
                          : "border-blue-900/30 focus:ring-blue-500"
                      } rounded-lg shadow-sm focus:outline-none focus:border-blue-500 bg-slate-700/80 text-white placeholder-slate-400 ${
                        eventData.is_virtual ? "opacity-50" : ""
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Virtual Event Checkbox */}
                <div className="flex items-center md:mt-8">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="is_virtual"
                      name="is_virtual"
                      checked={eventData.is_virtual}
                      onChange={handleChange}
                      className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 cursor-pointer"
                    />
                    <label
                      htmlFor="is_virtual"
                      className={`block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer ${
                        eventData.is_virtual ? "bg-indigo-600" : "bg-slate-600"
                      }`}
                    >
                      <span
                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                          eventData.is_virtual ? "transform translate-x-4" : ""
                        }`}
                      ></span>
                    </label>
                  </div>
                  <label
                    htmlFor="is_virtual"
                    className="text-sm text-white cursor-pointer"
                  >
                    This is a virtual event
                  </label>
                </div>

                {/* Max Participants */}
                <div>
                  <label
                    htmlFor="max_participants"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Maximum Participants
                  </label>
                  <input
                    type="number"
                    id="max_participants"
                    name="max_participants"
                    value={eventData.max_participants || ""}
                    onChange={handleChange}
                    min="0"
                    placeholder="Leave blank for unlimited"
                    className={`w-full px-3 py-2 border ${
                      errors.max_participants
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.max_participants && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.max_participants}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave at 0 for unlimited participants
                  </p>
                </div>

                {/* Registration Deadline */}
                <div>
                  <label
                    htmlFor="registration_deadline"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="registration_deadline"
                    name="registration_deadline"
                    value={eventData.registration_deadline}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.registration_deadline
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.registration_deadline && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.registration_deadline}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave blank to allow registration until the event starts
                  </p>
                </div>

                {/* Reward Badge */}
                <div>
                  <label
                    htmlFor="reward_badge_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Reward Badge
                  </label>
                  <select
                    id="reward_badge_id"
                    name="reward_badge_id"
                    value={eventData.reward_badge_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    disabled={isLoadingBadges}
                  >
                    <option value="">No badge reward</option>
                    {isLoadingBadges ? (
                      <option value="" disabled>
                        Loading badges...
                      </option>
                    ) : (
                      badges.map((badge) => (
                        <option key={badge.id} value={badge.id}>
                          {badge.name}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Select a badge to award to participants
                  </p>
                </div>

                {/* Special Reward */}
                <div>
                  <label
                    htmlFor="special_reward"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Special Reward
                  </label>
                  <input
                    type="text"
                    id="special_reward"
                    name="special_reward"
                    value={eventData.special_reward}
                    onChange={handleChange}
                    placeholder="e.g. Custom merchandise, gift cards"
                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Describe any special rewards for participants (optional)
                  </p>
                </div>

                {/* Published Status */}
                <div className="col-span-2 mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      checked={eventData.is_published}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="is_published"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Publish event immediately (visible to members)
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                    If unchecked, the event will be saved as a draft
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  href="/admin/events"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md shadow-sm font-medium mr-3 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={createEventMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50"
                >
                  {createEventMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6">
          <h3 className="font-semibold mb-3 flex items-center text-white">
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
            Tips for Successful Events
          </h3>
          <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-700/30">
            <ul className="text-sm text-blue-100/80 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-400"
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
                  <strong className="text-white">Clear Agenda:</strong> Provide
                  a detailed schedule in the description so participants know
                  what to expect and when to join specific activities.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-400"
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
                  <strong className="text-white">Registration Deadline:</strong>{" "}
                  Set deadlines to encourage early sign-ups and help with
                  planning and resource allocation.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-400"
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
                  <strong className="text-white">Badge Rewards:</strong> Create
                  a specific badge for each major event to increase
                  participation and provide a lasting reminder of involvement.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-400"
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
                  <strong className="text-white">Virtual Options:</strong>{" "}
                  Consider including virtual components even for in-person
                  events to increase accessibility and reach a wider audience.
                </span>
              </li>
            </ul>
          </div>

          {/* Event preview card */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 text-white flex items-center">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Event Preview
            </h4>
            <div className="flex items-center p-4 border border-indigo-800/20 rounded-xl bg-slate-800/30 hover:bg-indigo-900/20 transition-all duration-200">
              <div className="mr-4 h-16 w-16 flex-shrink-0 bg-gradient-to-br from-indigo-600/50 to-blue-500/50 rounded-lg overflow-hidden shadow-md">
                {eventData.image_url ? (
                  <img
                    src={eventData.image_url}
                    alt="Event preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-indigo-300"
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
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">
                  {eventData.title || "Event Title"}
                </div>
                <div className="text-sm text-blue-100/70 line-clamp-1">
                  {eventData.description
                    ? eventData.description.length > 50
                      ? eventData.description.substring(0, 50) + "..."
                      : eventData.description
                    : "Event description will appear here"}
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700/30">
                    {eventData.event_type || "Event type"}
                  </span>
                  {eventData.is_virtual && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/30">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Virtual
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 px-4 py-2 bg-gradient-to-r from-indigo-500/30 to-indigo-400/30 text-white text-sm font-medium rounded-lg border border-indigo-500/20 flex items-center">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
