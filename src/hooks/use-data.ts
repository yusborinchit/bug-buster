import { useEffect, useRef, useState } from "react";
import { promiseDb, type DB } from "~/utils/database";

export interface Data {
  id: string;
  sessionId: string;
  screenshotsIds?: string[];
  type: "bug" | "note" | "question" | "idea";
  related?: string;
  message: string;
  createdAt: string;
}

export function useData() {
  const dbRef = useRef<DB | null>(null);

  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    promiseDb.then((db) => {
      dbRef.current = db;
      db.getAll("data").then((data) => {
        setData(data);
      });
    });
  }, []);

  async function createData(newData: Data) {
    if (!dbRef.current) return;
    await dbRef.current.add("data", newData);
    setData((prev) => [...prev, newData]);
  }

  async function deleteData(id: string) {
    if (!dbRef.current) return;
    await dbRef.current.delete("data", id);
    setData((prev) => prev.filter((d) => d.id !== id));
  }

  function getSessionData(sessionId: string) {
    return data.filter((d) => d.sessionId === sessionId);
  }

  return {
    data,
    setData,
    createData,
    deleteData,
    getSessionData
  };
}
