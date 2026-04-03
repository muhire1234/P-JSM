import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import {
  allowMissedExam,
  approveMissedExam,
  createPermission,
  logExit,
  logReturn
} from "../api/platformApi";
import { useAuthStore } from "../features/auth/authStore";
import { useForm } from "react-hook-form";

const Section = ({ title, description, children }) => (
  <section className="rounded-2xl border border-slate-200 p-4">
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="mt-1 text-sm text-slate-600">{description}</p>
    <div className="mt-4">{children}</div>
  </section>
);

export const PermissionsPage = () => {
  const user = useAuthStore((state) => state.user);

  const createMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: () => toast.success("Permission created"),
    onError: (err) => toast.error(err?.response?.data?.message || "Could not create permission")
  });

  const dosMutation = useMutation({
    mutationFn: approveMissedExam,
    onSuccess: () => toast.success("Decision submitted"),
    onError: (err) => toast.error(err?.response?.data?.message || "Could not submit decision")
  });

  const teacherMutation = useMutation({
    mutationFn: allowMissedExam,
    onSuccess: () => toast.success("Exam permission marked"),
    onError: (err) => toast.error(err?.response?.data?.message || "Could not allow exam")
  });

  const exitMutation = useMutation({
    mutationFn: logExit,
    onSuccess: () => toast.success("Exit logged"),
    onError: (err) => toast.error(err?.response?.data?.message || "Could not log exit")
  });

  const returnMutation = useMutation({
    mutationFn: logReturn,
    onSuccess: () => toast.success("Return logged"),
    onError: (err) => toast.error(err?.response?.data?.message || "Could not log return")
  });

  const createForm = useForm({ defaultValues: { studentId: "", type: "LEAVE", description: "" } });
  const dosForm = useForm({ defaultValues: { permissionId: "", action: "APPROVE" } });
  const teacherForm = useForm({ defaultValues: { permissionId: "" } });
  const securityExitForm = useForm({ defaultValues: { permissionId: "" } });
  const securityReturnForm = useForm({ defaultValues: { logId: "" } });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Permissions Workflow</h2>
      <p className="text-sm text-slate-600">
        Role: <span className="font-semibold">{user?.role}</span>. Forms below are enabled per role.
      </p>

      {(user?.role === "DOD" || user?.role === "Admin") && (
        <Section
          title="Create Permission"
          description="Create LEAVE or MISSED_EXAM requests for a student (DOD flow)."
        >
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={createForm.handleSubmit((values) => createMutation.mutate(values))}
          >
            <InputField label="Student ID" placeholder="ObjectId" {...createForm.register("studentId")} />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Permission Type</span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                {...createForm.register("type")}
              >
                <option value="LEAVE">LEAVE</option>
                <option value="MISSED_EXAM">MISSED_EXAM</option>
              </select>
            </label>
            <div className="md:col-span-2">
              <InputField label="Description" placeholder="Reason..." {...createForm.register("description")} />
            </div>
            <Button type="submit" className="md:col-span-2" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Submitting..." : "Create Permission"}
            </Button>
          </form>
        </Section>
      )}

      {user?.role === "DOS" && (
        <Section
          title="DOS Approval"
          description="Approve or reject MISSED_EXAM requests currently in PENDING_DOS state."
        >
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={dosForm.handleSubmit((values) => dosMutation.mutate(values))}
          >
            <InputField label="Permission ID" placeholder="ObjectId" {...dosForm.register("permissionId")} />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">Action</span>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                {...dosForm.register("action")}
              >
                <option value="APPROVE">APPROVE</option>
                <option value="REJECT">REJECT</option>
              </select>
            </label>
            <Button type="submit" className="md:col-span-2" disabled={dosMutation.isPending}>
              {dosMutation.isPending ? "Submitting..." : "Submit Decision"}
            </Button>
          </form>
        </Section>
      )}

      {user?.role === "Teacher" && (
        <Section
          title="Teacher Allow Exam"
          description="Mark approved MISSED_EXAM permission as allowed for exam."
        >
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={teacherForm.handleSubmit((values) => teacherMutation.mutate(values))}
          >
            <InputField label="Permission ID" placeholder="ObjectId" {...teacherForm.register("permissionId")} />
            <Button type="submit" className="md:col-span-2" disabled={teacherMutation.isPending}>
              {teacherMutation.isPending ? "Submitting..." : "Allow Exam"}
            </Button>
          </form>
        </Section>
      )}

      {user?.role === "Security" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Section
            title="Log Exit"
            description="Log student exit for approved LEAVE permission."
          >
            <form
              className="space-y-3"
              onSubmit={securityExitForm.handleSubmit((values) => exitMutation.mutate(values))}
            >
              <InputField
                label="Permission ID"
                placeholder="ObjectId"
                {...securityExitForm.register("permissionId")}
              />
              <Button type="submit" className="w-full" disabled={exitMutation.isPending}>
                {exitMutation.isPending ? "Submitting..." : "Log Exit"}
              </Button>
            </form>
          </Section>
          <Section
            title="Log Return"
            description="Close active log when student returns to campus."
          >
            <form
              className="space-y-3"
              onSubmit={securityReturnForm.handleSubmit((values) => returnMutation.mutate(values))}
            >
              <InputField label="Log ID" placeholder="ObjectId" {...securityReturnForm.register("logId")} />
              <Button type="submit" className="w-full" disabled={returnMutation.isPending}>
                {returnMutation.isPending ? "Submitting..." : "Log Return"}
              </Button>
            </form>
          </Section>
        </div>
      )}
    </div>
  );
};
