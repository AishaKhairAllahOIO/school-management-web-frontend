import type { ReactNode } from "react";

import { ImageOff, Loader2 } from "lucide-react";

import { useLocale } from "@/app/providers/locale";

import { useAuthenticatedImage } from "../hooks/useAuthenticatedImage";

type AuthenticatedUserImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: ReactNode;
  loadingClassName?: string;
};

export function AuthenticatedUserImage({
  src,
  alt,
  className = "",
  fallback,
  loadingClassName = "",
}: AuthenticatedUserImageProps) {
  const { t } = useLocale();
  const copy = t.users.shared.image;

  const {
    resolvedUrl,
    isLoading,
    hasError,
  } = useAuthenticatedImage(src);

  if (resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={alt}
        loading="lazy"
        className={className}
      />
    );
  }

  if (isLoading) {
    return (
      <div
        aria-label={`${copy.loading} ${alt}`}
        className={[
          "flex items-center justify-center bg-muted/35 text-muted-foreground",
          className,
          loadingClassName,
        ].join(" ")}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      aria-label={
        hasError
          ? `${alt} ${copy.couldNotBeLoaded}`
          : alt
      }
      className={[
        "flex items-center justify-center bg-muted/35 text-muted-foreground",
        className,
      ].join(" ")}
    >
      <ImageOff className="h-4 w-4" />
    </div>
  );
}
