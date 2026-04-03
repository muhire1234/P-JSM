import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ClipboardCheck, LogOut, ShieldCheck, UserCog, Users } from "lucide-react";
import { useAuthStore } from "../../features/auth/authStore";
import { logoutRequest } from "../../api/authApi";
import { Button } from "../ui/Button";
import { toast } from "sonner";

const roleRoutes = {
  Admin: [
    { to: "/users", label: "Users", icon: Users },
    { to: "/permissions", label: "Permissions", icon: ClipboardCheck }
  ],
  DOD: [{ to: "/permissions", label: "Permissions", icon: ClipboardCheck }],
  DOS: [{ to: "/permissions", label: "Approvals", icon: ShieldCheck }],
  Teacher: [{ to: "/permissions", label: "Allowed Exams", icon: ClipboardCheck }],
  Security: [{ to: "/permissions", label: "Gate Logs", icon: ShieldCheck }]
};

export const AppLayout = () => {
  const navigate = useNavigate();
  const { user, refreshToken, clearSession } = useAuthStore();
  const links = roleRoutes[user?.role] || [{ to: "/", label: "Dashboard", icon: UserCog }];

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } catch {
      // clear local state even when server-side revoke fails
    } finally {
      clearSession();
      toast.success("Session ended");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-4">
          <Link to="/" className="mb-6 block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pine">PJMS</p>
            <h1 className="text-xl font-extrabold">Permission Platform</h1>
          </Link>

          <div className="mb-4 rounded-xl bg-breeze p-3">
            <p className="text-xs text-slate-600">Signed in as</p>
            <p className="font-semibold text-ink">{user?.role || "Unknown role"}</p>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-ink text-white" : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <UserCog size={16} />
              Dashboard
            </NavLink>

            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to + label}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-ink text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <Button className="mt-6 w-full" variant="danger" onClick={handleLogout}>
            <LogOut size={16} className="mr-1 inline-block" />
            Logout
          </Button>
        </aside>

        <main className="card min-h-[80vh] p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
