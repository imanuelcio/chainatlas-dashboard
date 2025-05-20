"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePublishedEvents, useDeleteEvent } from "@/lib/api";
import { Event } from "@/types/event";
import toast from "react-hot-toast";

export default function AdminEventsPage() {
  const router = useRouter();
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(
    null
  );

  // Fetch events with React Query
  const {
    data: eventsData,
    isLoading,
    isError,
    refetch,
  } = usePublishedEvents({ limit: 100 });

  // Use delete event mutation
  const deleteEventMutation = useDeleteEvent();

  // Handle errors
  if (isError) {
    toast.error("Failed to load events");
  }

  // Extract events from response
  const events: Event[] = eventsData?.events || [];

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventMutation.mutateAsync(eventId, {
        onSuccess: () => {
          toast.success("Event deleted successfully");
          refetch(); // Refresh the event list after deletion
        },
        onError: (error) => {
          console.error("Error deleting event:", error);
          toast.error("Failed to delete event");
        },
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setShowConfirmDelete(null);
    }
  };

  // Sort events by start date
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Manage Events
          </h1>
          <p className="text-blue-100/70">
            Create, edit, and delete events for your community
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg font-medium mt-4 md:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center"
        >
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create New Event
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-400 shadow-lg shadow-blue-500/20"></div>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-800/30 bg-slate-800/80">
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800/20">
                {sortedEvents.map((event, index) => {
                  const startDate = new Date(event.start_time);
                  const endDate = new Date(event.end_time);
                  const now = new Date();

                  let status = "Upcoming";
                  let statusColor =
                    "bg-blue-900/50 text-blue-300 border border-blue-700/30";

                  if (now > endDate) {
                    status = "Ended";
                    statusColor =
                      "bg-red-900/50 text-red-300 border border-red-700/30";
                  } else if (now > startDate) {
                    status = "In Progress";
                    statusColor =
                      "bg-green-900/50 text-green-300 border border-green-700/30";
                  }

                  return (
                    <tr
                      key={event.id}
                      className={`${
                        index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/30"
                      } hover:bg-blue-900/20 transition-colors duration-150`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-600/50 to-blue-500/50 overflow-hidden flex-shrink-0 mr-4 shadow-md">
                            {event.image_url ? (
                              <img
                                src={event.image_url}
                                alt={event.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-indigo-300"
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
                          <div>
                            <div className="font-medium text-white">
                              {event.title}
                            </div>
                            <div className="text-sm text-blue-100/70 line-clamp-1">
                              {event.location ||
                                (event.is_virtual
                                  ? "Virtual Event"
                                  : "No location")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-white">
                          {startDate.toLocaleDateString()}
                        </div>
                        <div className="text-blue-100/60 flex items-center text-sm">
                          <svg
                            className="w-3.5 h-3.5 mr-1 text-indigo-400"
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
                          {startDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {endDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-700/30 font-medium">
                          {event.event_type}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${statusColor}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {event.is_published ? (
                          <div className="h-6 w-6 bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-400"
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
                          </div>
                        ) : (
                          <div className="h-6 w-6 bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/events/${event.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
                          >
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </Link>
                          {showConfirmDelete === event.id ? (
                            <div className="flex items-center space-x-2 ml-2 bg-red-900/30 px-2 py-1 rounded-lg">
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                disabled={deleteEventMutation.isPending}
                                className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center"
                              >
                                {deleteEventMutation.isPending &&
                                deleteEventMutation.variables === event.id ? (
                                  <div className="flex items-center">
                                    <div className="h-3 w-3 border-t-2 border-b-2 border-red-400 rounded-full animate-spin mr-1"></div>
                                    <span>Deleting...</span>
                                  </div>
                                ) : (
                                  <>
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
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    Confirm
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => setShowConfirmDelete(null)}
                                className="text-gray-400 hover:text-gray-300 transition-colors duration-200 flex items-center"
                              >
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowConfirmDelete(event.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-slate-700/50 rounded-lg p-6 max-w-sm mx-auto">
                <svg
                  className="h-16 w-16 text-indigo-400/50 mx-auto mb-4"
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
                <p className="text-blue-100/70 mb-4">No events found</p>
                <Link
                  href="/admin/events/new"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-blue-500/20 transition-all duration-200 inline-flex items-center"
                >
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create First Event
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Event Management Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-700/20 shadow-lg shadow-blue-900/10 p-6">
          <h3 className="font-semibold mb-3 flex items-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-400"
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
            Quick Tips
          </h3>
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <ul className="text-sm text-blue-100/80 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-400"
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
                <span>Add high-quality images to increase engagement</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-400"
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
                  Set registration deadlines to better plan attendance
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-400"
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
                <span>Link badges to events to incentivize participation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-700/20 shadow-lg shadow-purple-900/10 p-6">
          <h3 className="font-semibold mb-3 flex items-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-purple-400"
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
            Event Types
          </h3>
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
            <ul className="text-sm text-blue-100/80 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-400"
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
                  <strong className="text-white">Workshops:</strong> Educational
                  hands-on sessions
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-400"
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
                  <strong className="text-white">AMAs:</strong> Ask Me Anything
                  sessions with experts
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-400"
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
                  <strong className="text-white">Hackathons:</strong>{" "}
                  Competitive development events
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-green-700/20 shadow-lg shadow-green-900/10 p-6">
          <h3 className="font-semibold mb-3 flex items-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Engagement Metrics
          </h3>
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
            <ul className="text-sm text-blue-100/80 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-400"
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
                <span>Track registration vs. attendance rates</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-400"
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
                <span>Monitor badge distributions after events</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-400"
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
                <span>Compare virtual vs. in-person event participation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
