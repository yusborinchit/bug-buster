import { useContext } from "react";
import { DataContext } from "~/contexts/data-context";

export interface Data {
  id: string;
  sessionId: string;
  screenshotsIds: string[];
  type: "bug" | "note" | "question" | "idea";
  title: string;
  description?: string;
  related?: string;
  priority?: "low" | "medium" | "high";
  createdAt: string;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("DataContext not found");
  return context;
}
