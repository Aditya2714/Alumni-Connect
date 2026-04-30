import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaBuilding, FaMapMarkerAlt, FaSearch, FaUserPlus } from "react-icons/fa";

const fallbackAlumni = [
  {
    id: 1,
    name: "Priya Sharma",
    batch: "2020",
    branch: "Computer Science",
    role: "Product Manager",
    company: "Google",
    location: "Bengaluru",
    initials: "PS",
  },
  {
    id: 2,
    name: "Arjun Kumar",
    batch: "2018",
    branch: "Information Science",
    role: "Software Engineer",
    company: "Microsoft",
    location: "Hyderabad",
    initials: "AK",
  },
  {
    id: 3,
    name: "Nisha Menon",
    batch: "2022",
    branch: "Electronics",
    role: "Founder",
    company: "SkillBridge",
    location: "Mumbai",
    initials: "NM",
  },
];

function SearchPeople() {
  const [alumni, setAlumni] = useState(fallbackAlumni);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    batch: "",
    branch: "",
    location: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/alumni");
        const alumniList = response.data.data.alumni.map((person) => {
          const name = [person.firstName, person.lastName].filter(Boolean).join(" ") || person.email;
          return {
            id: person._id,
            name,
            batch: person.endYear ? String(person.endYear) : "Not added",
            branch: person.branch || "Not added",
            role:
              person.designation ||
              person.workExperiences?.[0]?.workTitle ||
              "Alumni",
            company:
              person.company ||
              person.workExperiences?.[0]?.company ||
              "Not added",
            location: person.location || "Not added",
            imageUrl: person.imageUrl,
            initials: name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
          };
        });
        setAlumni(alumniList);
      } catch (error) {
        console.error("Alumni directory fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const filteredAlumni = useMemo(() => {
    const keyword = filters.keyword.toLowerCase();
    return alumni.filter((person) => {
      const searchable = `${person.name} ${person.role} ${person.company} ${person.branch} ${person.location}`.toLowerCase();
      return (
        (!keyword || searchable.includes(keyword)) &&
        (!filters.batch || person.batch.includes(filters.batch)) &&
        (!filters.branch || person.branch.toLowerCase().includes(filters.branch.toLowerCase())) &&
        (!filters.location || person.location.toLowerCase().includes(filters.location.toLowerCase()))
      );
    });
  }, [filters]);

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
            Alumni directory
          </p>
          <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
            Find alumni across batches, branches, and careers.
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
            Discover classmates, mentors, founders, and industry professionals
            from the CMRIT alumni network.
          </p>
          {loading && (
            <p className="mt-3 text-sm font-semibold text-teal-100">
              Loading alumni from database...
            </p>
          )}
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Search
              </span>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleChange}
                  placeholder="Name, company, role, branch..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Batch
              </span>
              <input
                name="batch"
                value={filters.batch}
                onChange={handleChange}
                placeholder="2020"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Location
              </span>
              <input
                name="location"
                value={filters.location}
                onChange={handleChange}
                placeholder="Bengaluru"
                className={inputClass}
              />
            </label>
            <label className="block md:col-span-4">
              <span className="mb-2 block text-sm font-bold text-slate-600">
                Branch
              </span>
              <input
                name="branch"
                value={filters.branch}
                onChange={handleChange}
                placeholder="Computer Science"
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {filteredAlumni.map((person) => (
            <article
              key={person.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-950 text-lg font-extrabold text-white">
                  {person.imageUrl ? (
                    <img
                      src={person.imageUrl}
                      alt={`${person.name} profile`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    person.initials
                  )}
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900">{person.name}</h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Batch {person.batch} · {person.branch}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm font-semibold text-slate-500">
                <p className="flex items-center gap-2">
                  <FaBuilding className="text-blue-700" /> {person.role} at {person.company}
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-700" /> {person.location}
                </p>
              </div>
              <button className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 font-extrabold text-white transition hover:bg-blue-800">
                <FaUserPlus /> Connect
              </button>
            </article>
          ))}
        </section>
        {!filteredAlumni.length && (
          <section className="rounded-lg border border-slate-200 bg-white p-6 text-center font-bold text-slate-500">
            No alumni found for the selected filters.
          </section>
        )}
      </section>
    </main>
  );
}

export default SearchPeople;
