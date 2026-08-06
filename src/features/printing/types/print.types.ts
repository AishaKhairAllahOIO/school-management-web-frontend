export type PrintOrientation = "portrait" | "landscape";
export type PrintDocumentKind = "official-document" | "poster";

export type PrintIdentity = {
  schoolName: string;
  shortName?: string;
  logoUrl?: string | null;
  phoneNumber?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
};

export type PrintableDocument = {
  title: string;
  html: string;
  orientation?: PrintOrientation;
  kind?: PrintDocumentKind;
};
