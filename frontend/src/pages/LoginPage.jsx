import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { loginRequest } from "../api/authApi";
import { useAuthStore } from "../features/auth/authStore";
import { InputField } from "../components/ui/InputField";
import { Button } from "../components/ui/Button";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setSession({
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken
      });
      toast.success("Welcome back");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center p-4 md:p-8">
      <div className="grid w-full gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="card hidden p-8 md:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-pine">
            School Operations
          </p>
          <h1 className="text-4xl font-extrabold leading-tight">
            Smarter permission workflow for safer campuses
          </h1>
          <p className="mt-4 max-w-xl text-slate-600">
            Centralize leave permissions, exam exceptions, and security checkpoints with role-based
            controls and accountable audit trails.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-breeze p-4">
              <p className="text-2xl font-extrabold text-pine">Role-Aware</p>
              <p className="text-sm text-slate-600">DOD, DOS, Teachers, Security, Admin</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-2xl font-extrabold text-ink">Traceable</p>
              <p className="text-sm text-slate-600">Every action linked to audit logs</p>
            </div>
          </div>
        </section>

        <section className="card p-6 md:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
              Secure Access
            </p>
            <h2 className="text-2xl font-extrabold">Sign in to PJMS</h2>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit((values) => {
              mutate(values);
            })}
          >
            <InputField label="Email" type="email" error={errors.email?.message} {...register("email")} />
            <InputField
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              <KeyRound size={16} className="mr-2 inline-block" />
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};
