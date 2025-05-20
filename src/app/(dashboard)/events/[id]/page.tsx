"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEvent, useRegisterForEvent } from "@/lib/api";
import { EventWithDetails } from "@/types/event";
import toast from "react-hot-toast";
import { Badge } from "@/types/badges";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const eventId = params.id;

  // Fetch event details using React Query
  const { data: eventData, isLoading, isError, refetch } = useEvent(eventId);

  // Registration mutation with React Query
  const registerMutation = useRegisterForEvent();

  // Extract event from response data
  const event: EventWithDetails | null = eventData?.event || null;

  // Handle registration
  const handleRegister = async () => {
    if (!event) return;

    try {
      await registerMutation.mutateAsync(event.id, {
        onSuccess: () => {
          toast.success("Successfully registered for the event!");
          // Refetch event data to update registration status
          refetch();
        },
        onError: (error) => {
          console.error("Error registering for event:", error);
          toast.error("Failed to register for the event");
        },
      });
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("Failed to register for the event");
    }
  };

  // Format event date and time
  const formatEventDateTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // Same day event
    if (start.toDateString() === end.toDateString()) {
      return {
        date: start.toLocaleDateString(undefined, options),
        time: `${start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      };
    }

    // Multi-day event
    return {
      date: `${start.toLocaleDateString(
        undefined,
        options
      )} - ${end.toLocaleDateString(undefined, options)}`,
      time: `${start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    };
  };

  // Check if registration deadline has passed
  const isRegistrationClosed = (deadline?: string) => {
    if (!deadline) return false;

    const deadlineDate = new Date(deadline);
    const now = new Date();

    return now > deadlineDate;
  };

  // Check if event has already started
  const hasEventStarted = (startTime: string) => {
    const eventStart = new Date(startTime);
    const now = new Date();

    return now > eventStart;
  };

  // Check if event has already ended
  const hasEventEnded = (endTime: string) => {
    const eventEnd = new Date(endTime);
    const now = new Date();

    return now > eventEnd;
  };

  // Handle loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Handle error state
  if (isError) {
    toast.error("Failed to load event details");
    router.push("/events");
    return null;
  }

  // Handle empty event
  if (!event) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">Event not found</h3>
          <p className="text-muted-foreground mb-6">
            The event you're looking for might have been removed or is no longer
            available.
          </p>
          <Link href="/events" className="btn btn-primary">
            Back to Events
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const dateTime = formatEventDateTime(event.start_time, event.end_time);
  const isDeadlinePassed = isRegistrationClosed(event.registration_deadline);
  const isStarted = hasEventStarted(event.start_time);
  const isEnded = hasEventEnded(event.end_time);
  const isFull =
    event.max_participants !== null &&
    event.participant_count >= (event.max_participants ?? 0);

  // Determine registration status and button state
  const canRegister =
    !event.is_registered &&
    !isDeadlinePassed &&
    !isStarted &&
    !isEnded &&
    !isFull;

  let registrationStatus = "Registration Open";
  let registrationStatusClass = "text-green-500";

  if (event.is_registered) {
    registrationStatus = "You are registered";
    registrationStatusClass = "text-primary";
  } else if (isEnded) {
    registrationStatus = "Event has ended";
    registrationStatusClass = "text-red-500";
  } else if (isStarted) {
    registrationStatus = "Event in progress";
    registrationStatusClass = "text-amber-500";
  } else if (isDeadlinePassed) {
    registrationStatus = "Registration closed";
    registrationStatusClass = "text-red-500";
  } else if (isFull) {
    registrationStatus = "Event is full";
    registrationStatusClass = "text-red-500";
  }

  return (
    <DashboardLayout>
      {/* Back button */}
      <Link
        href="/events"
        className="inline-flex items-center text-sm text-blue-100/70 hover:text-white mb-6 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
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
        Back to all events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event details */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 overflow-hidden mb-6">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-indigo-900/30 to-slate-800/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-indigo-500 opacity-20"
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

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-700/30">
              {event.event_type}
            </span>
            {event.is_virtual && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/30">
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
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700/30">
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

          <h1 className="text-3xl font-bold mb-4 text-white">{event.title}</h1>

          <div className="text-blue-100/70 mb-8 whitespace-pre-line">
            <p>{event.description}</p>
          </div>

          {/* Badge rewards section */}
          {event.badges && event.badges.length > 0 && (
            <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 p-6">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center">
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Badge Rewards
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {event.badges.map((badge) => (
                  <div key={badge.id} className="text-center group">
                    <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-600/30 p-1 mb-3 overflow-hidden shadow-lg shadow-indigo-900/20 group-hover:shadow-indigo-500/30 transition-all duration-300">
                      {badge.image_url ? (
                        <img
                          src={badge.image_url}
                          alt={badge.name}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-900">
                          <span className="text-white font-bold text-xl">
                            {badge.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-white group-hover:text-indigo-300 transition-colors duration-200">
                      {badge.name}
                    </p>
                    <p className="text-sm text-blue-100/60">
                      {badge.points} points
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Registration and event info */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-indigo-700/20 shadow-lg shadow-indigo-900/10 sticky top-24">
            <div className="p-6 border-b border-indigo-900/30">
              <h2 className="text-xl font-bold text-white flex items-center">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Event Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Registration status */}
              <div className="text-center py-2">
                {(() => {
                  const statusClass = registrationStatus.includes("Registered")
                    ? "text-green-400"
                    : registrationStatus.includes("full")
                    ? "text-red-400"
                    : registrationStatus.includes("closed")
                    ? "text-red-400"
                    : registrationStatus.includes("progress")
                    ? "text-orange-400"
                    : registrationStatus.includes("ended")
                    ? "text-red-400"
                    : "text-indigo-400";

                  return (
                    <p className={`font-medium ${statusClass}`}>
                      {registrationStatus}
                    </p>
                  );
                })()}
              </div>

              <div className="space-y-4 divide-y divide-indigo-900/30">
                <div className="pt-4">
                  <p className="text-sm text-blue-100/60 mb-1">Date</p>
                  <div className="flex items-center">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="font-medium text-white">{dateTime.date}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-blue-100/60 mb-1">Time</p>
                  <div className="flex items-center">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="font-medium text-white">{dateTime.time}</p>
                  </div>
                </div>

                {event.location && (
                  <div className="pt-4">
                    <p className="text-sm text-blue-100/60 mb-1">Location</p>
                    <div className="flex items-center">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="font-medium text-white">{event.location}</p>
                    </div>
                  </div>
                )}

                {event.max_participants && (
                  <div className="pt-4">
                    <p className="text-sm text-blue-100/60 mb-1">
                      Participants
                    </p>
                    <div className="flex items-center">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="font-medium text-white">
                        {event.participant_count} / {event.max_participants}{" "}
                        registered
                      </p>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className={`rounded-full h-2 ${
                          isFull
                            ? "bg-gradient-to-r from-red-500 to-red-400"
                            : "bg-gradient-to-r from-indigo-500 to-indigo-400"
                        }`}
                        style={{
                          width: `${Math.min(
                            (event.participant_count / event.max_participants) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {event.registration_deadline && (
                  <div className="pt-4">
                    <p className="text-sm text-blue-100/60 mb-1">
                      Registration Deadline
                    </p>
                    <div className="flex items-center">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="font-medium text-white">
                        {new Date(
                          event.registration_deadline
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          event.registration_deadline
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {event.special_reward && (
                <div className="pt-4 mt-4">
                  <div className="rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-700/30 p-4">
                    <h3 className="font-semibold flex items-center text-purple-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
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
                    </h3>
                    <p className="text-sm mt-2 text-blue-100/70">
                      {event.special_reward}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 mt-4">
                {canRegister ? (
                  <button
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                    className="w-full py-2.5 px-4 rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-600 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg shadow-indigo-500/20 transition-all duration-200"
                  >
                    {registerMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        Registering...
                      </div>
                    ) : (
                      "Register for Event"
                    )}
                  </button>
                ) : event.is_registered ? (
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-green-900/30 to-green-700/30 rounded-lg border border-green-700/30 p-4 mb-4">
                      <div className="flex items-center justify-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-400"
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
                      </div>
                      <p className="font-medium text-green-400">
                        You are registered for this event!
                      </p>
                      {event.is_virtual && (
                        <p className="text-sm mt-2 text-blue-100/70">
                          Check your email for event details and access
                          information.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        window.open(
                          "data:text/calendar;charset=utf-8," +
                            encodeURIComponent(`BEGIN:VCALENDAR
                        VERSION:2.0
                        CALSCALE:GREGORIAN
                        BEGIN:VEVENT
                          SUMMARY:${event.title}
                          DTSTART:${new Date(event.start_time)
                            .toISOString()
                            .replace(/[-:]/g, "")
                            .replace(/\.\d{3}/g, "")}
                          DTEND:${new Date(event.end_time)
                            .toISOString()
                            .replace(/[-:]/g, "")
                            .replace(/\.\d{3}/g, "")}
                          LOCATION:${event.location ?? "Virtual Event"}
                          DESCRIPTION:${event.description?.substring(0, 200)}${
                              event.description?.length > 200 ? "..." : ""
                            }
                        END:VEVENT
                        END:VCALENDAR`),
                          "event.ics"
                        )
                      }
                      className="py-2.5 px-4 rounded-lg border border-indigo-700/30 bg-slate-800/50 text-indigo-300 hover:bg-indigo-900/30 transition-all duration-200 shadow-md inline-flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
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
                      Add to Calendar
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={true}
                    className="w-full py-2.5 px-4 rounded-lg border border-indigo-700/20 bg-slate-800/30 text-indigo-300/50 cursor-not-allowed"
                  >
                    {isEnded
                      ? "Event has ended"
                      : isStarted
                      ? "Event in progress"
                      : isDeadlinePassed
                      ? "Registration closed"
                      : isFull
                      ? "Event is full"
                      : "Registration unavailable"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
