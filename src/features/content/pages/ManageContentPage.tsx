import { useMemo, useState } from "react";

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
};

function flattenContent(
  data: unknown,
  prefix = "",
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
      const fullKey = prefix
        ? `${prefix}.${key}`
        : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        result.push(
          ...flattenContent(
            value,
            fullKey,
          ),
        );

        return;
      }

      result.push({
        key: fullKey,
        value:
          value === null
            ? null
            : String(value),
      });
    },
  );

  return result;
}

function formatKey(key: string): string {
  return key
    .split(".")
    .map((part) =>
      part
        .replace(/_/g, " ")
        .replace(
          /\b\w/g,
          (char) => char.toUpperCase(),
        ),
    )
    .join(" / ");
}

function getSectionName(key: string): string {
  const [section] = key.split(".");

  return formatKey(section);
}

function isLongText(key: string): boolean {
  const longTextKeywords = [
    "description",
    "message",
    "copyright",
    "promise",
    "mission",
    "vision",
  ];

  return longTextKeywords.some(
    (keyword) =>
      key.toLowerCase().includes(keyword),
  );
}

export function ManageContentPage() {
  const initialFields = useMemo(
    () => flattenContent(websiteContent),
    [],
  );

  const [values, setValues] =
    useState<Record<string, ContentValue>>(
      () =>
        Object.fromEntries(
          initialFields.map(
            ({ key, value }) => [
              key,
              value,
            ],
          ),
        ),
    );

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [dirtyKeys, setDirtyKeys] =
    useState<Set<string>>(
      () => new Set(),
    );

  const fieldsBySection =
    useMemo(() => {
      const groups =
        new Map<
          string,
          ContentField[]
        >();

      initialFields.forEach(
        (field) => {
          const section =
            getSectionName(field.key);

          if (!groups.has(section)) {
            groups.set(
              section,
              [],
            );
          }

          groups
            .get(section)!
            .push(field);
        },
      );

      return Array.from(
        groups.entries(),
      );
    }, [initialFields]);

  const handleValueChange = (
    key: string,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setDirtyKeys((current) => {
      const next = new Set(current);

      next.add(key);

      return next;
    });

    setMessage(null);
    setError(null);
  };

  const handleSave = async () => {
    if (dirtyKeys.size === 0) {
      setMessage(
        "No changes to save.",
      );

      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const changedKeys =
        Array.from(dirtyKeys);

      await Promise.all(
        changedKeys.map((key) =>
          updateContent({
            key,
            value:
              values[key] ?? null,
          }),
        ),
      );

      setDirtyKeys(new Set());

      setMessage(
        `${changedKeys.length} content item${
          changedKeys.length === 1
            ? ""
            : "s"
        } saved successfully.`,
      );
    } catch (err) {
      console.error(
        "Failed to save content:",
        err,
      );

      setError(
        "Some content could not be saved. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-full space-y-6">
      {/* Header */}
      <div className="rounded-[26px] border border-border/45 bg-card p-6 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Manage Content
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage the text content displayed
              across the website.
            </p>
          </div>

          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-medium transition hover:bg-muted"
          >
            View Website
          </a>
        </div>

        {/* Status */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {initialFields.length} content fields
          </span>

          {dirtyKeys.size > 0 && (
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              {dirtyKeys.size} unsaved{" "}
              {dirtyKeys.size === 1
                ? "change"
                : "changes"}
            </span>
          )}
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        {fieldsBySection.map(
          ([section, fields]) => (
            <div
              key={section}
              className="overflow-hidden rounded-[26px] border border-border/45 bg-card shadow-[0_10px_35px_rgba(30,20,70,0.035)]"
            >
              {/* Section header */}
              <div className="border-b border-border/45 bg-muted/30 px-5 py-4">
                <h2 className="text-base font-semibold">
                  {section}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {fields.length} content{" "}
                  {fields.length === 1
                    ? "field"
                    : "fields"}
                </p>
              </div>

              {/* Fields */}
              <div className="divide-y divide-border/40">
                {fields.map(
                  ({
                    key,
                  }) => {
                    const value =
                      values[key] ?? "";

                    const changed =
                      dirtyKeys.has(key);

                    const longText =
                      isLongText(key);

                    return (
                      <div
                        key={key}
                        className="p-5"
                      >
                        <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <label
                            htmlFor={key}
                            className="text-sm font-medium"
                          >
                            {formatKey(key)}
                          </label>

                          {changed && (
                            <span className="text-xs font-medium text-primary">
                              Unsaved
                            </span>
                          )}
                        </div>

                        <p className="mb-3 break-all font-mono text-[11px] text-muted-foreground">
                          {key}
                        </p>

                        {longText ? (
                          <textarea
                            id={key}
                            value={value}
                            onChange={(event) =>
                              handleValueChange(
                                key,
                                event.target
                                  .value,
                              )
                            }
                            rows={4}
                            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        ) : (
                          <input
                            id={key}
                            type="text"
                            value={value}
                            onChange={(event) =>
                              handleValueChange(
                                key,
                                event.target
                                  .value,
                              )
                            }
                            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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

      {/* Save bar */}
      <div className="sticky bottom-4 z-20 rounded-2xl border border-border/50 bg-card/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            {message && (
              <span className="text-green-600">
                {message}
              </span>
            )}

            {error && (
              <span className="text-destructive">
                {error}
              </span>
            )}

            {!message &&
              !error &&
              dirtyKeys.size === 0 && (
                <span className="text-muted-foreground">
                  All changes are saved.
                </span>
              )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              dirtyKeys.size === 0
            }
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : `Save Changes${
                  dirtyKeys.size > 0
                    ? ` (${dirtyKeys.size})`
                    : ""
                }`}
          </button>
        </div>
      </div>
    </section>
  );
}