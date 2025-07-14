import type { Data } from "~/hooks/use-data"
import type { Screenshot } from "~/hooks/use-screenshots"
import type { Session } from "~/hooks/use-sessions"

import { promiseDb } from "./database"

export async function importDb(
  sessions: Session[],
  data: Data[],
  screenshots: Screenshot[],
  route: string
) {
  const db = await promiseDb

  const stores = ["sessions", "data", "screenshots", "route"]
  const tx = db.transaction(stores, "readwrite")

  const sessionStore = tx.objectStore("sessions")
  const dataStore = tx.objectStore("data")
  const screenshotStore = tx.objectStore("screenshots")
  const routeStore = tx.objectStore("route")

  sessionStore.clear()
  dataStore.clear()
  screenshotStore.clear()
  routeStore.clear()

  for (const session of sessions) sessionStore.add(session)
  for (const dataAux of data) dataStore.add(dataAux)
  for (const screenshot of screenshots) screenshotStore.add(screenshot)
  routeStore.add(route)

  await tx.done
}
