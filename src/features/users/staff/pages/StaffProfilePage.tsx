import {
  useState,
} from "react";

import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";


import {
  StaffPageHero,
} from "../components/layout/StaffPageHero";

import {
  StaffContactViewSection,
} from "../components/sections/StaffContactViewSection";

import {
  StaffEmploymentViewSection,
} from "../components/sections/StaffEmploymentViewSection";

import {
  StaffPersonalViewSection,
} from "../components/sections/StaffPersonalViewSection";

import {
  StaffEmptyState,
} from "../components/states/StaffEmptyState";

import {
  StaffErrorState,
} from "../components/states/StaffErrorState";

import {
  StaffPageSkeleton,
} from "../components/states/StaffPageSkeleton";

import {
  staffSectionConfigs,
} from "../config/staff.config";

import {
  useStaffDetails,
} from "../hooks/useStaff";

import type {
  StaffRole,
} from "../types/staff.types";

type StaffProfilePageProps = {
  role: StaffRole;
};

function formatText(
  value:
    | string
    | number
    | null
    | undefined,
  fallback = "Not specified",
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatDate(
  value:
    | string
    | null
    | undefined,
): string {
  if (!value) {
    return "Not specified";
  }

  const dateOnlyMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value,
    );

  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

export function StaffProfilePage({
  role,
}: StaffProfilePageProps) {
  const navigate = useNavigate();

  const { staffId } = useParams<{
    staffId: string;
  }>();

  const config =
    staffSectionConfigs[role];

  const staffQuery =
    useStaffDetails(staffId);

 

  const [
    actionError,
    
  ] = useState<string | null>(
    null,
  );

  if (!staffId) {
    return (
      <StaffEmptyState
        title="Staff identifier missing"
        description="The staff identifier is missing from the page address, so the requested profile cannot be loaded."
        actionLabel={`Back to ${config.pluralLabel}`}
        onAction={() =>
          navigate(
            config.listPath,
          )
        }
      />
    );
  }

  if (staffQuery.isPending) {
    return (
      <StaffPageSkeleton mode="view" />
    );
  }

  if (staffQuery.isError) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() =>
            navigate(
              config.listPath,
            )
          }
          className={[
            "inline-flex items-center gap-2",
            "text-sm font-medium",
            "text-muted-foreground",
            "transition-colors",
            "hover:text-primary",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4" />

          Back to {config.pluralLabel}
        </button>

        <StaffErrorState
          title="Unable to load staff profile"
          description={`The ${config.singularLabel.toLowerCase()} profile could not be loaded. Please try again.`}
          onRetry={() => {
            void staffQuery.refetch();
          }}
        />
      </div>
    );
  }

  if (!staffQuery.data) {
    return (
      <StaffEmptyState
        title="Staff profile not found"
        description={`The requested ${config.singularLabel.toLowerCase()} profile does not exist or may have been removed.`}
        actionLabel={`Back to ${config.pluralLabel}`}
        onAction={() =>
          navigate(
            config.listPath,
          )
        }
      />
    );
  }

  const staff =
    staffQuery.data;

  

  return (
    <section className="space-y-5">
      <StaffPageHero
        mode="view"
        title={
          staff.fullName ||
          `Unnamed ${config.singularLabel.toLowerCase()}`
        }
        description={`${config.singularLabel} profile, contact information and employment record.`}
        backLabel={`Back to ${config.pluralLabel}`}
        onBack={() =>
          navigate(
            config.listPath,
          )
        }
        photoUrl={
          staff.photoUrl
        }
        photoAlt={
          staff.fullName
        }
        staffId={
          staff.id
        }
        accountStatus={
          staff.accountStatus
        }
        roleLabel={
          config.singularLabel
        }
      >
        
      </StaffPageHero>

      {actionError ? (
        <StaffErrorState
          compact
          title="Action unsuccessful"
          description={
            actionError
          }
        />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <StaffPersonalViewSection
          firstName={formatText(
            staff.firstName,
          )}
          lastName={formatText(
            staff.lastName,
          )}
          fatherName={formatText(
            staff.fatherName,
          )}
          motherName={formatText(
            staff.motherName,
          )}
          birthDate={formatDate(
            staff.birthDate,
          )}
          birthPlace={formatText(
            staff.birthPlace,
          )}
          gender={formatText(
            staff.gender,
          )}
          nationality={formatText(
            staff.nationality,
          )}
          address={formatText(
            staff.address,
          )}
        />

        <div className="space-y-5">
          <StaffContactViewSection
            phoneNumber={
              staff.phoneNumber ||
              "Not specified"
            }
            email={
              staff.email
            }
          />

          <StaffEmploymentViewSection
            degree={formatText(
              staff.degree,
            )}
            specialization={
              staff.specialization
            }
            university={
              staff.university
            }
            graduationYear={
              staff.graduationYear
            }
            hireDate={formatDate(
              staff.hireDate,
            )}
            experienceYears={
              staff.experienceYears
            }
            serviceType={
              staff.serviceType
                ? formatText(
                    staff.serviceType,
                  )
                : null
            }
          />
        </div>
      </div>
    </section>
  );
}