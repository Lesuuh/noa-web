import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-50 text-slate-800 p-6 text-center">
      {/* Central Illustration (e.g., a broken link or a lost icon) */}
      <div className="mb-8">
        {/* You could add an SVG or an icon here for visual appeal */}
        {/* For now, using a simple Lucide icon like 'SearchX' or 'GlobeOff' could work */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-frown mx-auto text-slate-400"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" x2="9.01" y1="9" y2="9" />
          <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
      </div>

      <h1 className="text-7xl font-extrabold tracking-tight sm:text-8xl md:text-9xl text-slate-800 drop-shadow-sm">
        404
      </h1>
      <p className="mt-6 text-xl font-semibold sm:text-2xl md:text-3xl text-slate-700">
        Page Not Found
      </p>
      <p className="mt-3 text-md sm:text-lg md:text-xl max-w-md text-slate-500 leading-relaxed">
        We couldn't find the page you were looking for. It might have been moved
        or doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-10 inline-flex h-12 items-center justify-center rounded-xl bg-sky-600 px-8 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
