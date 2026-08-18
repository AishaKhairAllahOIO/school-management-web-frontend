import type { ReactNode } from "react";

import type { PrintIdentity } from "../types/print.types";

interface FinancialDocumentTemplateProps {
  identity: PrintIdentity;

  documentNumber: string;
  date: string;
  title: string;

  children: ReactNode;

  showStamp?: boolean;
  showSignature?: boolean;
}

export function FinancialDocumentTemplate({
  identity,
  documentNumber,
  date,
  title,
  children,
  showStamp = true,
  showSignature = true,
}: FinancialDocumentTemplateProps) {
  return (
    <div
      className="financial-document"
      style={{
        width: "148mm",
        minHeight: "210mm",
        boxSizing: "border-box",
        margin: "0 auto",
        padding: "10mm",
        background: "#ffffff",
        color: "#111827",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          paddingBottom: "10px",
          borderBottom: "1px solid #d1d5db",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "54px",
            height: "54px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {identity.logoUrl ? (
            <img
              src={identity.logoUrl}
              alt={identity.schoolName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                width: "46px",
                height: "46px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "8px",
                color: "#9ca3af",
              }}
            >
              LOGO
            </div>
          )}
        </div>

        {/* School identity */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "17px",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {identity.schoolName}
          </div>

          {identity.schoolNumber && (
            <div
              style={{
                marginTop: "3px",
                fontSize: "9px",
                color: "#6b7280",
              }}
            >
              School No. {identity.schoolNumber}
            </div>
          )}
        </div>

        {/* Date */}
        <div
          style={{
            width: "62px",
            flexShrink: 0,
            textAlign: "right",
            fontSize: "9px",
            color: "#6b7280",
          }}
        >
          {date}
        </div>
      </header>

      {/* DOCUMENT HEADER */}
      <section
        style={{
          textAlign: "center",
          padding: "14px 0 12px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h1>

        <div
          style={{
            marginTop: "5px",
            fontSize: "9px",
            color: "#6b7280",
          }}
        >
          Document No. {documentNumber}
        </div>
      </section>

      {/* FEATURE CONTENT */}
      <main>{children}</main>

      {/* SIGNATURE / STAMP */}
      {(showStamp || showSignature) && (
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "24px",
            marginTop: "28px",
            paddingTop: "10px",
          }}
        >
          {showStamp && (
            <div
              style={{
                width: "115px",
                height: "65px",
                border: "1px dashed #9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "9px",
                color: "#6b7280",
              }}
            >
              School Stamp
            </div>
          )}

          {showSignature && (
            <div
              style={{
                width: "130px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  height: "45px",
                  borderBottom: "1px solid #9ca3af",
                }}
              />

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "9px",
                  color: "#6b7280",
                }}
              >
                Authorized Signature
              </div>
            </div>
          )}
        </footer>
      )}
    </div>
  );
}