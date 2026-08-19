import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { Camera, ImagePlus } from "lucide-react";

import { useLocale } from "@/app/providers/locale";

import { UserAvatar } from "./UserAvatar";

type UserPhotoCardProps = {
  title: string;
  description?: string;
  photoUrl?: string | null;
  alt: string;
  authenticated?: boolean;
  editable?: boolean;
  disabled?: boolean;
  accept?: string;
  accentClassName?: string;
  icon?: ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function UserPhotoCard({
  title,
  description,
  photoUrl,
  alt,
  authenticated = false,
  editable = false,
  disabled = false,
  accept = "image/png,image/jpeg,image/webp",
  accentClassName = "bg-primary/[0.08] text-primary",
  icon,
  onChange,
}: UserPhotoCardProps) {
  const { t } = useLocale();
  const copy = t.users.shared.photo;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDroppedFile(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);

    if (inputRef.current) {
      inputRef.current.files = transfer.files;
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  const content = (
    <div className="flex w-full flex-col">
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]",
            accentClassName,
          ].join(" ")}
        >
          {icon ?? (
            <ImagePlus className="h-[18px] w-[18px]" strokeWidth={1.8} />
          )}
        </span>

        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-4 mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-[18px] border border-border/55 bg-muted/[0.16]">
        {photoUrl ? (
          authenticated ? (
            <UserAvatar
              src={photoUrl}
              alt={alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={photoUrl}
              alt={alt}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-3 px-5 text-center text-muted-foreground">
            <span
              className={[
                "flex h-14 w-14 items-center justify-center rounded-[18px]",
                accentClassName,
              ].join(" ")}
            >
              <Camera className="h-6 w-6" strokeWidth={1.7} />
            </span>

            <p className="text-[11px] leading-5">
              {editable ? copy.uploadHint : copy.noPhoto}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (!editable) {
    return (
      <section className="overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[var(--shadow-card)]">
        {content}
      </section>
    );
  }

  return (
    <label
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsDragging(false);
        }
      }}
      onDrop={handleDroppedFile}
      className={[
        "block overflow-hidden rounded-[22px] border bg-card transition-colors",
        isDragging
          ? "border-primary bg-primary/[0.035] ring-4 ring-primary/10"
          : "border-border/60",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-primary/30 hover:bg-primary/[0.012]",
      ].join(" ")}
    >
      {content}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );
}
