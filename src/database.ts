import { openDB, type IDBPDatabase } from "idb";
import type { Notation } from "~/hooks/use-notation";
import type { Screenshot } from "~/hooks/use-screenshot";
import type { Session } from "~/hooks/use-session";

interface DBSchema {
  sessions: Session;
  notations: Notation;
  route: {
    id: "route";
    path: string;
  };
  screenshots: Screenshot;
}

export const getDatabase = () =>
  openDB<DBSchema>("bug-buster", 1, {
    upgrade(db) {
      db.createObjectStore("sessions", { keyPath: "id" });
      db.createObjectStore("notations", { keyPath: "id" });
      db.createObjectStore("route", { keyPath: "id" });
      db.createObjectStore("screenshots", { keyPath: "id" });
    }
  });

export type DB = IDBPDatabase<DBSchema>;
