import {
  useGroupedAssessmentComponents,
} from "../hooks/useAssessmentComponents";

export function GroupedAssessmentComponentsPage() {
  const groupedQuery =
    useGroupedAssessmentComponents();

  if (groupedQuery.isLoading) {
    return (
      <div className="p-6">
        Loading assessment components...
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