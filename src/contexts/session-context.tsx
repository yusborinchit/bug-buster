import { createContext, useEffect, useRef, useState } from "react";
import type { Session } from "~/hooks/use-session";
import { promiseDb, type DB } from "~/utils/database";
import { getActiveSiteUrl } from "~/utils/get-current-url";

export const SessionContext = createContext<
  | {
      sessions: Session[];
      getSessionById: (sessionId: string) => Session | undefined;
      setSessions: (sessions: Session[]) => void;
      createSession: (name: string) => void;
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

  async function createSession(name: string) {
    if (!dbRef.current) return;

    const url = await getActiveSiteUrl();
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
