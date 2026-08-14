import { useState } from "react";

import {
  updateContent,
} from "@/features/content/api/content.api";

export function ManageContentPage() {
  const [key, setKey] = useState(
    "home_page.hero.title_part_1",
  );

  const [value, setValue] = useState(
    "Empowering",
  );

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const handleSave = async () => {
    setMessage(null);
    setError(null);
    setIsSaving(true);

    try {
      await updateContent({
        key,
        value,
      });

      setMessage(
        "Content saved successfully.",
      );
    } catch (error) {
      console.error(error);

      setError(
        "Failed to save content.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-[26px] border border-border/45 bg-card p-5 shadow-[0_10px_35px_rgba(30,20,70,0.035)]">
      <h1 className="text-lg font-semibold">
        Manage Content
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Manage website content.
      </p>

      <div className="mt-6 max-w-2xl space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Content Key
          </label>

          <input
            type="text"
            value={key}
            onChange={(event) =>
              setKey(event.target.value)
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="home_page.hero.title_part_1"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Content Value
          </label>

          <textarea
            value={value}
            onChange={(event) =>
              setValue(event.target.value)
            }
            rows={5}
            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Enter content..."
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={
            isSaving ||
            !key.trim()
          }
          className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : "Save Content"}
        </button>

        {message && (
          <p className="text-sm text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}