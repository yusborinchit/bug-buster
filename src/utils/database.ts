import { openDB, type IDBPDatabase } from "idb";
import type { Data } from "~/hooks/use-data";
import type { Screenshot } from "~/hooks/use-screenshots";
import type { Session } from "~/hooks/use-sessions";
interface DBSchema {
  sessions: Session;
  data: Data;
  route: {
    id: "route";
    path: string;
  };
  screenshots: Screenshot;
}
export const promiseDb = openDB<DBSchema>("snap-test", 1, {
  upgrade(db) {
    db.createObjectStore("sessions", {
      keyPath: "id"
    });
    db.createObjectStore("data", {
      keyPath: "id"
    });
    db.createObjectStore("route", {
      keyPath: "id"
    });
    db.createObjectStore("screenshots", {
      keyPath: "id"
    });
  }
});
export type DB = IDBPDatabase<DBSchema>;
