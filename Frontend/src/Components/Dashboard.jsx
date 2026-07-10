import {
  FaAward,
  FaBookOpen,
  FaBriefcase,
  FaBullhorn,
  FaCalendarAlt,
  FaComments,
  FaDonate,
  FaHandsHelping,
  FaIdBadge,
  FaBrain,
  FaSearch,
  FaUpload,
  FaUserCheck,
  FaUserCircle,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import { getUserData } from "../services/authService";
import logo from "../assets/img/logo.png";

const roleCopy = {
  alumni: {
    eyebrow: "Alumni workspace",
    title: "Reconnect, grow, and give back.",
    description:
      "Find classmates, request mentorship, explore referrals, join events, and stay connected with the CMRIT community.",
  },
  admin: {
    eyebrow: "Admin workspace",
    title: "Manage the alumni platform.",
    description:
      "Oversee alumni records, imports, announcements, events, job posts, reports, and recognition workflows.",
  },
  faculty: {
    eyebrow: "Faculty workspace",
    title: "Support students and alumni.",
    description:
      "Guide mentorship requests, share announcements, support events, and contribute academic resources.",
  },
  college: {
    eyebrow: "College workspace",
    title: "Coordinate alumni outreach.",
    description:
      "Manage official updates, bulk records, events, contributions, recognition, and institutional reports.",
  },
};

const navByRole = {
  alumni: [
    ["Dashboard", "/dashboard", FaIdBadge],
    ["Profile", "/profile", FaUserCircle],
    ["Alumni Directory", "/alumni-directory", FaSearch],
    ["Connections", "/connections", FaUserPlus],
    ["Mentorship", "/mentorship", FaHandsHelping],
    ["Career Referrals", "/career-referrals", FaBriefcase],
    ["Events", "/events", FaCalendarAlt],
    ["Jobs", "/jobs", FaBriefcase],
    ["Resources", "/resources", FaBookOpen],
    ["Stories", "/alumni-stories", FaUsers],
    ["Recognition", "/recognition", FaAward],
    ["Recommended", "/recommendations", FaBrain],
  ],
  admin: [
    ["Dashboard", "/dashboard", FaIdBadge],
    ["Profile", "/profile", FaUserCircle],
    ["Manage Alumni", "/manage-alumni", FaSearch],
    ["Bulk Import", "/bulk-upload", FaUpload],
    ["Approvals", "/approvals", FaUserCheck],
    ["Mentorship Requests", "/admin-mentorship", FaHandsHelping],
    ["Announcements", "/announcements", FaBullhorn],
    ["Events", "/events", FaCalendarAlt],
    ["Jobs", "/jobs", FaBriefcase],
    ["Reports", "/reports", FaComments],
    ["Recognition", "/recognition", FaAward],
  ],
  faculty: [
    ["Dashboard", "/dashboard", FaIdBadge],
    ["Profile", "/profile", FaUserCircle],
    ["Alumni Directory", "/alumni-directory", FaSearch],
    ["Mentorship", "/mentorship", FaHandsHelping],
    ["Announcements", "/announcements", FaBullhorn],
    ["Events", "/events", FaCalendarAlt],
    ["Forum", "/forum", FaComments],
    ["Resources", "/resources", FaBookOpen],
    ["Stories", "/alumni-stories", FaUsers],
  ],
  college: [
    ["Dashboard", "/dashboard", FaIdBadge],
    ["Profile", "/profile", FaUserCircle],
    ["Bulk Import", "/bulk-upload", FaUpload],
    ["Announcements", "/announcements", FaBullhorn],
    ["Events", "/events", FaCalendarAlt],
    ["Alumni Directory", "/alumni-directory", FaSearch],
    ["Contributions", "/contributions", FaDonate],
    ["Recognition", "/recognition", FaAward],
    ["Reports", "/reports", FaComments],
  ],
};

const statsByRole = {
  alumni: [
    ["Connections", "42", "people in your network"],
    ["Events", "3", "registered or suggested"],
    ["Referrals", "8", "active opportunities"],
  ],
  admin: [
    ["Alumni Records", "5k+", "registered profiles"],
    ["Pending Review", "34", "records and posts"],
    ["Imports", "12", "completed uploads"],
  ],
  faculty: [
    ["Mentorship", "16", "requests to review"],
    ["Announcements", "9", "sent this term"],
    ["Events", "5", "faculty-supported sessions"],
  ],
  college: [
    ["Departments", "9", "tracked in portal"],
    ["Outreach", "24", "announcements sent"],
    ["Contributions", "₹8.6L", "pledged support"],
  ],
};

const actionsByRole = {
  alumni: [
    ["Find Alumni", "Search by batch, branch, company, or role.", "/alumni-directory", FaSearch],
    ["Connections", "Send and manage connection requests.", "/connections", FaUserPlus],
    ["Career Referrals", "Browse roles shared by alumni.", "/career-referrals", FaBriefcase],
    ["Mentorship", "Ask for career or academic guidance.", "/mentorship", FaHandsHelping],
    ["Resources", "Access guides, templates, and prep docs.", "/resources", FaBookOpen],
    ["Recognition", "Celebrate alumni achievements.", "/recognition", FaAward],
  ],
  admin: [
    ["Manage Alumni", "Edit alumni profiles and remove invalid records.", "/manage-alumni", FaSearch],
    ["Bulk Import", "Upload student and alumni records.", "/bulk-upload", FaUpload],
    ["Approvals", "Review alumni registrations before login access.", "/approvals", FaUserCheck],
    ["Mentorship Requests", "Review and update alumni mentorship requests.", "/admin-mentorship", FaHandsHelping],
    ["Announcements", "Publish targeted updates.", "/announcements", FaBullhorn],
    ["Reports", "Review live platform activity and engagement.", "/reports", FaComments],
  ],
  faculty: [
    ["Guide Mentorship", "Review mentorship requests.", "/mentorship", FaHandsHelping],
    ["Announcements", "Share updates with alumni groups.", "/announcements", FaBullhorn],
    ["Alumni Directory", "Find alumni by batch and branch.", "/alumni-directory", FaSearch],
    ["Resources", "Share academic and placement material.", "/resources", FaBookOpen],
    ["Forum", "Support community discussions.", "/forum", FaComments],
    ["Events", "Coordinate college sessions.", "/events", FaCalendarAlt],
  ],
  college: [
    ["Bulk Import", "Maintain alumni and student records.", "/bulk-upload", FaUpload],
    ["Campus Updates", "Create official announcements.", "/announcements", FaBullhorn],
    ["Events", "Coordinate alumni programs.", "/events", FaCalendarAlt],
    ["Alumni Directory", "View alumni across departments.", "/alumni-directory", FaSearch],
    ["Contributions", "Track alumni support.", "/contributions", FaDonate],
    ["Recognition", "Showcase alumni impact.", "/recognition", FaAward],
  ],
};

const panelsByRole = {
  alumni: {
    primaryTitle: "Upcoming events",
    primaryItems: [
      ["14 May", "Alumni Leadership Summit", "Campus meet for alumni mentors and student leaders."],
      ["28 May", "Career Night", "Tech and product panel with alumni speakers."],
    ],
    secondaryTitle: "Job highlights",
    secondaryItems: [
      ["FinEdge", "Backend Developer", "Referral-friendly Node.js role."],
      ["Nexora", "Data Analyst", "Early-career remote opportunity."],
    ],
  },
  admin: {
    primaryTitle: "Admin queue",
    primaryItems: [
      ["34 rows", "Verify imported records", "Review the latest student data upload."],
      ["6 posts", "Moderate job posts", "Check newly submitted opportunities."],
    ],
    secondaryTitle: "Platform activity",
    secondaryItems: [
      ["72", "New registrations", "Recently created accounts."],
      ["9", "Announcements sent", "Updates published this month."],
    ],
  },
  faculty: {
    primaryTitle: "Mentorship queue",
    primaryItems: [
      ["Pending", "Resume Review", "Final-year student requesting feedback."],
      ["New", "Higher Studies Guidance", "SOP and application timeline support."],
    ],
    secondaryTitle: "Discussion topics",
    secondaryItems: [
      ["18 replies", "Placement prep for 2026 batch", "Students and alumni discussing strategy."],
      ["11 replies", "Higher studies roadmap", "Faculty-led discussion."],
    ],
  },
  college: {
    primaryTitle: "Institutional updates",
    primaryItems: [
      ["Draft", "Annual alumni meet", "Prepare invitation for all batches."],
      ["Ready", "Scholarship update", "Share contribution campaign progress."],
    ],
    secondaryTitle: "Contribution highlights",
    secondaryItems: [
      ["₹4.2L", "Student Scholarship Fund", "Alumni support for scholarships."],
      ["₹2.8L", "Lab Equipment Support", "Campaign for academic infrastructure."],
    ],
  },
};

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
    imageUrl,
    profileImage,
    avatar,
  } = user;

  const activeRole = roleCopy[role] ? role : "alumni";
  const displayName =
    activeRole === "admin"
      ? adminName || name || "Admin User"
      : [firstName, lastName].filter(Boolean).join(" ") ||
        name ||
        (activeRole === "college" ? "CMRIT Office" : "CMRIT member");
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const photoUrl = imageUrl || profileImage || avatar || user.image || user.photoUrl;
  const copy = roleCopy[activeRole];
  const sidebarLinks = navByRole[activeRole];
  const [adminOverview, setAdminOverview] = useState(null);
  const stats =
    activeRole === "admin" && adminOverview
      ? [
          ["Alumni Records", adminOverview.alumni, "registered alumni profiles"],
          ["Pending Review", adminOverview.pendingAlumni, "accounts awaiting approval"],
          ["Events & Jobs", adminOverview.events + adminOverview.jobs, "active platform listings"],
        ]
      : statsByRole[activeRole];
  const quickActions = actionsByRole[activeRole];
  const panels = panelsByRole[activeRole];

  useEffect(() => {
    const fetchAdminOverview = async () => {
      if (activeRole !== "admin") return;

      try {
        const response = await axios.get("/admin/overview");
        setAdminOverview(response.data.data.overview);
      } catch (error) {
        console.error("Admin overview fetch failed:", error);
      }
    };

    fetchAdminOverview();
  }, [activeRole]);

  const profileDetails =
    activeRole === "admin"
      ? [
          ["Role", "Platform administrator"],
          ["Email", email || "Not added"],
          ["Focus", "Records and moderation"],
        ]
      : activeRole === "college"
      ? [
          ["Role", "College office"],
          ["Email", email || "Not added"],
          ["Focus", "Institutional outreach"],
        ]
      : [
          ["Branch", branch || "Not added"],
          ["Degree", degree || "Not added"],
          ["Batch", endYear || "Not added"],
        ];

  return (
    <main className="bg-slate-50 px-4 py-6">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4">
              <img
                src={logo}
                alt="CMReunite Logo"
                className="h-11 w-11 rounded object-cover"
              />
            <div>
              <p className="font-extrabold text-slate-900">Workspace</p>
              <p className="text-xs font-bold capitalize text-slate-500">{activeRole}</p>
            </div>
          </div>

          <nav className="grid gap-1">
            {sidebarLinks.map(([label, to, Icon]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <section
            className={`grid gap-5 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8 ${
              activeRole === "admin" ? "" : "md:grid-cols-[1fr_320px]"
            }`}
          >
            <div>
              <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
                {copy.eyebrow}
              </p>
              <h1 className="text-3xl font-extrabold tracking-normal md:text-4xl">
                Welcome back, {displayName}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300 md:text-base">
                {copy.description}
              </p>
            </div>

            {activeRole !== "admin" && (
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
                    <p className="text-sm font-semibold capitalize text-slate-300">{activeRole}</p>
                    <p className="truncate text-xs font-semibold text-slate-400">{email}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-300">
                  {profileDetails.map(([label, value]) => (
                    <p key={label}>
                      {label}: {value}
                    </p>
                  ))}
                </div>
                <Link
                  to="/profile"
                  className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-extrabold text-slate-950 transition hover:bg-teal-100"
                >
                  Edit Profile
                </Link>
              </div>
            )}
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            {stats.map(([label, value, note]) => (
              <article key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">{label}</p>
                <strong className="mt-2 block text-3xl font-extrabold text-slate-900">{value}</strong>
                <span className="mt-1 block text-sm font-semibold text-slate-500">{note}</span>
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

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickActions.map(([title, description, to, Icon]) => (
                <Link
                  key={title}
                  to={to}
                  className="group rounded-lg border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                    <Icon />
                  </div>
                  <h3 className="font-extrabold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{description}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardPanel title={panels.primaryTitle} items={panels.primaryItems} />
            <DashboardPanel title={panels.secondaryTitle} items={panels.secondaryItems} />
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardPanel({ title, items }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-600">Overview</p>
      <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map(([tag, itemTitle, detail]) => (
          <article key={itemTitle} className="rounded-lg border border-slate-200 p-4">
            <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
              {tag}
            </span>
            <h3 className="font-extrabold text-slate-900">{itemTitle}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
