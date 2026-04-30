import React, { useState } from "react";
import {
  FaBars,
  FaHome,
  FaTimes,
  FaUserCircle,
  FaUserTie,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getLoggedIn, getUserData } from "../services/authService";
import { logout } from "../features/authSlice";

function Topbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const loggedIn = getLoggedIn();
  const user = getUserData() || {};
  const dispatch = useDispatch();
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.adminName ||
    user.name ||
    "Profile";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const profilePhoto =
    user.fileType !== "application/pdf"
      ? user.imageUrl || user.profileImage || user.avatar || user.image || user.photoUrl
      : "";

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    closeMobileMenu();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-bold transition ${
      isActive ? "text-blue-700" : "text-slate-600 hover:text-blue-700"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] w-[min(1120px,calc(100%-2rem))] items-center justify-between gap-4">
        <Link
          to={loggedIn ? "/dashboard" : "/home"}
          className="flex items-center gap-3"
          onClick={closeMobileMenu}
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-700 text-sm font-extrabold text-white">
            AC
          </span>
          <span className="flex items-center gap-2 text-xl font-extrabold">
            <FaUserTie className="hidden text-blue-700 sm:block" />
            Alumni Connect
          </span>
        </Link>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          className={`absolute left-4 right-4 top-[72px] rounded-lg border border-slate-200 bg-white p-4 shadow-xl lg:static lg:flex lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
            isMobileMenuOpen ? "grid gap-2" : "hidden"
          }`}
        >
          {loggedIn ? (
            <>
              <NavLink to="/dashboard" className={linkClass} onClick={closeMobileMenu}>
                <FaHome /> Dashboard
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={closeMobileMenu}>
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={`${displayName} profile`}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100"
                  />
                ) : initials ? (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-[0.7rem] font-extrabold text-white">
                    {initials}
                  </span>
                ) : (
                  <FaUserCircle />
                )}
                Profile
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  setShowLogoutConfirm(true);
                }}
                className="rounded-lg border border-slate-900 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/home" className={linkClass} onClick={closeMobileMenu}>
                <FaHome /> Home
              </NavLink>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-900 transition hover:border-slate-900"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-700">
              <FaUserCircle />
            </div>
            <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900">
              Logout?
            </h2>
            <p className="mt-2 text-center text-sm font-semibold leading-6 text-slate-500">
              Do you really want to logout from Alumni Connect?
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-slate-300 px-4 font-extrabold text-slate-900 transition hover:border-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-slate-950 px-4 font-extrabold text-white transition hover:bg-blue-800"
              >
                Logout
              </button>
            </div>
          </section>
        </div>
      )}
    </header>
  );
}

export default Topbar;
