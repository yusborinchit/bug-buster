import { createContext, useEffect, useRef, useState } from "react";
import { promiseDb, type DB } from "~/database";
import type { Session } from "~/hooks/use-session";

export const SessionContext = createContext<
  | {
      sessions: Session[];
      getSessionById: (sessionId: string) => Session | undefined;
      setSessions: (sessions: Session[]) => void;
      createSession: (session: Session) => void;
      deleteSession: (id: string) => void;
      putSession: (session: Session) => void;
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

  function getSessionById(sessionId: string) {
    return [...sessions].find((s) => s.id === sessionId);
  }

  async function createSession(session: Session) {
    if (!dbRef.current) return;
    await dbRef.current.add("sessions", session);
    setSessions((prev) => [...prev, session]);
  }

  async function deleteSession(id: string) {
    if (!dbRef.current) return;
    await dbRef.current.delete("sessions", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  async function putSession(session: Session) {
    if (!dbRef.current) return;
    await dbRef.current.put("sessions", session);
    setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
  }

  return (
    <SessionContext.Provider
      value={{
        sessions,
        getSessionById,
        createSession,
        deleteSession,
        setSessions,
        putSession
      }}>
      {children}
    </SessionContext.Provider>
  );
}
