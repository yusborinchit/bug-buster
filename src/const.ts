import type { IStylesOptions } from "docx";

export const FORM_TYPES = [
  {
    label: {
      singular: "Bug",
      plural: "Bugs"
    },
    type: "bug",
    color: "#fb2c36"
  },
  {
    label: {
      singular: "Question",
      plural: "Questions"
    },
    type: "question",
    color: "#00a63e"
  },
  {
    label: {
      singular: "Note",
      plural: "Notes"
    },
    type: "note",
    color: "#fe9a00"
  },
  {
    label: {
      singular: "Idea",
      plural: "Ideas"
    },
    type: "idea",
    color: "#2b7fff"
  }
] as const;

export const PRIORITY_COLORS = {
  low: "#00a63e",
  medium: "#fe9a00",
  high: "#fb2c36"
};

export const ABSURD_HIGH_Z_INDEX = "9".repeat(25);

export const MAX_DOC_IMAGE_WIDTH = 350;
export const MAX_DOC_IMAGE_HEIGHT = 200;

export const DOC_WIDTH = 9638;

export const DEFAULT_DOC_STYLES: IStylesOptions = {
  default: {
    document: {
      run: {
        size: 22,
        font: "Arial",
        color: "#000000"
      }
    }
  },
  paragraphStyles: [
    {
      id: "Heading1",
      name: "Heading 1",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        size: 84,
        bold: true,
        color: "#000000",
        font: "Arial"
      }
    },
    {
      id: "Heading2",
      name: "Heading 2",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        size: 44,
        bold: true,
        color: "#000000",
        font: "Arial"
      }
    },
    {
      id: "Heading3",
      name: "Heading 3",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        size: 34,
        bold: true,
        color: "#000000",
        font: "Arial"
      }
    }
  ]
};
