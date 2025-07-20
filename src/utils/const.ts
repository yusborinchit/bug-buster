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
      singular: "Note",
      plural: "Notes"
    },
    type: "note",
    color: "#fe9a00"
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

export const NO_RELATED_TO_ANY_DATA = "no_related";

export const ABSURD_HIGH_Z_INDEX = "9".repeat(25);
