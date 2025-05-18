// src/app/(dashboard)/admin/events/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { eventsAPI, badgesAPI } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import { Badge } from "@/types/badges";

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoadingBadges, setIsLoadingBadges] = useState(true);
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

  useEffect(() => {
    // Fetch badges for reward selection
    const fetchBadges = async () => {
      try {
        setIsLoadingBadges(true);
        const response = await badgesAPI.getAllBadges();
        setBadges(response.badges || []);
      } catch (error) {
        console.error("Error fetching badges:", error);
        toast.error("Failed to load badges for rewards");
      } finally {
        setIsLoadingBadges(false);
      }
    };

    fetchBadges();
  }, []);

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
      setIsSubmitting(true);
      const response = await eventsAPI.createEvent(eventData);
      toast.success("Event created successfully!");
      router.push("/admin/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            {/* <ArrowLeftIcon className="h-4 w-4 mr-1" /> */}
            Back to Events
          </Link>
        </div>

        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate flex items-center">
              {/* <CalendarIcon className="h-8 w-8 mr-3 text-blue-500" /> */}
              Create New Event
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Schedule a new event for your community
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Title */}
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Event Title*
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
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Event Description */}
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
                    value={eventData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the event, its purpose, and what attendees can expect"
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

                {/* Event Type */}
                <div>
                  <label
                    htmlFor="event_type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Event Type*
                  </label>
                  <select
                    id="event_type"
                    name="event_type"
                    value={eventData.event_type}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.event_type
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  >
                    <option value="">Select event type</option>
                    {eventTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.event_type && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.event_type}
                    </p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label
                    htmlFor="image_url"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Image URL
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
                    Add an image for better visibility (recommended size:
                    1200x600px)
                  </p>
                </div>

                {/* Start Time */}
                <div>
                  <label
                    htmlFor="start_time"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Start Time*
                  </label>
                  <input
                    type="datetime-local"
                    id="start_time"
                    name="start_time"
                    value={eventData.start_time}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.start_time
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.start_time && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.start_time}
                    </p>
                  )}
                </div>

                {/* End Time */}
                <div>
                  <label
                    htmlFor="end_time"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    End Time*
                  </label>
                  <input
                    type="datetime-local"
                    id="end_time"
                    name="end_time"
                    value={eventData.end_time}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.end_time
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  />
                  {errors.end_time && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.end_time}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="col-span-2 md:col-span-1">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Location
                    {!eventData.is_virtual && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    placeholder="e.g. Conference Room A, 123 Main St"
                    disabled={eventData.is_virtual}
                    className={`w-full px-3 py-2 border ${
                      errors.location
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      eventData.is_virtual ? "opacity-50" : ""
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Virtual Event Checkbox */}
                <div className="flex items-center md:mt-8">
                  <input
                    type="checkbox"
                    id="is_virtual"
                    name="is_virtual"
                    checked={eventData.is_virtual}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_virtual"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
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
                      badges.map((badge: any) => (
                        <option key={badge._id} value={badge._id}>
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
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50"
                >
                  {isSubmitting ? (
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
            Tips for Successful Events
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
                <strong>Clear Agenda:</strong> Provide a detailed schedule in
                the description
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
                <strong>Registration Deadline:</strong> Set deadlines to
                encourage early sign-ups
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
                <strong>Badge Rewards:</strong> Create a specific badge for each
                major event
              </span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
