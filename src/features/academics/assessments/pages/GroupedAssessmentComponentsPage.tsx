import {
  useGroupedAssessmentComponents,
} from "../hooks/useAssessmentComponents";

export function GroupedAssessmentComponentsPage() {
  const groupedQuery =
    useGroupedAssessmentComponents();

  if (groupedQuery.isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <section
            key={groupIndex}
            className="animate-pulse overflow-hidden rounded-[22px] border border-border/60 bg-card"
          >
            <div className="flex items-center gap-3 border-b border-border/50 p-5">
              <span className="h-10 w-10 rounded-[14px] bg-muted" />
              <div className="flex-1 space-y-2">
                <span className="block h-3 w-40 rounded-full bg-muted" />
                <span className="block h-2.5 w-56 rounded-full bg-muted/70" />
              </div>
            </div>
            <div className="grid gap-3 p-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((__, itemIndex) => (
                <div
                  key={itemIndex}
                  className="h-20 rounded-[15px] bg-muted/50"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (groupedQuery.isError) {
    return (
      <div className="p-6">
        <p>
          Failed to load grouped assessments.
        </p>

        <button
          type="button"
          onClick={() => {
            void groupedQuery.refetch();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const groups =
    groupedQuery.data ?? [];

  if (groups.length === 0) {
    return (
      <div className="p-6">
        No grouped assessments found.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {groups.map((group) => (
        <section
          key={
            group.gradeSubjectId
          }
          className="rounded-lg border p-4"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {group.subjectName}
            </h2>

            {group.gradeName ? (
              <p className="text-sm text-muted-foreground">
                {group.gradeName}
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            {group.components.map(
              (component) => (
                <div
                  key={component.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {component.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {component.type}
                    </p>
                  </div>

                  <div className="text-right text-sm">
                    <p>
                      Mark:{" "}
                      {
                        component.maxMark
                      }
                    </p>

                    <p>
                      Weight:{" "}
                      {
                        component.weightPercentage
                      }
                      %
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}