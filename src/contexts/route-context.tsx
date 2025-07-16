import { createContext, useEffect, useRef, useState } from "react";
import { promiseDb, type DB } from "~/utils/database";

export const RouteContext = createContext<
  | {
      route: string;
      navigate: (path: string) => void;
    }
  | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
}

export default function RouteProvider({ children }: Readonly<Props>) {
  const dbRef = useRef<DB | null>(null);
  const [route, setRoute] = useState<string>("/");

  useEffect(() => {
    promiseDb.then((db) => {
      dbRef.current = db;
      db.get("route", "route").then((stored) => {
        setRoute(stored?.path ?? "/");
      });
    });
  }, []);

  async function navigate(path: string) {
    if (!dbRef.current) return;
    await dbRef.current.put("route", { id: "route", path });
    setRoute(path);
  }

  return (
    <RouteContext.Provider value={{ route, navigate }}>
      {children}
    </RouteContext.Provider>
  );
}
