import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaAward,
  FaBookOpen,
  FaBriefcase,
  FaComments,
  FaDonate,
  FaEdit,
  FaHeart,
  FaPaperPlane,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUserCheck,
  FaUserPlus,
} from "react-icons/fa";
import { getUserData } from "../services/authService";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
      <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
        {description}
      </p>
    </div>
  );
}

function FeatureShell({ children }) {
  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">{children}</section>
    </main>
  );
}

export function Connections() {
  const requests = [
    { name: "Rohan Mehta", batch: "2019", role: "Data Engineer", status: "Pending" },
    { name: "Aditi Rao", batch: "2021", role: "UX Designer", status: "Accepted" },
    { name: "Karthik N", batch: "2017", role: "Engineering Manager", status: "Suggested" },
  ];

  return (
    <FeatureShell>
      <PageHeader
        eyebrow="Connections"
        title="Build your CMRIT alumni circle."
        description="Send, accept, and manage connection requests inside the alumni community."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {requests.map((request) => (
          <article key={request.name} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-950 font-extrabold text-white">
              {request.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
            </div>
            <h2 className="font-extrabold text-slate-900">{request.name}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Batch {request.batch} · {request.role}
            </p>
            <span className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
              {request.status}
            </span>
            <button className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 font-extrabold text-white transition hover:bg-blue-800">
              <FaUserPlus /> Connect
            </button>
          </article>
        ))}
      </div>
    </FeatureShell>
  );
}

export function CareerReferrals() {
  const referrals = [
    { role: "Frontend Engineer", company: "Nexora", type: "Referral open" },
    { role: "Data Analyst", company: "FinEdge", type: "Hiring lead" },
    { role: "Marketing Intern", company: "BrightHire", type: "Internship" },
  ];

  return (
    <FeatureShell>
      <PageHeader
        eyebrow="Career referrals"
        title="Find opportunities shared by alumni."
        description="Request referral support, browse alumni-posted openings, and track career leads."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Request a referral</h2>
          <div className="mt-5 space-y-4">
            <input className={inputClass} placeholder="Target role" />
            <input className={inputClass} placeholder="Company" />
            <textarea className={inputClass} rows="5" placeholder="Why are you a good fit?" />
            <button type="button" className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 font-extrabold text-white">
              <FaPaperPlane /> Submit Request
            </button>
          </div>
        </form>
        <section className="grid gap-4">
          {referrals.map((item) => (
            <article key={item.role} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <FaBriefcase className="mb-4 text-2xl text-blue-700" />
              <h2 className="font-extrabold text-slate-900">{item.role}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">{item.company}</p>
              <span className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                {item.type}
              </span>
            </article>
          ))}
        </section>
      </div>
    </FeatureShell>
  );
}

export function AlumniStories() {
  const stories = [
    { title: "From CMRIT to Product Leadership", author: "Priya Sharma", tag: "Career Journey" },
    { title: "Building a Startup After Graduation", author: "Nisha Menon", tag: "Founder Story" },
    { title: "Higher Studies Roadmap for Final Years", author: "Arjun Kumar", tag: "Higher Studies" },
  ];

  return (
    <FeatureShell>
      <PageHeader
        eyebrow="Alumni stories"
        title="Celebrate journeys from the CMRIT community."
        description="Share career moves, startup lessons, higher-study paths, and achievements."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <span className="mb-4 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-700">
              {story.tag}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">{story.title}</h2>
            <p className="mt-3 text-sm font-semibold text-slate-500">By {story.author}</p>
            <button className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-extrabold text-slate-900">
              Read Story
            </button>
          </article>
        ))}
      </div>
    </FeatureShell>
  );
}

export function DiscussionForum() {
  const topics = [
    { title: "Placement preparation for 2026 batch", replies: 18, category: "Careers" },
    { title: "Study abroad application timeline", replies: 11, category: "Higher Studies" },
    { title: "Startup ideas from campus projects", replies: 7, category: "Entrepreneurship" },
  ];

  return (
    <FeatureShell>
      <PageHeader
        eyebrow="Discussion forum"
        title="Start useful conversations with alumni."
        description="Create branch-wise, batch-wise, and topic-wise discussions for the community."
      />
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <button className="mb-5 inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-blue-700 px-4 font-extrabold text-white">
          <FaPlus /> New Topic
        </button>
        <div className="space-y-4">
          {topics.map((topic) => (
            <article key={topic.title} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
              <div>
                <h2 className="font-extrabold text-slate-900">{topic.title}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{topic.category}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                <FaComments /> {topic.replies} replies
              </span>
            </article>
          ))}
        </div>
      </div>
    </FeatureShell>
  );
}

