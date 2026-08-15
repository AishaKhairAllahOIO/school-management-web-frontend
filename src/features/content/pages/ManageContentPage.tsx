import { useMemo, useState } from "react";
import { Check, ChevronDown, ExternalLink, Globe2, Save } from "lucide-react";

import { updateContent } from "@/features/content/api/content.api";

import websiteContent from "../data/madrasaty-website.json";

const WEBSITE_URL = "https://madrasatywebsite.netlify.app/";

type ContentValue = string | null;

type ContentField = {
  key: string;
  value: ContentValue;
  path: string[];
};

function flattenContent(data: unknown, path: string[] = []): ContentField[] {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return [];
  }

  const result: ContentField[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const currentPath = [...path, key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result.push(...flattenContent(value, currentPath));

      return;
    }

    result.push({
      key: currentPath.join("."),
      value: value === null ? null : String(value),
      path: currentPath,
    });
  });

  return result;
}

function prettify(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getFieldLabel(path: string[]): string {
  return prettify(path[path.length - 1]);
}

function getSectionLabel(path: string[]): string {
  return prettify(path[0]);
}

function getGroupLabel(path: string[]): string {
  if (path.length < 2) {
    return "General";
  }

  return prettify(path[1]);
}

function isLongText(key: string): boolean {
  return [
    "description",
    "message",
    "content",
    "copyright",
    "mission",
    "vision",
    "subtitle",
    "paragraph",
  ].some((word) => key.toLowerCase().includes(word));
}

export function ManageContentPage() {
  const fields = useMemo(() => flattenContent(websiteContent), []);

  const [values, setValues] = useState<Record<string, ContentValue>>(() =>
    Object.fromEntries(fields.map(({ key, value }) => [key, value])),
  );

  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [error, setError] = useState(false);

  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set([getSectionLabel(fields[0]?.path ?? ["Content"])]),
  );

  const sections = useMemo(() => {
    const result = new Map<string, Map<string, ContentField[]>>();

    fields.forEach((field) => {
      const section = getSectionLabel(field.path);

      const group = getGroupLabel(field.path);

      if (!result.has(section)) {
        result.set(section, new Map());
      }

      const groups = result.get(section)!;

      if (!groups.has(group)) {
        groups.set(group, []);
      }

      groups.get(group)!.push(field);
    });

    return result;
  }, [fields]);

  const toggleSection = (section: string) => {
    setOpenSections((current) => {
      const next = new Set(current);

      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }

      return next;
    });
  };
  const handleChange = (key: string, value: string) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setDirtyKeys((current) => {
      const next = new Set(current);

      next.add(key);

      return next;
    });

    setSaved(false);
    setError(false);
  };

  const handleSave = async () => {
    if (dirtyKeys.size === 0) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setError(false);

    try {
      await Promise.all(
        Array.from(dirtyKeys).map((key) =>
          updateContent({
            key,
            value: values[key] ?? null,
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
    <section className="app-shell-bg min-h-full space-y-5 pb-10">
      <header
        className="
        relative overflow-hidden
        rounded-[22px]
        border border-border/45
        bg-card
        shadow-[0_8px_28px_rgba(31,25,78,0.045)]
      "
      >
        <div
          className="
          pointer-events-none absolute
          -right-16 -top-20
          h-48 w-48
          rounded-full
          bg-primary/[0.045]
          blur-3xl
        "
        />

        <div className="relative px-5 py-5 sm:px-6">
          <div
            className="
            flex flex-col gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-[13px]
                  border border-primary/10
                  bg-primary/[0.075]
                  text-primary
                "
                >
                  <Globe2 className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1
                      className="
                      text-[17px]
                      font-semibold
                      tracking-[-0.025em]
                      text-foreground
                      sm:text-[18px]
                    "
                    >
                      Manage Website Content
                    </h1>

                    {saved && (
                      <span
                        className="
                        inline-flex items-center gap-1.5
                        rounded-full
                        bg-success/[0.09]
                        px-2.5 py-1
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
                        inline-flex items-center
                        rounded-full
                        bg-destructive/[0.08]
                        px-2.5 py-1
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
                    mt-1
                    text-[11.5px]
                    leading-5
                    text-muted-foreground/70
                    sm:text-[12px]
                  "
                  >
                    Manage the content displayed on the Madrasaty website.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <a
                href={WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="
                group
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-xl
                border border-border/55
                bg-background/70
                px-3.5
                text-[11.5px]
                font-medium
                text-foreground/70
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-primary/20
                hover:bg-primary/[0.04]
                hover:text-primary
              "
              >
                <Globe2 className="h-[15px] w-[15px]" />

                <span className="hidden sm:inline">View Website</span>

                <ExternalLink
                  className="
                  h-3.5 w-3.5
                  opacity-40
                  transition-transform
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
                />
              </a>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || dirtyKeys.size === 0}
                className="
                primary-gradient
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-xl
                px-4
                text-[11.5px]
                font-semibold
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
                      h-3.5 w-3.5
                      animate-spin
                      rounded-full
                      border-2
                      border-primary-foreground/30
                      border-t-primary-foreground
                    "
                    />

                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-3.5 w-3.5" />

                    <span className="hidden sm:inline">Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />

                    <span className="hidden sm:inline">
                      {dirtyKeys.size > 0 ? `Save ${dirtyKeys.size}` : "Save"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {Array.from(sections.entries()).map(
          ([section, groups], sectionIndex) => {
            const isOpen = openSections.has(section);

            const palettes = [
              {
                icon: "bg-primary/[0.075] text-primary",
                border: "border-primary/[0.13]",
                header: "bg-primary/[0.018]",
                content: "bg-primary/[0.012]",
                badge: "bg-primary/[0.07] text-primary",
                dot: "bg-primary",
              },
              {
                icon: "bg-info/[0.09] text-info",
                border: "border-info/[0.14]",
                header: "bg-info/[0.018]",
                content: "bg-info/[0.012]",
                badge: "bg-info/[0.08] text-info",
                dot: "bg-info",
              },
              {
                icon: "bg-success/[0.09] text-success",
                border: "border-success/[0.14]",
                header: "bg-success/[0.018]",
                content: "bg-success/[0.012]",
                badge: "bg-success/[0.08] text-success",
                dot: "bg-success",
              },
              {
                icon: "bg-warning/[0.10] text-warning",
                border: "border-warning/[0.15]",
                header: "bg-warning/[0.02]",
                content: "bg-warning/[0.012]",
                badge: "bg-warning/[0.09] text-warning",
                dot: "bg-warning",
              },
              {
                icon: "bg-destructive/[0.09] text-destructive",
                border: "border-destructive/[0.14]",
                header: "bg-destructive/[0.018]",
                content: "bg-destructive/[0.012]",
                badge: "bg-destructive/[0.08] text-destructive",
                dot: "bg-destructive",
              },
            ];

            const palette = palettes[sectionIndex % palettes.length];

            const totalFields = Array.from(groups.values()).reduce(
              (total, groupFields) => total + groupFields.length,
              0,
            );

            return (
              <div
                key={section}
                className={`
                overflow-hidden
                rounded-[20px]
                border
                ${palette.border}
                bg-card
                shadow-[0_7px_24px_rgba(31,25,78,0.035)]
                transition-shadow
                duration-200
              `}
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  className={`
                  group
                  flex w-full
                  items-center
                  justify-between
                  gap-4
                  px-5 py-4
                  text-start
                  transition-all
                  duration-200
                  ${palette.header}
                  hover:bg-muted/[0.18]
                  sm:px-5.5
                `}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-[13px]
                      ${palette.icon}
                      transition-transform
                      duration-200
                      group-hover:scale-[1.03]
                    `}
                    >
                      <Globe2 className="h-[17px] w-[17px]" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2
                          className="
                          text-[14px]
                          font-semibold
                          tracking-[-0.012em]
                          text-foreground
                        "
                        >
                          {section}
                        </h2>

                        <span
                          className={`
                          inline-flex
                          items-center
                          rounded-full
                          px-2 py-0.5
                          text-[9px]
                          font-medium
                          ${palette.badge}
                        `}
                        >
                          {groups.size} groups
                        </span>
                      </div>

                      <p
                        className="
                        mt-0.5
                        text-[10px]
                        text-muted-foreground/60
                      "
                      >
                        {totalFields} editable{" "}
                        {totalFields === 1 ? "field" : "fields"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                    flex h-8 w-8 shrink-0
                    items-center justify-center
                    rounded-lg
                    border border-border/40
                    bg-background/50
                    transition-colors
                    group-hover:bg-background
                  "
                  >
                    <ChevronDown
                      className={`
                      h-4 w-4
                      text-muted-foreground/50
                      transition-transform
                      duration-200
                      ${isOpen ? "rotate-180" : ""}
                    `}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    className={`
                    border-t
                    border-border/30
                    ${palette.content}
                    p-3.5
                    sm:p-4
                  `}
                  >
                    <div className="space-y-3.5">
                      {Array.from(groups.entries()).map(
                        ([group, groupFields]) => (
                          <div
                            key={group}
                            className="
                            overflow-hidden
                            rounded-[17px]
                            border
                            border-border/40
                            bg-card
                            shadow-[0_3px_15px_rgba(31,25,78,0.025)]
                          "
                          >
                            {/* Group Header */}
                            <div
                              className="
                              flex
                              items-center
                              justify-between
                              gap-3
                              border-b
                              border-border/30
                              bg-muted/[0.09]
                              px-4
                              py-3
                            "
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`
                                  h-1.5
                                  w-1.5
                                  rounded-full
                                  ${palette.dot}
                                  opacity-70
                                `}
                                />

                                <h3
                                  className="
                                  text-[12px]
                                  font-semibold
                                  text-foreground/75
                                "
                                >
                                  {group}
                                </h3>
                              </div>

                              <span
                                className="
                                rounded-full
                                bg-muted
                                px-2
                                py-0.5
                                text-[9px]
                                font-medium
                                text-muted-foreground/60
                              "
                              >
                                {groupFields.length}
                              </span>
                            </div>

                            {/* Fields */}
                            <div
                              className="
                              grid
                              gap-x-5
                              gap-y-4
                              p-4
                              lg:grid-cols-2
                            "
                            >
                              {groupFields.map((field) => {
                                const value = values[field.key] ?? "";

                                const changed = dirtyKeys.has(field.key);

                                const longText = isLongText(field.key);

                                return (
                                  <div
                                    key={field.key}
                                    className={longText ? "lg:col-span-2" : ""}
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
                                        htmlFor={field.key}
                                        className="
                                          text-[10.5px]
                                          font-medium
                                          text-foreground/70
                                        "
                                      >
                                        {getFieldLabel(field.path)}
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

                                    {/* Long Text */}
                                    {longText ? (
                                      <textarea
                                        id={field.key}
                                        value={value}
                                        onChange={(event) =>
                                          handleChange(
                                            field.key,
                                            event.target.value,
                                          )
                                        }
                                        rows={4}
                                        className="
                                          w-full
                                          resize-y
                                          rounded-[13px]
                                          border
                                          border-input/55
                                          bg-background/55
                                          px-3.5
                                          py-2.5
                                          text-[12px]
                                          leading-5
                                          text-foreground
                                          outline-none
                                          transition-all
                                          duration-200
                                          placeholder:text-muted-foreground/40
                                          hover:border-primary/20
                                          hover:bg-background/80
                                          focus:border-primary/50
                                          focus:bg-background
                                          focus:ring-4
                                          focus:ring-primary/[0.055]
                                        "
                                      />
                                    ) : (
                                      <input
                                        id={field.key}
                                        type="text"
                                        value={value}
                                        onChange={(event) =>
                                          handleChange(
                                            field.key,
                                            event.target.value,
                                          )
                                        }
                                        className="
                                          h-10.5
                                          w-full
                                          rounded-[13px]
                                          border
                                          border-input/55
                                          bg-background/55
                                          px-3.5
                                          text-[12px]
                                          text-foreground
                                          outline-none
                                          transition-all
                                          duration-200
                                          placeholder:text-muted-foreground/40
                                          hover:border-primary/20
                                          hover:bg-background/80
                                          focus:border-primary/50
                                          focus:bg-background
                                          focus:ring-4
                                          focus:ring-primary/[0.055]
                                        "
                                      />
                                    )}
                                  </div>
                                );
                              })}
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
