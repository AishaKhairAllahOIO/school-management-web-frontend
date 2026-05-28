import { Edit3, Eye, Phone, Trash2 } from "lucide-react";

import { parentsMock } from "@/features/users/parents/mocks/parents.mock";

export function ParentsTable() {
  return (
    <div className="soft-card overflow-hidden rounded-3xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="border-b border-border/70 bg-muted/35 text-left">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Parent
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Contact
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Parent Code
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Occupation
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Nationality
              </th>

              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {parentsMock.map((parent) => (
              <tr
                key={parent.id}
                className="border-b border-border/60 transition hover:bg-muted/25 last:border-b-0"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={parent.photoUrl}
                      alt={`${parent.firstName} ${parent.lastName}`}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                    />

                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {parent.firstName} {parent.lastName}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {parent.gender}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={15} className="text-success" />
                    {parent.phoneNumber}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {parent.parentCode}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-foreground">
                  {parent.occupation ?? "—"}
                </td>

                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {parent.nationality}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-info transition hover:bg-info/10">
                      <Eye size={16} />
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-primary transition hover:bg-primary/10">
                      <Edit3 size={16} />
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-destructive transition hover:bg-destructive/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}