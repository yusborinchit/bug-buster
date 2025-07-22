import { createContext, useEffect, useRef, useState } from "react";
import type { Data } from "~/hooks/use-data";
import { promiseDb, type DB } from "~/utils/database";

export const DataContext = createContext<
  | {
      data: Data[];
      setData: (data: Data[]) => void;
      getDataBySessionId: (sessionId: string) => Data[];
      createData: (newData: Data) => Promise<void>;
      deleteData: (id: string) => Promise<void>;
      putData: (newData: Data) => Promise<void>;
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

  function getDataBySessionId(sessionId: string) {
    return data.filter((d) => d.sessionId === sessionId);
  }

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

  async function putData(newData: Data) {
    if (!dbRef.current) return;
    await dbRef.current.put("data", newData);
    setData((prev) => prev.map((d) => (d.id !== newData.id ? d : newData)));
  }

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        getDataBySessionId,
        createData,
        deleteData,
        putData
      }}>
      {children}
    </DataContext.Provider>
  );
}
