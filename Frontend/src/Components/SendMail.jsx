import React, { useState } from "react";
import { FaBullhorn, FaPaperPlane } from "react-icons/fa";

const audiences = ["All Alumni", "Specific Batch", "Specific Branch", "Faculty", "College"];

function Announcements() {
  const [announcement, setAnnouncement] = useState({
    title: "",
    audience: audiences[0],
    message: "",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      title: "Alumni Leadership Summit",
      audience: "All Alumni",
      message: "Registrations are open for the upcoming alumni leadership summit.",
      status: "Published",
    },
    {
      id: 2,
      title: "Career Night: Tech & Product",
      audience: "Specific Branch",
      message: "Computer Science alumni are invited to join the online career panel.",
      status: "Draft",
    },
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnnouncement((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!announcement.title.trim() || !announcement.message.trim()) return;

    setItems((current) => [
      {
        id: Date.now(),
        ...announcement,
        status: "Draft",
      },
      ...current,
    ]);
    setAnnouncement({ title: "", audience: audiences[0], message: "" });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
            Announcements
          </p>
          <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
            Share updates with the alumni community.
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
            Create targeted announcements for alumni, faculty, branches, and
            batches without making the feature feel like a raw email tool.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
                <FaBullhorn />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  New announcement
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  Choose an audience and prepare the update.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-600">
                  Title
                </span>
                <input
                  name="title"
                  value={announcement.title}
                  onChange={handleChange}
                  placeholder="Announcement title"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-600">
                  Audience
                </span>
                <select
                  name="audience"
                  value={announcement.audience}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {audiences.map((audience) => (
                    <option key={audience}>{audience}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-600">
                  Message
                </span>
                <textarea
                  name="message"
                  value={announcement.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write the update for the selected audience."
                  className={inputClass}
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 font-extrabold text-white transition hover:bg-blue-800"
              >
                <FaPaperPlane /> Save Announcement
              </button>
            </div>
          </form>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">
              Updates
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              Recent announcements
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        Audience: {item.audience}
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

export default Announcements;
