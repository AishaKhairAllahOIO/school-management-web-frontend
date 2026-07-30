import {
  Check,
  MapPin,
} from "lucide-react";

type SchoolLocationMapProps = {
  schoolName: string;
  latitude: string;
  longitude: string;
};

function parseCoordinate(
  value: string,
) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

export function SchoolLocationMap({
  schoolName,
  latitude,
  longitude,
}: SchoolLocationMapProps) {
  const parsedLatitude =
    parseCoordinate(latitude);

  const parsedLongitude =
    parseCoordinate(longitude);

  const hasValidCoordinates =
    parsedLatitude !== null &&
    parsedLongitude !== null &&
    parsedLatitude >= -90 &&
    parsedLatitude <= 90 &&
    parsedLongitude >= -180 &&
    parsedLongitude <= 180 &&
    !(
      parsedLatitude === 0 &&
      parsedLongitude === 0
    );

  const mapQuery = hasValidCoordinates
    ? `${parsedLatitude},${parsedLongitude}`
    : "";

  const mapUrl = hasValidCoordinates
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        mapQuery,
      )}&z=16&output=embed`
    : "";

  return (
    <section
      className={[
        "relative h-full min-h-[390px]",
        "overflow-hidden",
        "rounded-[24px]",
        "border border-border/45",
        "bg-card",
        "shadow-[0_10px_35px_rgba(30,20,70,0.035)]",
      ].join(" ")}
    >
      {hasValidCoordinates ? (
        <span
          className={[
            "absolute right-5 top-5 z-20",
            "flex h-8 w-8",
            "items-center justify-center",
            "rounded-full",
            "border border-emerald-500/20",
            "bg-card/95",
            "text-emerald-600",
            "shadow-sm",
            "backdrop-blur",
          ].join(" ")}
          title="Location completed"
          aria-label="Location completed"
        >
          <Check
            size={17}
            strokeWidth={2.5}
          />
        </span>
      ) : null}

      {hasValidCoordinates ? (
        <iframe
          key={mapUrl}
          src={mapUrl}
          title={`${
            schoolName.trim() || "School"
          } location map`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={[
            "h-full min-h-[390px]",
            "w-full border-0",
          ].join(" ")}
          allowFullScreen
        />
      ) : (
        <div
          className={[
            "flex h-full min-h-[390px]",
            "items-center justify-center",
            "bg-muted/[0.24]",
            "px-8 text-center",
          ].join(" ")}
        >
          <div>
            <span
              className={[
                "mx-auto flex h-14 w-14",
                "items-center justify-center",
                "rounded-[18px]",
                "bg-card",
                "text-muted-foreground",
                "shadow-sm",
              ].join(" ")}
            >
              <MapPin
                size={25}
                strokeWidth={1.7}
              />
            </span>

            <p className="mt-4 text-sm font-semibold text-foreground">
              Map preview unavailable
            </p>

            <p
              className={[
                "mx-auto mt-1.5 max-w-sm",
                "text-xs leading-5",
                "text-muted-foreground",
              ].join(" ")}
            >
              Complete the latitude and
              longitude fields to place the
              school on the map.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}