import { createContext, useEffect, useRef, useState } from "react";
import { getDatabase, type DB } from "~/database";
import type { Screenshot } from "~/hooks/use-screenshot";

export const ScreenshotContext = createContext<
  | {
      screenshots: Screenshot[];
      getScreenshotsBySessionId: (sessionId: string) => Screenshot[];
      setScreenshots: (screenshots: Screenshot[]) => void;
      createScreenshot: (screenshot: Screenshot) => void;
      deleteScreenshot: (id: string) => void;
    }
  | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
}

export default function ScreenshotProvider({ children }: Readonly<Props>) {
  const dbRef = useRef<DB | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);

  useEffect(() => {
    getDatabase().then((db) => {
      dbRef.current = db;
      db.getAll("screenshots").then((screenshots) => {
        setScreenshots(
          screenshots.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        );
      });
    });
  }, []);

  function getScreenshotsBySessionId(sessionId: string) {
    return screenshots.filter((s) => s.sessionId === sessionId);
  }

  async function createScreenshot(screenshot: Screenshot) {
    if (!dbRef.current) return;
    await dbRef.current.add("screenshots", screenshot);
    setScreenshots((prev) => [...prev, screenshot]);
  }

  async function deleteScreenshot(id: string) {
    if (!dbRef.current) return;
    await dbRef.current.delete("screenshots", id);
    setScreenshots((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <ScreenshotContext.Provider
      value={{
        screenshots,
        getScreenshotsBySessionId,
        setScreenshots,
        createScreenshot,
        deleteScreenshot
      }}>
      {children}
    </ScreenshotContext.Provider>
  );
}
