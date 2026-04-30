import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBullhorn,
  FaEdit,
  FaPaperPlane,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { getUserData } from "../services/authService";

const audiences = ["All Alumni", "Specific Batch", "Specific Branch", "Faculty", "College"];

const emptyAnnouncement = {
  title: "",
  audience: audiences[0],
  message: "",
};

const formatAnnouncementForUi = (item) => ({
  id: item._id,
  title: item.title,
  audience: item.audience,
  message: item.message,
  status: "Published",
});

function Announcements() {
  const user = getUserData() || {};
  const isAdmin = user.role === "admin";
  const [announcement, setAnnouncement] = useState(emptyAnnouncement);
  const [items, setItems] = useState([]);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/announcements");
        setItems(response.data.data.announcements.map(formatAnnouncementForUi));
      } catch (error) {
        console.error("Announcements fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnnouncement((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!announcement.title.trim() || !announcement.message.trim()) return;

    try {
      if (editingAnnouncementId) {
        const response = await axios.patch(
          `/announcements/${editingAnnouncementId}`,
          announcement
        );
        const updated = formatAnnouncementForUi(response.data.data.announcement);
        setItems((current) =>
          current.map((item) =>
            item.id === editingAnnouncementId ? updated : item
          )
        );
      } else {
        const response = await axios.post("/announcements", announcement);
        const created = formatAnnouncementForUi(response.data.data.announcement);
        setItems((current) => [created, ...current]);
      }

      setAnnouncement(emptyAnnouncement);
      setEditingAnnouncementId(null);
    } catch (error) {
      console.error("Announcement save failed:", error);
    }
  };

  const handleEditAnnouncement = (item) => {
    setEditingAnnouncementId(item.id);
    setAnnouncement({
      title: item.title,
      audience: item.audience,
      message: item.message,
    });
  };

  const handleCancelEdit = () => {
    setEditingAnnouncementId(null);
    setAnnouncement(emptyAnnouncement);
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      await axios.delete(`/announcements/${announcementId}`);
      setItems((current) =>
        current.filter((item) => item.id !== announcementId)
      );
      if (editingAnnouncementId === announcementId) handleCancelEdit();
    } catch (error) {
      console.error("Announcement delete failed:", error);
    }
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
          {loading && (
            <p className="mt-3 text-sm font-semibold text-teal-100">
              Loading announcements from database...
            </p>
          )}
        </div>

        {isAdmin && (
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
                  {editingAnnouncementId ? "Edit announcement" : "New announcement"}
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  {editingAnnouncementId
                    ? "Update the selected announcement."
                    : "Choose an audience and prepare the update."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-600">
                  Message
                </span>
                <textarea
                  name="message"
                  value={announcement.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write the update for the selected audience."
                  className={inputClass}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 font-extrabold text-white transition hover:bg-blue-800"
              >
                <FaPaperPlane />{" "}
                {editingAnnouncementId ? "Update Announcement" : "Save Announcement"}
              </button>
              {editingAnnouncementId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 font-extrabold text-slate-900 transition hover:border-slate-900"
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">
            Updates
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            Recent announcements
          </h2>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
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

                {isAdmin && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleEditAnnouncement(item)}
                      className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 font-extrabold text-white transition hover:bg-blue-800"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(item.id)}
                      className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 font-extrabold text-red-700 transition hover:bg-red-100"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {!loading && !items.length && (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <h3 className="text-xl font-extrabold text-slate-900">
                No announcements posted yet
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Announcements will appear here after an admin publishes them.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Announcements;
