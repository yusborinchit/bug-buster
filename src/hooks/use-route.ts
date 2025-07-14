import { useEffect, useRef, useState } from "react"

import { promiseDb, type DB } from "~/utils/database"

export function useRoute() {
  const dbRef = useRef<DB | null>(null)

  const [route, setRoute] = useState<string>("/")

  useEffect(() => {
    promiseDb.then(async (db) => {
      dbRef.current = db
      db.get("route", "route").then((stored) => {
        setRoute(stored?.path ?? "/")
      })
    })
  }, [])

  async function navigate(path: string) {
    if (!dbRef.current) return
    await dbRef.current.put("route", { id: "route", path })
    setRoute(path)
  }

  return { route, navigate }
}
