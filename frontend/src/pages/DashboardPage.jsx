import { Shield, UserCheck, Workflow } from "lucide-react";
import { useAuthStore } from "../features/auth/authStore";

const cards = [
  {
    title: "Workflow Integrity",
    value: "Secure",
    icon: Workflow,
    tone: "bg-breeze"
  },
  {
    title: "Role Access",
    value: "Enforced",
    icon: UserCheck,
    tone: "bg-slate-100"
  },
  {
    title: "Session Security",
    value: "JWT + Refresh",
    icon: Shield,
    tone: "bg-orange-50"
  }
];

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pine">Overview</p>
      <h2 className="mt-2 text-3xl font-extrabold">Welcome, {user?.role || "User"}</h2>
      <p className="mt-2 text-slate-600">
        Use the sidebar to process permissions based on your role and keep student workflow records
        consistent and auditable.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map(({ title, value, icon: Icon, tone }) => (
          <article key={title} className={`rounded-2xl p-4 ${tone}`}>
            <Icon size={20} className="text-pine" />
            <p className="mt-3 text-sm text-slate-600">{title}</p>
            <p className="text-xl font-bold">{value}</p>
          </article>
        ))}
      </div>
    </div>
  );
};
