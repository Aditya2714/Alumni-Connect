import { useState } from "react";
import { FaCamera, FaSave, FaUserCircle } from "react-icons/fa";
import { getUserData } from "../services/authService";

function Profile() {
  const user = getUserData() || {};
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    user.adminName ||
    "CMRIT member";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [profile, setProfile] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    branch: user.branch || "",
    degree: user.degree || "",
    startYear: user.startYear || "",
    endYear: user.endYear || "",
    company: user.company || "",
    designation: user.designation || "",
    location: user.location || "",
    bio: user.bio || "",
    photoUrl: user.profileImage || user.avatar || user.image || user.photoUrl || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="bg-slate-50 px-4 py-8">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-teal-100">
            Profile section
          </p>
          <h1 className="text-3xl font-extrabold tracking-normal">
            Edit your alumni profile
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-300">
            Keep your profile details current so classmates, faculty, and alumni
            coordinators can recognize and reach you easily.
          </p>
        </div>

        <form className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-slate-950 text-3xl font-extrabold text-white">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={`${displayName} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <label className="mt-5 block">
              <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-600">
                <FaCamera /> Profile image URL
              </span>
              <input
                name="photoUrl"
                type="url"
                value={profile.photoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
            </label>

            <div className="mt-5 rounded-lg bg-white p-4 text-sm font-semibold text-slate-500">
              <div className="mb-2 flex items-center gap-2 font-extrabold text-slate-900">
                <FaUserCircle /> Profile preview
              </div>
              <p>{displayName}</p>
              <p className="capitalize">{user.role || "member"}</p>
              <p className="truncate">{profile.email}</p>
            </div>
          </aside>

          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-lg font-extrabold text-slate-900">
                Personal details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    First name
                  </span>
                  <input
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Last name
                  </span>
                  <input
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Phone
                  </span>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="+91 ..."
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-extrabold text-slate-900">
                Academic and career details
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Branch
                  </span>
                  <input
                    name="branch"
                    value={profile.branch}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Degree
                  </span>
                  <input
                    name="degree"
                    value={profile.degree}
                    onChange={handleChange}
                    placeholder="Bachelor"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Start year
                  </span>
                  <input
                    name="startYear"
                    value={profile.startYear}
                    onChange={handleChange}
                    placeholder="2020"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    End year
                  </span>
                  <input
                    name="endYear"
                    value={profile.endYear}
                    onChange={handleChange}
                    placeholder="2024"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Company
                  </span>
                  <input
                    name="company"
                    value={profile.company}
                    onChange={handleChange}
                    placeholder="Current company"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Designation
                  </span>
                  <input
                    name="designation"
                    value={profile.designation}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    className={inputClass}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Location
                  </span>
                  <input
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                    className={inputClass}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-slate-600">
                    Short bio
                  </span>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Share a short introduction for your alumni profile."
                    className={inputClass}
                  />
                </label>
              </div>
            </section>

            <div className="flex justify-end border-t border-slate-200 pt-6">
              <button
                type="button"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-blue-700 px-6 font-extrabold text-white transition hover:bg-blue-800"
              >
                <FaSave /> Save Profile
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Profile;
