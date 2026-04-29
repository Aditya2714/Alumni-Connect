import React, { useState } from "react";
import { FaBriefcase, FaMapMarkerAlt, FaPaperPlane, FaPlus } from "react-icons/fa";

function Jobs() {
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    description: "",
  });

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Backend Developer",
      company: "FinEdge",
      location: "Pune",
      type: "Full-time",
      description: "Node.js role shared by a CMRIT alumnus. MongoDB experience preferred.",
      status: "Referral available",
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "Nexora",
      location: "Remote",
      type: "Full-time",
      description: "Early-career analytics role with SQL, dashboards, and reporting.",
      status: "Open",
    },
    {
      id: 3,
      title: "Marketing Intern",
      company: "BrightHire",
      location: "Bengaluru",
      type: "Internship",
      description: "Growth and content internship suitable for final-year students.",
      status: "New",
    },
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setJobForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!jobForm.title.trim() || !jobForm.company.trim()) return;

    setJobs((current) => [
      {
        id: Date.now(),
        ...jobForm,
        status: "Draft",
      },
      ...current,
    ]);
    setJobForm({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      description: "",
    });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
            Jobs
          </p>
          <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
            Explore opportunities shared by alumni.
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
            Browse openings, referral-friendly roles, internships, and career
            leads from the CMRIT network.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
                <FaPlus />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Post an opportunity
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  Share a job, internship, or referral lead.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                name="title"
                value={jobForm.title}
                onChange={handleChange}
                placeholder="Job title"
                className={inputClass}
              />
              <input
                name="company"
                value={jobForm.company}
                onChange={handleChange}
                placeholder="Company"
                className={inputClass}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="location"
                  value={jobForm.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className={inputClass}
                />
                <select
                  name="type"
                  value={jobForm.type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>Full-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                  <option>Referral</option>
                </select>
              </div>
              <textarea
                name="description"
                value={jobForm.description}
                onChange={handleChange}
                rows="5"
                placeholder="Role details, skills, eligibility, or application link."
                className={inputClass}
              />
              <button
                type="submit"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 font-extrabold text-white transition hover:bg-blue-800"
              >
                <FaPaperPlane /> Save Job Post
              </button>
            </div>
          </form>

          <section className="space-y-4">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                      {job.status}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {job.title}
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <FaBriefcase className="text-blue-700" /> {job.company} ·{" "}
                      {job.type}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <FaMapMarkerAlt className="text-blue-700" />{" "}
                      {job.location || "Location not specified"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                  {job.description || "No description added yet."}
                </p>
                <button className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-extrabold text-slate-900 transition hover:border-slate-900">
                  View Details
                </button>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}

export default Jobs;
