import { useContext } from "react";
import { ScreenshotContext } from "~/contexts/screenshot-context";
import type { Notation } from "./use-notation";

export interface Screenshot {
  id: string;
  type: Notation["type"];
  sessionId: string;
  url: string;
  width: number;
  height: number;
  createdAt: string;
}

export function useScreenshot() {
  const context = useContext(ScreenshotContext);
  if (!context) throw new Error("ScreenshotContext not found");
  return context;
}
