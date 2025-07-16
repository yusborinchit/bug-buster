import { createContext, useEffect, useRef, useState } from "react";
import type { Session } from "~/hooks/use-session";
import { promiseDb, type DB } from "~/utils/database";
import { getCurrentUrl } from "~/utils/get-current-url";

export const SessionContext = createContext<
  | {
      sessions: Session[];
      setSessions: (sessions: Session[]) => void;
      createSession: (name: string) => void;
      deleteSession: (id: string) => void;
    }
  | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
}

export default function SessionProvider({ children }: Readonly<Props>) {
  const dbRef = useRef<DB | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    promiseDb.then((db) => {
      dbRef.current = db;
      db.getAll("sessions").then(setSessions);
    });
  }, []);

  async function createSession(name: string) {
    if (!dbRef.current) return;

    const url = await getCurrentUrl();
    const newSession: Session = {
      id: crypto.randomUUID(),
      site: url.hostname,
      href: url.href,
      name,
      createdAt: new Date().toISOString()
    };

    await dbRef.current.add("sessions", newSession);
    setSessions((prev) => [...prev, newSession]);
  }

  async function deleteSession(id: string) {
    if (!dbRef.current) return;
    await dbRef.current.delete("sessions", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <SessionContext.Provider
      value={{ sessions, createSession, deleteSession, setSessions }}>
      {children}
    </SessionContext.Provider>
  );
}
