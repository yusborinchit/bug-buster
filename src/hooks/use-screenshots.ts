import { useEffect, useMemo, useRef, useState } from "react";
import { promiseDb, type DB } from "~/utils/database";
export interface Screenshot {
  id: string;
  url: string;
  createdAt: string;
}
export function useScreenshots() {
  const dbRef = useRef<DB | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const { sortedScreenshots } = useMemo(() => {
    return {
      sortedScreenshots: [...screenshots].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    };
  }, [screenshots]);
  useEffect(() => {
    promiseDb.then((db) => {
      dbRef.current = db;
      db.getAll("screenshots").then((screenshots) => {
        setScreenshots(screenshots);
      });
    });
  }, []);
  return {
    sortedScreenshots
  };
}
