import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { promiseDb, type DB } from "~/database";

export const RouteContext = createContext<
  | {
      route: string;
      navigate: (path: string) => void;
      searchParams: Record<string, string>;
      setSearchParam: (params: { key: string; value: string }[]) => void;
    }
  | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
}

export default function RouteProvider({ children }: Readonly<Props>) {
  const dbRef = useRef<DB | null>(null);
  const [route, setRoute] = useState<string>("/home");

  const searchParams: Record<string, string> = useMemo(() => {
    const searchParamsString = route.split("?").at(1);
    if (!searchParamsString) return {};

    const searchParams = new URLSearchParams(searchParamsString);
    const result: Record<string, string> = searchParams
      .entries()
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    return result;
  }, [route]);

  useEffect(() => {
    promiseDb.then((db) => {
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

  async function setSearchParam(params: { key: string; value: string }[]) {
    if (!dbRef.current) return;

    const [path, searchParamsString] = route.split("?");
    const searchParams = new URLSearchParams(searchParamsString || "");

    for (const { key, value } of params) searchParams.set(key, value);

    const newRoute = `${path}?${searchParams.toString()}`;
    await dbRef.current.put("route", { id: "route", path: newRoute });

    setRoute(newRoute);
  }

  return (
    <RouteContext.Provider
      value={{ route, navigate, searchParams, setSearchParam }}>
      {children}
    </RouteContext.Provider>
  );
}
