import { createContext, useEffect, useRef, useState } from "react";
import { getDatabase, type DB } from "~/database";
import type { Notation } from "~/hooks/use-notation";

export const NotationContext = createContext<
  | {
      notations: Notation[];
      setNotations: (notations: Notation[]) => void;
      getNotationsBySessionId: (sessionId: string) => Notation[];
      createNotation: (newNotation: Notation) => Promise<void>;
      deleteNotation: (id: string) => Promise<void>;
      putNotation: (notation: Notation) => Promise<void>;
    }
  | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
}

export function NotationProvider({ children }: Readonly<Props>) {
  const dbRef = useRef<DB | null>(null);
  const [notations, setNotations] = useState<Notation[]>([]);

  useEffect(() => {
    getDatabase().then((db) => {
      dbRef.current = db;
      db.getAll("notations").then(setNotations);
    });
  }, []);

  function getNotationsBySessionId(sessionId: string) {
    return notations.filter((n) => n.sessionId === sessionId);
  }

  async function createNotation(newNotation: Notation) {
    if (!dbRef.current) return;
    await dbRef.current.add("notations", newNotation);
    setNotations((prev) => [...prev, newNotation]);
  }

  async function deleteNotation(id: string) {
    if (!dbRef.current) return;
    await dbRef.current.delete("notations", id);
    setNotations((prev) => prev.filter((n) => n.id !== id));
  }

  async function putNotation(notation: Notation) {
    if (!dbRef.current) return;
    await dbRef.current.put("notations", notation);
    setNotations((prev) =>
      prev.map((n) => (n.id !== notation.id ? n : notation))
    );
  }

  return (
    <NotationContext.Provider
      value={{
        notations,
        setNotations,
        getNotationsBySessionId,
        createNotation,
        deleteNotation,
        putNotation
      }}>
      {children}
    </NotationContext.Provider>
  );
}
