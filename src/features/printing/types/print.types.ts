export type PrintOrientation = "portrait" | "landscape";
export type PrintDocumentKind = "official-document" | "poster";

export type PrintableDocument = {
  title: string;
  html: string;
  orientation?: PrintOrientation;
  kind?: PrintDocumentKind;
};
