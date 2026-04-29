import React, { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

function Event() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Alumni Leadership Summit",
      date: "14 May 2026",
      time: "10:00 AM",
      location: "CMRIT Auditorium",
      type: "Campus Event",
      attendees: 128,
      status: "Register",
      description:
        "A campus meet for alumni mentors, student leaders, and faculty coordinators.",
    },
    {
      id: 2,
      title: "Career Night: Tech & Product",
      date: "28 May 2026",
      time: "7:00 PM",
      location: "Online",
      type: "Webinar",
      attendees: 86,
      status: "Register",
      description:
        "An alumni-led discussion on product roles, software careers, and referrals.",
    },
    {
      id: 3,
      title: "Batch Reunion Mixer",
      date: "08 Jun 2026",
      time: "5:30 PM",
      location: "Campus Lawn",
      type: "Reunion",
      attendees: 64,
      status: "Registered",
      description:
        "A relaxed evening for alumni to reconnect with classmates and faculty.",
    },
  ]);

  const handleRegister = (eventId) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? {
              ...event,
              status: event.status === "Registered" ? "Register" : "Registered",
              attendees:
                event.status === "Registered"
                  ? Math.max(event.attendees - 1, 0)
                  : event.attendees + 1,
            }
          : event
      )
    );
  };

  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
            Events
          </p>
          <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
            Discover alumni meets, webinars, and reunions.
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
            Stay connected with the CMRIT community through campus events,
            online sessions, and batch gatherings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Upcoming</p>
            <strong className="mt-2 block text-3xl font-extrabold text-slate-900">
              {events.length}
            </strong>
            <span className="mt-1 block text-sm font-semibold text-slate-500">
              active event listings
            </span>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Attendees</p>
            <strong className="mt-2 block text-3xl font-extrabold text-slate-900">
              {events.reduce((total, event) => total + event.attendees, 0)}
            </strong>
            <span className="mt-1 block text-sm font-semibold text-slate-500">
              alumni and students
            </span>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Registered</p>
            <strong className="mt-2 block text-3xl font-extrabold text-slate-900">
              {events.filter((event) => event.status === "Registered").length}
            </strong>
            <span className="mt-1 block text-sm font-semibold text-slate-500">
              events selected by you
            </span>
          </article>
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                {event.type}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                {event.title}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                {event.description}
              </p>

              <div className="mt-5 space-y-2 text-sm font-semibold text-slate-500">
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-700" /> {event.date} ·{" "}
                  {event.time}
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-700" /> {event.location}
                </p>
                <p className="flex items-center gap-2">
                  <FaUsers className="text-blue-700" /> {event.attendees} attending
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleRegister(event.id)}
                className={`mt-5 inline-flex min-h-[42px] w-full items-center justify-center rounded-lg px-4 font-extrabold transition ${
                  event.status === "Registered"
                    ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                    : "bg-blue-700 text-white hover:bg-blue-800"
                }`}
              >
                {event.status}
              </button>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default Event;
