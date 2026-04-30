import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaAward,
  FaBriefcase,
  FaBullhorn,
  FaCalendarAlt,
  FaChartBar,
  FaClock,
  FaDatabase,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";

function AdminReports() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/admin/overview");
        setOverview(response.data.data.overview);
      } catch (error) {
        console.error("Reports fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const metrics = useMemo(() => {
    const data = overview || {
      users: 0,
      alumni: 0,
      admins: 0,
      events: 0,
      jobs: 0,
      announcements: 0,
      recognitions: 0,
      pendingAlumni: 0,
    };

    return [
      ["Total Users", data.users, "all registered accounts", FaUsers],
      ["Alumni Profiles", data.alumni, "profiles in directory", FaUserCheck],
      ["Pending Approvals", data.pendingAlumni, "self-registrations waiting", FaClock],
      ["Events", data.events, "admin-created events", FaCalendarAlt],
      ["Jobs", data.jobs, "admin-posted opportunities", FaBriefcase],
      ["Announcements", data.announcements, "published platform updates", FaBullhorn],
      ["Recognitions", data.recognitions, "alumni achievements highlighted", FaAward],
      ["Admin Accounts", data.admins, "platform managers", FaDatabase],
    ];
  }, [overview]);

  const maxValue = Math.max(...metrics.map((metric) => Number(metric[1]) || 0), 1);

  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
            Admin reports
          </p>
          <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
            Track platform activity and alumni engagement.
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
            Review live counts from MongoDB for users, alumni profiles,
            approvals, events, jobs, and admin activity.
          </p>
          {loading && (
            <p className="mt-3 text-sm font-semibold text-teal-100">
              Loading reports from database...
            </p>
          )}
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map(([label, value, note, Icon]) => (
            <article
              key={label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">{label}</p>
                  <strong className="mt-2 block text-3xl font-extrabold text-slate-900">
                    {value}
                  </strong>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
                  <Icon />
                </div>
              </div>
              <span className="mt-2 block text-sm font-semibold text-slate-500">
                {note}
              </span>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-700">
                <FaChartBar />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">
                  Activity summary
                </p>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Module-wise data
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {metrics.map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-600">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-700"
                      style={{
                        width: `${Math.max((Number(value) / maxValue) * 100, Number(value) ? 8 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">
              Review notes
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              What this report proves
            </h2>
            <ul className="mt-5 space-y-3 text-sm font-semibold leading-6 text-slate-500">
              <li>Admin can monitor real MongoDB-backed platform data.</li>
              <li>Approval queue shows pending alumni verification load.</li>
              <li>Events and jobs are tracked from admin-created records.</li>
              <li>Counts update as data is added, approved, edited, or deleted.</li>
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}

export default AdminReports;
