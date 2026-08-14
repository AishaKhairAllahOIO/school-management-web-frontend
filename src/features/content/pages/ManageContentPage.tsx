import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Globe2,
  Save,
} from "lucide-react";

import {
  updateContent,
} from "@/features/content/api/content.api";

import websiteContent from "../data/madrasaty-website.json";

const WEBSITE_URL =
  "https://madrasatywebsite.netlify.app/";

type ContentValue = string | null;

type ContentField = {
  key: string;
  value: ContentValue;
  path: string[];
};

/* =========================================================
   Content helpers
========================================================= */

function flattenContent(
  data: unknown,
  path: string[] = [],
): ContentField[] {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    return [];
  }

  const result: ContentField[] = [];

  Object.entries(data).forEach(
    ([key, value]) => {
      const currentPath = [
        ...path,
        key,
      ];

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        result.push(
          ...flattenContent(
            value,
            currentPath,
          ),
        );

        return;
      }

      result.push({
        key: currentPath.join("."),
        value:
          value === null
            ? null
            : String(value),
        path: currentPath,
      });
    },
  );

  return result;
}

function prettify(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function getFieldLabel(
  path: string[],
): string {
  return prettify(
    path[path.length - 1],
  );
}

function getSectionLabel(
  path: string[],
): string {
  return prettify(path[0]);
}

function getGroupLabel(
  path: string[],
): string {
  if (path.length < 2) {
    return "General";
  }

  return prettify(path[1]);
}

function isLongText(
  key: string,
): boolean {
  return [
    "description",
    "message",
    "content",
    "copyright",
    "mission",
    "vision",
    "subtitle",
    "paragraph",
  ].some((word) =>
    key
      .toLowerCase()
      .includes(word),
  );
}

/* =========================================================
   Page
========================================================= */

export function ManageContentPage() {
  const fields = useMemo(
    () =>
      flattenContent(
        websiteContent,
      ),
    [],
  );

  const [values, setValues] =
    useState<
      Record<string, ContentValue>
    >(() =>
      Object.fromEntries(
        fields.map(
          ({
            key,
            value,
          }) => [key, value],
        ),
      ),
    );

  const [dirtyKeys, setDirtyKeys] =
    useState<Set<string>>(
      new Set(),
    );

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState(false);

  const [openSections, setOpenSections] =
    useState<Set<string>>(
      () =>
        new Set([
          getSectionLabel(
            fields[0]?.path ?? [
              "Content",
            ],
          ),
        ]),
    );

  /* =======================================================
     Group content
  ======================================================= */

  const sections = useMemo(() => {
    const result =
      new Map<
        string,
        Map<string, ContentField[]>
      >();

    fields.forEach((field) => {
      const section =
        getSectionLabel(
          field.path,
        );

      const group =
        getGroupLabel(
          field.path,
        );

      if (!result.has(section)) {
        result.set(
          section,
          new Map(),
        );
      }

      const groups =
        result.get(section)!;

      if (!groups.has(group)) {
        groups.set(
          group,
          [],
        );
      }

      groups
        .get(group)!
        .push(field);
    });

    return result;
  }, [fields]);

  /* =======================================================
     Section toggle
  ======================================================= */

  const toggleSection = (
    section: string,
  ) => {
    setOpenSections((current) => {
      const next =
        new Set(current);

      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }

      return next;
    });
  };

  /* =======================================================
     Field change
  ======================================================= */

  const handleChange = (
    key: string,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setDirtyKeys((current) => {
      const next =
        new Set(current);

      next.add(key);

      return next;
    });

    setSaved(false);
    setError(false);
  };

  /* =======================================================
     Save
  ======================================================= */

  const handleSave = async () => {
    if (
      dirtyKeys.size === 0
    ) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setError(false);

    try {
      await Promise.all(
        Array.from(
          dirtyKeys,
        ).map((key) =>
          updateContent({
            key,
            value:
              values[key] ?? null,
          }),
        ),
      );

      setDirtyKeys(new Set());
      setSaved(true);
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="app-shell-bg min-h-full space-y-4 pb-8">

      {/* =====================================================
          Compact Header
      ====================================================== */}

      <header
        className="
          relative
          overflow-hidden
          rounded-[20px]
          border
          border-border/45
          bg-card
          shadow-[0_6px_24px_rgba(31,25,78,0.045)]
        "
      >
        <div className="px-5 py-4 sm:px-6 sm:py-4.5">

          <div
            className="
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* =================================================
                Header information
            ================================================== */}

            <div className="min-w-0">

              <div className="flex items-center gap-2.5">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/[0.075]
                    text-primary/80
                  "
                >
                  <Globe2 className="h-4 w-4" />
                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <h1
                      className="
                        truncate
                        text-[16px]
                        font-medium
                        tracking-[-0.015em]
                        text-foreground
                        sm:text-[17px]
                      "
                    >
                      Manage Website Content
                    </h1>

                    {saved && (
                      <span
                        className="
                          inline-flex
                          shrink-0
                          items-center
                          gap-1
                          rounded-full
                          bg-success/[0.09]
                          px-2
                          py-0.5
                          text-[10px]
                          font-medium
                          text-success
                        "
                      >
                        <Check className="h-3 w-3" />
                        Saved
                      </span>
                    )}

                    {error && (
                      <span
                        className="
                          inline-flex
                          shrink-0
                          items-center
                          rounded-full
                          bg-destructive/[0.08]
                          px-2
                          py-0.5
                          text-[10px]
                          font-medium
                          text-destructive
                        "
                      >
                        Save failed
                      </span>
                    )}

                  </div>

                  <p
                    className="
                      mt-0.5
                      text-[11px]
                      font-normal
                      text-muted-foreground/70
                      sm:text-[12px]
                    "
                  >
                    Manage the content displayed
                    on the Madrasaty website.
                  </p>

                </div>
              </div>

            </div>

            {/* =================================================
                Header actions
            ================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
              "
            >

              {/* View website */}

              <a
                href={WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border/55
                  bg-background/70
                  px-4
                  text-[12px]
                  font-medium
                  text-foreground/75
                  shadow-sm
                  backdrop-blur-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-primary/20
                  hover:bg-primary/[0.04]
                  hover:text-primary
                "
              >
                <Globe2 className="h-[15px] w-[15px]" />

                <span className="hidden sm:inline">
                  View Website
                </span>

                <ExternalLink
                  className="
                    h-3.5
                    w-3.5
                    opacity-40
                    transition-transform
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                  "
                />
              </a>

              {/* Save */}

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  dirtyKeys.size === 0
                }
                className="
                  primary-gradient
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-4
                  text-[12px]
                  font-medium
                  text-primary-foreground
                  shadow-[0_7px_20px_rgb(var(--primary)/0.16)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-[0_10px_24px_rgb(var(--primary)/0.20)]
                  disabled:pointer-events-none
                  disabled:opacity-40
                  disabled:shadow-none
                "
              >
                {saving ? (
                  <>
                    <span
                      className="
                        h-3.5
                        w-3.5
                        animate-spin
                        rounded-full
                        border-2
                        border-primary-foreground/30
                        border-t-primary-foreground
                      "
                    />

                    <span className="hidden sm:inline">
                      Saving...
                    </span>
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-3.5 w-3.5" />

                    <span className="hidden sm:inline">
                      Saved
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />

                    <span className="hidden sm:inline">
                      {dirtyKeys.size > 0
                        ? `Save ${dirtyKeys.size}`
                        : "Save"}
                    </span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </header>

      {/* =====================================================
          Sections
      ====================================================== */}

      <div className="space-y-3.5">

        {Array.from(
          sections.entries(),
        ).map(
          ([
            section,
            groups,
          ]) => {
            const isOpen =
              openSections.has(
                section,
              );

            return (
              <div
                key={section}
                className="
                  overflow-hidden
                  rounded-[19px]
                  border
                  border-border/45
                  bg-card/95
                  shadow-[0_6px_22px_rgba(31,25,78,0.035)]
                "
              >

                {/* =================================================
                    Section header
                ================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    toggleSection(
                      section,
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-4
                    px-5
                    py-3.5
                    text-start
                    transition-colors
                    duration-200
                    hover:bg-muted/[0.16]
                    sm:px-5.5
                  "
                >

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary/[0.065]
                        text-primary/75
                      "
                    >
                      <Globe2 className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">

                      <h2
                        className="
                          text-[14px]
                          font-medium
                          tracking-[-0.01em]
                          text-foreground
                        "
                      >
                        {section}
                      </h2>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-normal
                          text-muted-foreground/60
                        "
                      >
                        {groups.size} groups
                      </p>

                    </div>
                  </div>

                  <ChevronDown
                    className={`
                      h-4
                      w-4
                      shrink-0
                      text-muted-foreground/50
                      transition-transform
                      duration-200
                      ${
                        isOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />

                </button>

                {/* =================================================
                    Section content
                ================================================== */}

                {isOpen && (
                  <div
                    className="
                      border-t
                      border-border/30
                      bg-muted/[0.06]
                      p-3.5
                      sm:p-4
                    "
                  >

                    <div className="space-y-3.5">

                      {Array.from(
                        groups.entries(),
                      ).map(
                        ([
                          group,
                          groupFields,
                        ]) => (
                          <div
                            key={group}
                            className="
                              overflow-hidden
                              rounded-[16px]
                              border
                              border-border/38
                              bg-card
                              shadow-[0_3px_14px_rgba(31,25,78,0.02)]
                            "
                          >

                            {/* Group header */}

                            <div
                              className="
                                border-b
                                border-border/30
                                bg-muted/[0.12]
                                px-4
                                py-3
                              "
                            >
                              <h3
                                className="
                                  text-[12px]
                                  font-medium
                                  text-foreground/75
                                "
                              >
                                {group}
                              </h3>
                            </div>

                            {/* Fields */}

                            <div
                              className="
                                grid
                                gap-4
                                p-4
                                lg:grid-cols-2
                              "
                            >

                              {groupFields.map(
                                (
                                  field,
                                ) => {
                                  const value =
                                    values[
                                      field.key
                                    ] ?? "";

                                  const changed =
                                    dirtyKeys.has(
                                      field.key,
                                    );

                                  const longText =
                                    isLongText(
                                      field.key,
                                    );

                                  return (
                                    <div
                                      key={
                                        field.key
                                      }
                                      className={
                                        longText
                                          ? "lg:col-span-2"
                                          : ""
                                      }
                                    >

                                      {/* Label */}

                                      <div
                                        className="
                                          mb-1.5
                                          flex
                                          items-center
                                          justify-between
                                          gap-3
                                        "
                                      >

                                        <label
                                          htmlFor={
                                            field.key
                                          }
                                          className="
                                            text-[11px]
                                            font-medium
                                            tracking-[0.01em]
                                            text-foreground/70
                                          "
                                        >
                                          {getFieldLabel(
                                            field.path,
                                          )}
                                        </label>

                                        {changed && (
                                          <span
                                            className="
                                              inline-flex
                                              items-center
                                              gap-1.5
                                              rounded-full
                                              bg-primary/[0.065]
                                              px-2
                                              py-0.5
                                              text-[9px]
                                              font-medium
                                              text-primary/75
                                            "
                                          >
                                            <span
                                              className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-primary/65
                                              "
                                            />
                                            Changed
                                          </span>
                                        )}

                                      </div>

                                      {/* Long text */}

                                      {longText ? (
                                        <textarea
                                          id={
                                            field.key
                                          }
                                          value={
                                            value
                                          }
                                          onChange={(
                                            event,
                                          ) =>
                                            handleChange(
                                              field.key,
                                              event
                                                .target
                                                .value,
                                            )
                                          }
                                          rows={4}
                                          className="
                                            w-full
                                            resize-y
                                            rounded-xl
                                            border
                                            border-input/60
                                            bg-background/50
                                            px-3.5
                                            py-2.5
                                            text-[12px]
                                            font-normal
                                            leading-5.5
                                            text-foreground
                                            outline-none
                                            transition-all
                                            duration-200
                                            placeholder:text-muted-foreground/40
                                            hover:border-primary/20
                                            hover:bg-background/70
                                            focus:border-primary/55
                                            focus:bg-background
                                            focus:ring-4
                                            focus:ring-primary/[0.055]
                                          "
                                        />
                                      ) : (
                                        <input
                                          id={
                                            field.key
                                          }
                                          type="text"
                                          value={
                                            value
                                          }
                                          onChange={(
                                            event,
                                          ) =>
                                            handleChange(
                                              field.key,
                                              event
                                                .target
                                                .value,
                                            )
                                          }
                                          className="
                                            h-10.5
                                            w-full
                                            rounded-xl
                                            border
                                            border-input/60
                                            bg-background/50
                                            px-3.5
                                            text-[12px]
                                            font-normal
                                            text-foreground
                                            outline-none
                                            transition-all
                                            duration-200
                                            placeholder:text-muted-foreground/40
                                            hover:border-primary/20
                                            hover:bg-background/70
                                            focus:border-primary/55
                                            focus:bg-background
                                            focus:ring-4
                                            focus:ring-primary/[0.055]
                                          "
                                        />
                                      )}

                                    </div>
                                  );
                                },
                              )}

                            </div>
                          </div>
                        ),
                      )}

                    </div>
                  </div>
                )}

              </div>
            );
          },
        )}

      </div>
    </section>
  );
}