import {
  useEffect,
  useState,
} from "react";

import { axiosClient } from "@/services/axios/axiosClient";

const FALLBACK_IMAGE =
  "/images/avatar-placeholder.png";

export function useAuthenticatedImage(
  imageUrl?: string | null,
) {
  const [resolvedUrl, setResolvedUrl] =
    useState(FALLBACK_IMAGE);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isActive = true;

    async function loadImage() {
      if (!imageUrl) {
        setResolvedUrl(FALLBACK_IMAGE);
        return;
      }

      try {
        const response =
          await axiosClient.get<Blob>(
            imageUrl,
            {
              responseType: "blob",
            },
          );

        if (!isActive) {
          return;
        }

        objectUrl = URL.createObjectURL(
          response.data,
        );

        setResolvedUrl(objectUrl);
      } catch {
        if (isActive) {
          setResolvedUrl(FALLBACK_IMAGE);
        }
      }
    }

    void loadImage();

    return () => {
      isActive = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageUrl]);

  return resolvedUrl;
}