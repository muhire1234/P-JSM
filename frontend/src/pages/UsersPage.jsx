import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/platformApi";
import { useAuthStore } from "../features/auth/authStore";

export const UsersPage = () => {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", user?.schoolId],
    queryFn: fetchUsers,
    enabled: user?.role === "Admin"
  });

  if (user?.role !== "Admin") {
    return <p className="text-sm text-slate-600">Only Admin users can view this page.</p>;
  }

  if (isLoading) return <p className="text-sm text-slate-600">Loading users...</p>;
  if (isError) return <p className="text-sm text-red-600">Could not load users.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">School Users</h2>
      <p className="mt-1 text-sm text-slate-600">Users are isolated by school from backend policy.</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((item) => (
              <tr key={item._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-slate-600">{item.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-breeze px-2 py-1 text-xs font-semibold">
                    {item.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
