import { useEffect, useState } from "react";

import { axiosClient } from "@/services/axios/axiosClient";

type CachedImage = {
  objectUrl: string;
};

const imageCache = new Map<string, CachedImage>();
const pendingRequests = new Map<string, Promise<string>>();

function isLocalObjectUrl(value: string) {
  return value.startsWith("blob:") || value.startsWith("data:");
}

async function requestAuthenticatedImage(url: string): Promise<string> {
  if (isLocalObjectUrl(url)) {
    return url;
  }

  const cached = imageCache.get(url);

  if (cached) {
    return cached.objectUrl;
  }

  const pending = pendingRequests.get(url);

  if (pending) {
    return pending;
  }

  const request = axiosClient
    .get<Blob>(url, {
      responseType: "blob",
      headers: {
        Accept: "image/*",
      },
    })
    .then((response) => {
      const contentType = response.headers["content-type"] ?? response.data.type;

      if (contentType && !String(contentType).startsWith("image/")) {
        throw new Error("The photo endpoint did not return an image.");
      }

      const objectUrl = URL.createObjectURL(response.data);
      imageCache.set(url, { objectUrl });
      return objectUrl;
    })
    .finally(() => {
      pendingRequests.delete(url);
    });

  pendingRequests.set(url, request);
  return request;
}

export function useAuthenticatedImage(
  sourceUrl: string | null | undefined,
) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(() => {
    if (!sourceUrl) {
      return null;
    }

    return isLocalObjectUrl(sourceUrl)
      ? sourceUrl
      : imageCache.get(sourceUrl)?.objectUrl ?? null;
  });

  const [isLoading, setIsLoading] = useState(Boolean(sourceUrl && !resolvedUrl));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    if (!sourceUrl) {
      setResolvedUrl(null);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    if (isLocalObjectUrl(sourceUrl)) {
      setResolvedUrl(sourceUrl);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const cached = imageCache.get(sourceUrl);

    if (cached) {
      setResolvedUrl(cached.objectUrl);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    setResolvedUrl(null);
    setIsLoading(true);
    setHasError(false);

    void requestAuthenticatedImage(sourceUrl)
      .then((objectUrl) => {
        if (active) {
          setResolvedUrl(objectUrl);
        }
      })
      .catch(() => {
        if (active) {
          setResolvedUrl(null);
          setHasError(true);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [sourceUrl]);

  return {
    resolvedUrl,
    isLoading,
    hasError,
  };
}
