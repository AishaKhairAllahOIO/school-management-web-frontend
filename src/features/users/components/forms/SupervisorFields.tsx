import type { SupervisorUser } from "@/features/users/supervisors/types/supervisor.types";

type SupervisorFieldsProps = {
  user?: Partial<SupervisorUser>;
  disabled?: boolean;
};

export function SupervisorFields({ user, disabled }: SupervisorFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Supervisor Information
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          name="supervisorEmail"
          defaultValue={user?.supervisorEmail}
          disabled={disabled}
          placeholder="Supervisor Email"
          className="form-input"
        />
      </div>
    </div>
  );
}