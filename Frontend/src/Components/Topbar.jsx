import React, { useState } from "react";
import {
  FaBars,
  FaBriefcase,
  FaCalendar,
  FaEnvelopeOpenText,
  FaHome,
  FaSearch,
  FaTimes,
  FaUpload,
  FaUserTie,
  FaVideo,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getLoggedIn } from "../services/authService";
import { logout } from "../features/authSlice";
import Dropdown from "./helper/Dropdown";

function Topbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loggedIn = getLoggedIn();
  const dispatch = useDispatch();

  const closeMobileMenu = () => setMobileMenuOpen(false);

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
              <NavLink to="/events" className={linkClass} onClick={closeMobileMenu}>
                <FaCalendar /> Events
              </NavLink>
              <NavLink to="/jobs" className={linkClass} onClick={closeMobileMenu}>
                <FaBriefcase /> Jobs
              </NavLink>
              <div className="rounded-lg px-2 py-2 text-sm font-bold text-slate-600">
                <Dropdown />
              </div>
              <NavLink to="/meeting" className={linkClass} onClick={closeMobileMenu}>
                <FaVideo /> Meeting
              </NavLink>
              <NavLink to="/bulk-upload" className={linkClass} onClick={closeMobileMenu}>
                <FaUpload /> Bulk Import
              </NavLink>
              <NavLink to="/search-people" className={linkClass} onClick={closeMobileMenu}>
                <FaSearch /> Search Alumni
              </NavLink>
              <NavLink to="/send-mail" className={linkClass} onClick={closeMobileMenu}>
                <FaEnvelopeOpenText /> Send Mail
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  dispatch(logout());
                  closeMobileMenu();
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
    </header>
  );
}

export default Topbar;
