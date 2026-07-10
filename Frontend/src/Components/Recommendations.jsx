import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBrain, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.post("/ml/recommendations", { topN: 10, algorithm: "combined" });
        setRecommendations(data.data.recommendations);
      } catch (err) {
        console.error("Recommendation fetch failed:", err);
        setError("Recommendations unavailable. Make sure the ML service is running on port 5001.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-purple-500/20 text-purple-400">
              <FaBrain />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
                Recommended for you
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
            Alumni you might know based on your branch, skills, work experience, and interests.
          </p>
        </div>

        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-500">Finding the best matches...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900">No recommendations yet</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Complete your profile to get better recommendations.
            </p>
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-3">
          {recommendations.map((person) => (
            <article
              key={person.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={`${person.firstName} ${person.lastName}`}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-950 text-sm font-extrabold text-white">
                    {person.firstName?.[0]}{person.lastName?.[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-slate-900">
                    {person.firstName} {person.lastName}
                  </h3>
                  {person.designation && person.company && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                      <FaBuilding className="text-blue-700" /> {person.designation} at {person.company}
                    </p>
                  )}
                  {!person.company && person.designation && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                      <FaBuilding className="text-blue-700" /> {person.designation}
                    </p>
                  )}
                  {person.location && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                      <FaMapMarkerAlt className="text-blue-700" /> {person.location}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {person.branch && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                    {person.branch}
                  </span>
                )}
                {person.endYear && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">
                    Batch {person.endYear}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  {Math.round(person.score * 100)}% match
                </span>
                <button className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-extrabold text-slate-900 transition hover:border-slate-900">
                  View Profile
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default Recommendations;
