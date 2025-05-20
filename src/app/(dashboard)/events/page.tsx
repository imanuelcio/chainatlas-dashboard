"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePublishedEvents } from "@/lib/api";
import { Event } from "@/types/event";
import toast from "react-hot-toast";

export default function EventsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("");

  // Use React Query to fetch events with pagination and filtering
  const {
    data: eventsData,
    isLoading,
    isError,
    error,
  } = usePublishedEvents({
    page,
    limit: 8,
    type: filter || undefined,
  });

  // Extract events and pagination data
  const events: Event[] = eventsData?.events || [];
  const totalPages = eventsData?.pagination?.pages || 1;

  // Handle errors
  if (isError) {
    toast.error("Failed to load events");
    console.error("Error fetching events:", error);
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Format event date
  const formatEventDate = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Same day event
    if (start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString()} · ${start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Multi-day event
    return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleDateString()} ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white flex items-center">
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
            Community Events
          </h1>
          <p className="text-blue-100/70">
            Join events to earn badges and connect with the community
          </p>
        </div>

        {/* Filter */}
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <label htmlFor="filter" className="text-sm text-blue-100/70">
            Filter by:
          </label>
          <div className="relative">
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="appearance-none rounded-lg border border-indigo-900/30 bg-slate-700/80 text-white px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Events</option>
              <option value="Workshop">Workshops</option>
              <option value="Hackathon">Hackathons</option>
              <option value="AMA">AMAs</option>
              <option value="Conference">Conferences</option>
              <option value="Social">Social</option>
              <option value="Other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-300">
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
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-400 shadow-lg shadow-indigo-500/20"></div>
        </div>
      ) : events.length > 0 ? (
        <>
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="h-40 bg-gradient-to-br from-indigo-900/30 to-slate-800/30 relative overflow-hidden">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-indigo-500 opacity-20"
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

                  {/* Event status badge - positioned at the top right of the image */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    {/* Calculate if event is upcoming, ongoing, or past */}
                    {(() => {
                      const now = new Date();
                      const start = new Date(event.start_time);
                      const end = new Date(event.end_time);

                      if (now < start) {
                        return (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/70 text-blue-300 border border-blue-700/30 backdrop-blur-sm">
                            Upcoming
                          </span>
                        );
                      } else if (now >= start && now <= end) {
                        return (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900/70 text-green-300 border border-green-700/30 backdrop-blur-sm">
                            In Progress
                          </span>
                        );
                      } else {
                        return (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900/70 text-red-300 border border-red-700/30 backdrop-blur-sm">
                            Ended
                          </span>
                        );
                      }
                    })()}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700/30">
                      {event.event_type}
                    </span>
                    {event.is_virtual && (
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
                    {event.special_reward && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700/30">
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Special Reward
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-white group-hover:text-indigo-300 transition-colors duration-200">
                    {event.title}
                  </h3>
                  <p className="text-sm text-blue-100/70 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="text-xs text-blue-100/60 mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-indigo-400"
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
                    {formatEventDate(event.start_time, event.end_time)}
                  </div>
                  {event.location && (
                    <div className="text-xs text-blue-100/60 mt-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-indigo-400"
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
                      {event.location}
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <div className="inline-flex items-center text-xs font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200">
                      View Details
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-indigo-800/40 bg-slate-800/50 text-indigo-300 hover:bg-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${
                      pageNum === page
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-slate-800/50 text-blue-100/70 hover:bg-indigo-900/30 border border-indigo-800/40"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-indigo-800/40 bg-slate-800/50 text-indigo-300 hover:bg-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-slate-700/50 rounded-lg p-6 inline-flex mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14 text-indigo-400/50"
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
          <h3 className="text-xl font-medium mb-2 text-white">
            No events found
          </h3>
          <p className="text-blue-100/70 mb-6">
            {filter
              ? `There are no ${filter} events currently available.`
              : "There are no upcoming events at the moment."}
          </p>
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-indigo-500/20 transition-all duration-200 flex items-center inline-flex"
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View all events
            </button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
