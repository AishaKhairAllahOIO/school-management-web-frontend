import type { ReactNode } from "react";

import { usePrintIdentity } from "../hooks/usePrintIdentity";

interface PosterTemplateProps {
  children: ReactNode;
}

export function PosterTemplate({
  children,
}: PosterTemplateProps) {
  const identity = usePrintIdentity();

  const location = [
    identity.address,
    identity.city,
    identity.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="poster-document"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#111827",
        fontFamily: "Arial, Helvetica, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* FEATURE CONTENT */}
      <main
        style={{
          flex: 1,
        }}
      >
        {children}
      </main>

      {/* SCHOOL FOOTER */}
      <footer
        style={{
          padding: "8mm 12mm",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {identity.logoUrl && (
          <img
            src={identity.logoUrl}
            alt={identity.schoolName}
            style={{
              width: "32px",
              height: "32px",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
        )}

        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {identity.schoolName}
          </div>

          {(location || identity.phoneNumber || identity.email) && (
            <div
              style={{
                marginTop: "3px",
                fontSize: "8px",
                color: "#6b7280",
              }}
            >
              {[
                location,
                identity.phoneNumber,
                identity.email,
              ]
                .filter(Boolean)
                .join(" • ")}
            </div>
          )}

          {identity.website && (
            <div
              style={{
                marginTop: "2px",
                fontSize: "8px",
                color: "#6b7280",
              }}
            >
              {identity.website}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}