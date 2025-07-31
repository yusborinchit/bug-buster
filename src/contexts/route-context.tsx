import { createContext, useEffect, useRef, useState } from "react";
import { getDatabase, type DB } from "~/database";

export const RouteContext = createContext<
  | {
      route: string;
      navigate: (path: string) => void;
      getSearchParam: <T extends string>(key: string, defaultValue: T) => T;
      setSearchParam: (params: { key: string; value: string }[]) => void;
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
    getDatabase().then((db) => {
      dbRef.current = db;
      db.get("route", "route").then((stored) => {
        setRoute(stored?.path ?? "/home");
      });
    });
  }, []);

  async function navigate(path: string) {
    if (!dbRef.current) return;
    await dbRef.current.put("route", { id: "route", path });
    setRoute(path);
  }

  function getSearchParam<T extends string>(key: string, defaultValue: T): T {
    const [_, searchParamsString] = route.split("?");
    const searchParams = new URLSearchParams(searchParamsString ?? "");
    return (searchParams.get(key) as T) ?? defaultValue;
  }

  async function setSearchParam(params: { key: string; value: string }[]) {
    if (!dbRef.current) return;

    const [path, searchParamsString] = route.split("?");
    const searchParams = new URLSearchParams(searchParamsString ?? "");

    for (const { key, value } of params) searchParams.set(key, value);

    const newRoute = `${path}?${searchParams.toString()}`;
    await dbRef.current.put("route", { id: "route", path: newRoute });

    setRoute(newRoute);
  }

  return (
    <RouteContext.Provider
      value={{ route, navigate, getSearchParam, setSearchParam }}>
      {children}
    </RouteContext.Provider>
  );
}
