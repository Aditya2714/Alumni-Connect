import {
  FaBriefcase,
  FaAward,
  FaBookOpen,
  FaCalendarAlt,
  FaComments,
  FaDonate,
  FaHandsHelping,
  FaIdBadge,
  FaNewspaper,
  FaSearch,
  FaUpload,
  FaUserCircle,
  FaUserPlus,
  FaUsers,
  FaBullhorn,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { getUserData } from "../services/authService";

function Dashboard() {
  const user = getUserData() || {};
  const {
    role,
    email,
    firstName,
    lastName,
    name,
    adminName,
    branch,
    degree,
    endYear,
    profileImage,
    avatar,
  } = user;

  const displayName =
    role === "admin" ? adminName : [firstName, lastName].filter(Boolean).join(" ") || name || "CMRIT member";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const photoUrl = profileImage || avatar || user.image || user.photoUrl;

  const roleLabel = role || "member";
  const canBulkImport = ["admin", "college"].includes(role);

  const roleSummary = {
    alumni: "Reconnect with classmates, explore events, and discover career opportunities shared by your network.",
    faculty: "Guide alumni engagement, support student connections, and keep department updates moving.",
    admin: "Oversee alumni records, communication, events, and platform activity from one place.",
    college: "Coordinate institutional updates, bulk imports, and alumni outreach with a clear workspace.",
  };

  const sidebarLinks = [
    { label: "Dashboard", to: "/dashboard", icon: FaIdBadge },
    { label: "Profile", to: "/profile", icon: FaUserCircle },
    { label: "Alumni Directory", to: "/alumni-directory", icon: FaSearch },
    { label: "Connections", to: "/connections", icon: FaUserPlus },
    { label: "Career Referrals", to: "/career-referrals", icon: FaBriefcase },
    { label: "Alumni Stories", to: "/alumni-stories", icon: FaUsers },
    { label: "Events", to: "/events", icon: FaCalendarAlt },
    { label: "Jobs", to: "/jobs", icon: FaBriefcase },
    { label: "Forum", to: "/forum", icon: FaComments },
    { label: "Resources", to: "/resources", icon: FaBookOpen },
    { label: "Contributions", to: "/contributions", icon: FaDonate },
    { label: "Recognition", to: "/recognition", icon: FaAward },
    { label: "Mentorship", to: "/mentorship", icon: FaHandsHelping },
    { label: "Announcements", to: "/announcements", icon: FaBullhorn },
    ...(canBulkImport
      ? [{ label: "Bulk Import", to: "/bulk-upload", icon: FaUpload }]
      : []),
  ];

  const quickActions = [
    {
      title: role === "admin" ? "Manage Alumni" : "Find Alumni",
      description: "Search by name, branch, batch, role, or company.",
      to: "/alumni-directory",
      icon: FaSearch,
    },
    {
      title: "Upcoming Events",
      description: "Review reunions, campus meets, webinars, and mentor sessions.",
      to: "/events",
      icon: FaCalendarAlt,
    },
    {
      title: role === "college" ? "Campus Updates" : "Career Opportunities",
      description: "Explore job leads, referrals, and community updates.",
      to: role === "college" ? "/newsletter" : "/jobs",
      icon: role === "college" ? FaNewspaper : FaBriefcase,
    },
    {
      title: role === "alumni" ? "Request Mentorship" : "Guide Mentorship",
      description: "Ask for guidance or support alumni mentorship requests.",
      to: "/mentorship",
      icon: FaHandsHelping,
    },
    {
      title: "Connections",
      description: "Send and manage alumni connection requests.",
      to: "/connections",
      icon: FaUserPlus,
    },
    {
      title: "Resources",
      description: "Find templates, guides, and shared alumni material.",
      to: "/resources",
      icon: FaBookOpen,
    },
    {
      title: "Alumni Stories",
      description: "Read achievements, journeys, and startup stories.",
      to: "/alumni-stories",
      icon: FaUsers,
    },
    {
      title: "Recognition Wall",
      description: "Celebrate promotions, awards, publications, and launches.",
      to: "/recognition",
      icon: FaAward,
    },
  ];

  const stats = [
    { label: "Network", value: "5k+", note: "registered members" },
    { label: "Events", value: "120+", note: "campus and online meets" },
    { label: "Jobs", value: "800+", note: "shared opportunities" },
  ];

  const upcomingEvents = [
    {
      title: "Alumni Leadership Summit",
      date: "14 May",
      detail: "Campus meet for alumni mentors, student leaders, and faculty coordinators.",
    },
    {
      title: "Career Night: Tech & Product",
      date: "28 May",
      detail: "Online alumni panel with open Q&A and referral guidance.",
    },
  ];

  const jobHighlights = [
    {
      title: "Backend Developer",
      company: "FinEdge",
      detail: "Node.js role shared by the alumni network.",
    },
    {
      title: "Data Analyst",
      company: "Nexora",
      detail: "Early-career remote opportunity with dashboard work.",
    },
  ];

  return (
    <main className="bg-slate-50 px-4 py-6">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-700 text-sm font-extrabold text-white">
              AC
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Workspace</p>
              <p className="text-xs font-bold capitalize text-slate-500">{roleLabel}</p>
            </div>
          </div>

          <nav className="grid gap-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition ${
                      isActive
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`
                  }
                >
                  <Icon />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <section className="grid gap-5 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:grid-cols-[1fr_320px] md:p-8">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
                CMRIT alumni workspace
              </p>
              <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
                Welcome back, {displayName}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
                {roleSummary[role] || roleSummary.alumni}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-4">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`${displayName} profile`}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-lg font-extrabold text-slate-950">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-extrabold">{displayName}</p>
                  <p className="text-sm font-semibold capitalize text-slate-300">{roleLabel}</p>
                  <p className="truncate text-xs font-semibold text-slate-400">{email}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-300">
                <p>Branch: {branch || "Not added"}</p>
                <p>Degree: {degree || "Not added"}</p>
                <p>Batch: {endYear || "Not added"}</p>
              </div>
              <Link
                to="/profile"
                className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-extrabold text-slate-950 transition hover:bg-teal-100"
              >
                Edit Profile
              </Link>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                <strong className="mt-2 block text-3xl font-extrabold text-slate-900">{stat.value}</strong>
                <span className="mt-1 block text-sm font-semibold text-slate-500">{stat.note}</span>
              </article>
            ))}
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">Quick actions</p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Start from here</h2>
              </div>
              <FaUsers className="hidden text-3xl text-blue-700 sm:block" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group rounded-lg border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                      <Icon />
                    </div>
                    <h3 className="font-extrabold text-slate-900">{action.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{action.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">Upcoming events</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">What is next</h2>
              <div className="mt-5 space-y-4">
                {upcomingEvents.map((event) => (
                  <article key={event.title} className="flex gap-4 rounded-lg border border-slate-200 p-4">
                    <div className="grid h-14 w-16 shrink-0 place-items-center rounded-lg bg-blue-700 text-center text-sm font-extrabold text-white">
                      {event.date}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900">{event.title}</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{event.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">Job highlights</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Shared by alumni</h2>
              <div className="mt-5 space-y-4">
                {jobHighlights.map((job) => (
                  <article key={job.title} className="rounded-lg border border-slate-200 p-4">
                    <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                      {job.company}
                    </span>
                    <h3 className="font-extrabold text-slate-900">{job.title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{job.detail}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
