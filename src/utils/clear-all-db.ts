import { promiseDb } from "./database";

export async function clearAllDb() {
  const db = await promiseDb;

  const stores = ["sessions", "data", "screenshots", "route"];
  const tx = db.transaction(stores, "readwrite");

  const sessionStore = tx.objectStore("sessions");
  const dataStore = tx.objectStore("data");
  const screenshotStore = tx.objectStore("screenshots");
  const routeStore = tx.objectStore("route");

  sessionStore.clear();
  dataStore.clear();
  screenshotStore.clear();
  routeStore.clear();

  routeStore.add({ id: "route", path: "/" });

  await tx.done;
}
