import { useContext } from "react";
import { ScreenshotContext } from "~/contexts/screenshot-context";

export interface Screenshot {
  id: string;
  sessionId: string;
  url: string;
  createdAt: string;
}

export function useScreenshot() {
  const context = useContext(ScreenshotContext);
  if (!context) throw new Error("ScreenshotContext not found");
  return context;
}