export function ResourceLibrary() {
  const resources = [
    { title: "Resume Template Pack", type: "Career" },
    { title: "Interview Prep Checklist", type: "Placements" },
    { title: "Higher Studies SOP Guide", type: "Higher Studies" },
  ];

  return (
    <FeatureShell>
      <PageHeader
        eyebrow="Resource library"
        title="Share and discover alumni resources."
        description="Collect templates, guides, prep material, and student-friendly resources in one place."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {resources.map((resource) => (
          <article key={resource.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <FaBookOpen className="mb-4 text-2xl text-blue-700" />
            <h2 className="font-extrabold text-slate-900">{resource.title}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">{resource.type}</p>
            <button className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-extrabold text-slate-900">
              View Resource
            </button>
          </article>
        ))}
      </div>
    </FeatureShell>
  );
}

export function Contributions() {
  const funds = [
    { title: "Student Scholarship Fund", amount: "₹4.2L pledged" },
    { title: "Lab Equipment Support", amount: "₹2.8L pledged" },
    { title: "Club and Event Support", amount: "₹1.6L pledged" },
  ];

  return (
    <FeatureShell>
      <PageHeader
        eyebrow="Contributions"
        title="Support scholarships, labs, and student initiatives."
        description="Let alumni contribute to meaningful college initiatives with clear purpose and visibility."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {funds.map((fund) => (
          <article key={fund.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <FaDonate className="mb-4 text-2xl text-blue-700" />
            <h2 className="font-extrabold text-slate-900">{fund.title}</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">{fund.amount}</p>
            <button className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 font-extrabold text-white">
              <FaHeart /> Contribute
            </button>
          </article>
        ))}
      </div>
    </FeatureShell>
  );
}

export function RecognitionWall() {
  const user = getUserData() || {};
  const isAdmin = user.role === "admin";
  const emptyRecognition = {
    name: "",
    achievement: "",
    year: new Date().getFullYear().toString(),
    batch: "",
    category: "Achievement",
  };
  const [recognitionForm, setRecognitionForm] = useState(emptyRecognition);
  const [recognitionFile, setRecognitionFile] = useState(null);
  const [honorees, setHonorees] = useState([]);
  const [editingRecognitionId, setEditingRecognitionId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecognitions = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/recognition");
        setHonorees(
          response.data.data.recognitions.map((item) => ({
            id: item._id,
            name: item.name,
            achievement: item.achievement,
            year: item.year,
            batch: item.batch || "",
            photoUrl: item.photoUrl || "",
            fileType: item.fileType || "",
            originalFileName: item.originalFileName || "",
            category: item.category || "Achievement",
          }))
        );
      } catch (error) {
        console.error("Recognition fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecognitions();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecognitionForm((current) => ({ ...current, [name]: value }));
  };

  const formatRecognition = (item) => ({
    id: item._id,
    name: item.name,
    achievement: item.achievement,
    year: item.year,
    batch: item.batch || "",
    photoUrl: item.photoUrl || "",
    fileType: item.fileType || "",
    originalFileName: item.originalFileName || "",
    category: item.category || "Achievement",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !recognitionForm.name.trim() ||
      !recognitionForm.achievement.trim() ||
      !recognitionForm.year.trim()
    ) {
      return;
    }

    try {
      if (editingRecognitionId) {
        const formData = new FormData();
        Object.entries(recognitionForm).forEach(([key, value]) => {
          formData.append(key, value);
        });
        if (recognitionFile) formData.append("file", recognitionFile);

        const response = await axios.patch(
          `/recognition/${editingRecognitionId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const updated = formatRecognition(response.data.data.recognition);
        setHonorees((current) =>
          current.map((item) =>
            item.id === editingRecognitionId ? updated : item
          )
        );
      } else {
        const formData = new FormData();
        Object.entries(recognitionForm).forEach(([key, value]) => {
          formData.append(key, value);
        });
        if (recognitionFile) formData.append("file", recognitionFile);

        const response = await axios.post("/recognition", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const created = formatRecognition(response.data.data.recognition);
        setHonorees((current) => [created, ...current]);
      }

      setRecognitionForm(emptyRecognition);
      setRecognitionFile(null);
      setEditingRecognitionId(null);
    } catch (error) {
      console.error("Recognition save failed:", error);
    }
  };

  const handleEditRecognition = (item) => {
    setEditingRecognitionId(item.id);
    setRecognitionForm({
      name: item.name,
      achievement: item.achievement,
      year: item.year,
      batch: item.batch || "",
      category: item.category,
    });
    setRecognitionFile(null);
  };

  const handleCancelEdit = () => {
    setEditingRecognitionId(null);
    setRecognitionForm(emptyRecognition);
    setRecognitionFile(null);
  };

  const handleDeleteRecognition = async (recognitionId) => {
    try {
      await axios.delete(`/recognition/${recognitionId}`);
      setHonorees((current) =>
        current.filter((item) => item.id !== recognitionId)
      );
      if (editingRecognitionId === recognitionId) handleCancelEdit();
    } catch (error) {
      console.error("Recognition delete failed:", error);
    }
  };

  return (
    <FeatureShell>
      <PageHeader
        eyebrow="Recognition wall"
        title="Celebrate alumni achievements."
        description="Highlight awards, promotions, startups, publications, and community contributions."
      />

      {loading && (
        <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500 shadow-sm">
          Loading recognitions from database...
        </section>
      )}

      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <FaAward />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {editingRecognitionId ? "Edit recognition" : "Add recognition"}
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                Highlight alumni achievements, awards, launches, or
                contributions.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="name"
              value={recognitionForm.name}
              onChange={handleChange}
              placeholder="Alumni name"
              className={inputClass}
            />
            <input
              name="year"
              value={recognitionForm.year}
              onChange={handleChange}
              placeholder="Achievement year, e.g. 2026"
              className={inputClass}
            />
            <input
              name="batch"
              value={recognitionForm.batch}
              onChange={handleChange}
              placeholder="Batch / passing year, e.g. 2022"
              className={inputClass}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Alumni photo / file
              </span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                onChange={(event) => setRecognitionFile(event.target.files[0] || null)}
                className={inputClass}
              />
            </label>
            <select
              name="category"
              value={recognitionForm.category}
              onChange={handleChange}
              className={inputClass}
            >
              <option>Achievement</option>
              <option>Promotion</option>
              <option>Award</option>
              <option>Startup</option>
              <option>Publication</option>
              <option>Community Contribution</option>
            </select>
            <textarea
              name="achievement"
              value={recognitionForm.achievement}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the achievement."
              className={`${inputClass} md:col-span-2`}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 font-extrabold text-white transition hover:bg-blue-800"
            >
              <FaPaperPlane />{" "}
              {editingRecognitionId ? "Update Recognition" : "Publish Recognition"}
            </button>
            {editingRecognitionId && (
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

      <div className="grid gap-4 md:grid-cols-3">
        {honorees.map((person) => (
          <article key={person.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-950 text-lg font-extrabold text-white">
                {person.photoUrl && person.fileType !== "application/pdf" ? (
                  <img
                    src={person.photoUrl}
                    alt={`${person.name} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  person.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>
              <FaAward className="text-3xl text-blue-700" />
            </div>
            <h2 className="font-extrabold text-slate-900">{person.name}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{person.achievement}</p>
            {person.photoUrl && person.fileType === "application/pdf" && (
              <a
                href={person.photoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs font-extrabold text-slate-900 transition hover:border-slate-900"
              >
                View uploaded PDF
              </a>
            )}
            <span className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
              {person.category} · {person.year}
            </span>
            <span className="ml-2 mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">
              Batch {person.batch || "Not added"}
            </span>
            {isAdmin && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleEditRecognition(person)}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 font-extrabold text-white transition hover:bg-blue-800"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRecognition(person.id)}
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 font-extrabold text-red-700 transition hover:bg-red-100"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {!loading && !honorees.length && (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">
            No recognitions posted yet
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Alumni achievements will appear here after an admin publishes them.
          </p>
        </section>
      )}
    </FeatureShell>
  );
}
