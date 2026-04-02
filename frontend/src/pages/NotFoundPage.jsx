import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">404</p>
      <h2 className="mt-2 text-3xl font-extrabold">Page not found</h2>
      <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
      <Link to="/" className="mt-6 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
        Back Home
      </Link>
    </div>
  );
};
