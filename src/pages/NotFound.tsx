import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900 p-4 text-center">
      <h1 className="text-7xl font-extrabold tracking-tight sm:text-8xl md:text-9xl drop-shadow-md text-blue-800">
        404
      </h1>
      <p className="mt-4 text-2xl font-medium sm:text-3xl md:text-4xl">
        Oops! You've ventured off the map.
      </p>
      <p className="mt-2 text-lg sm:text-xl md:text-2xl max-w-md">
        The page you're looking for seems to have gone on an adventure of its own.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
