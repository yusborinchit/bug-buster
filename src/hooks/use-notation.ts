import { useContext } from "react";
import { NotationContext } from "~/contexts/notation-context";

export interface Notation {
  id: string;
  sessionId: string;
  screenshotsIds: string[];
  type: "bug" | "note" | "question" | "idea";
  title: string;
  severity?: "minor" | "moderate" | "major" | "critical";
  priority?: "low" | "medium" | "high";
  createdAt: string;
}

export function useNotation() {
  const context = useContext(NotationContext);
  if (!context) throw new Error("NotationContext not found");
  return context;
}
