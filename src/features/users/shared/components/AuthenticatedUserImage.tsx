import type { ReactNode } from "react";

import { ImageOff, Loader2 } from "lucide-react";

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
  const { resolvedUrl, isLoading, hasError } = useAuthenticatedImage(src);

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
        aria-label={`Loading ${alt}`}
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
      aria-label={hasError ? `${alt} could not be loaded` : alt}
      className={[
        "flex items-center justify-center bg-muted/35 text-muted-foreground",
        className,
      ].join(" ")}
    >
      <ImageOff className="h-4 w-4" />
    </div>
  );
}
