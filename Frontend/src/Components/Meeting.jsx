import React, { useState } from "react";
import { FaHandsHelping, FaPaperPlane } from "react-icons/fa";

const topics = [
  "Career Guidance",
  "Resume Review",
  "Interview Prep",
  "Higher Studies",
  "Startup Advice",
];

const preferredModes = ["In-person", "Phone call", "Email", "Chat", "Flexible"];

function Mentorship() {
  const [request, setRequest] = useState({
    topic: topics[0],
    mode: "Flexible",
    message: "",
  });

  const [requests, setRequests] = useState([
    {
      id: 1,
      topic: "Resume Review",
      mode: "Email",
      status: "Pending",
      message: "Looking for feedback on my software engineering resume.",
    },
    {
      id: 2,
      topic: "Career Guidance",
      mode: "Phone call",
      status: "Accepted",
      message: "Need guidance about moving from college projects to internships.",
    },
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRequest((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!request.message.trim()) return;

    setRequests((current) => [
      {
        id: Date.now(),
        ...request,
        status: "Pending",
      },
      ...current,
    ]);
    setRequest({ topic: topics[0], mode: "Flexible", message: "" });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
            Mentorship
          </p>
          <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
            Request guidance from the CMRIT network.
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
            Ask alumni or faculty for help with careers, resumes, interviews,
            higher studies, or startup ideas through the mode that works best
            for you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
                <FaHandsHelping />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  New mentorship request
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  Choose a topic and preferred response mode.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-600">
                  Topic
                </span>
                <select
                  name="topic"
                  value={request.topic}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {topics.map((topic) => (
                    <option key={topic}>{topic}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-600">
                  Preferred mode
                </span>
                <select
                  name="mode"
                  value={request.mode}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {preferredModes.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-600">
                  Request message
                </span>
                <textarea
                  name="message"
                  value={request.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Briefly explain what guidance you need."
                  className={inputClass}
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 font-extrabold text-white transition hover:bg-blue-800"
              >
                <FaPaperPlane /> Submit Request
              </button>
            </div>
          </form>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">
              Requests
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              Your mentorship requests
            </h2>

            <div className="mt-5 space-y-4">
              {requests.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900">
                        {item.topic}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        Preferred mode: {item.mode}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                    {item.message}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Mentorship;
