import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="bg-slate-950">
      <section
        className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-cover bg-[center_top]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(15, 23, 42, 0.86) 0%, rgba(15, 23, 42, 0.52) 36%, rgba(15, 23, 42, 0.18) 68%, rgba(15, 23, 42, 0.05) 100%), url("https://upload.wikimedia.org/wikipedia/commons/0/05/CMR_Institute_of_Technology_campus%2C_Whitefield%2C_Bangalore%2C_Karnataka%2C_India_%282014%29.jpg")',
        }}
        aria-label="College campus"
      >
        <div className="mx-auto flex min-h-[calc(100vh-72px)] w-[min(1120px,calc(100%-2rem))] items-start justify-start pb-32 pt-10 md:pb-28 md:pt-16">
          <div className="max-w-sm text-white md:max-w-md">
            <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-teal-100 backdrop-blur">
              College Alumni Portal
            </p>

            <h1 className="mb-5 text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl md:text-[2.9rem]">
              CMRIT alumni, connected beyond campus.
            </h1>

            <p className="mb-7 max-w-md text-sm font-semibold leading-7 text-white/82 md:text-base">
              A dedicated space for CMR Institute of Technology alumni to
              reconnect, discover familiar faces, join events, and stay close
              to the community that shaped them.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-white px-6 font-extrabold text-slate-950 shadow-lg transition hover:bg-teal-100"
              >
                Login to Continue
              </Link>
              <span className="text-sm font-bold text-white/70">
                Alumni · Faculty · College
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-slate-950/70 backdrop-blur">
          <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] grid-cols-1 gap-4 py-5 text-white sm:grid-cols-3">
            <div>
              <strong className="block text-lg font-extrabold">Connect</strong>
              <span className="text-sm font-semibold text-white/65">
                Find alumni and classmates
              </span>
            </div>
            <div>
              <strong className="block text-lg font-extrabold">Participate</strong>
              <span className="text-sm font-semibold text-white/65">
                Join college events
              </span>
            </div>
            <div>
              <strong className="block text-lg font-extrabold">Grow</strong>
              <span className="text-sm font-semibold text-white/65">
                Discover career opportunities
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
