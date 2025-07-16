import { createContext, useEffect, useRef, useState } from "react";
import type { Data } from "~/hooks/use-data";
import { promiseDb, type DB } from "~/utils/database";

export const DataContext = createContext<
  | {
      data: Data[];
      setData: (data: Data[]) => void;
      createData: (newData: Data) => void;
      deleteData: (id: string) => void;
      getSessionData: (sessionId: string) => Data[];
    }
  | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
}

export function DataProvider({ children }: Readonly<Props>) {
  const dbRef = useRef<DB | null>(null);
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    promiseDb.then((db) => {
      dbRef.current = db;
      db.getAll("data").then(setData);
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

  return (
    <DataContext.Provider
      value={{ data, setData, createData, deleteData, getSessionData }}>
      {children}
    </DataContext.Provider>
  );
}
