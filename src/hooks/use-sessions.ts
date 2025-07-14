import { useEffect, useRef, useState } from "react"

import { promiseDb, type DB } from "~/utils/database"
import { getCurrentUrl } from "~/utils/get-current-url"

export interface Session {
  id: string
  site: string
  href: string
  name: string
  createdAt: string
}

export function useSessions() {
  const dbRef = useRef<DB | null>(null)

  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    promiseDb.then((db) => {
      dbRef.current = db
      db.getAll("sessions").then((sessions) => {
        setSessions(sessions)
      })
    })
  }, [])

  async function createSession(name: string) {
    if (!dbRef.current) return

    const url = await getCurrentUrl()

    const newSession: Session = {
      id: crypto.randomUUID(),
      site: url.hostname,
      href: url.href,
      name,
      createdAt: new Date().toISOString()
    }

    await dbRef.current.add("sessions", newSession)
    setSessions((prev) => [...prev, newSession])
  }

  async function deleteSession(id: string) {
    if (!dbRef.current) return
    await dbRef.current.delete("sessions", id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  async function clearAllSessions() {
    if (!dbRef.current) return
    await dbRef.current.clear("sessions")
    setSessions([])
  }

  return {
    sessions,
    setSessions,
    createSession,
    deleteSession,
    clearAllSessions
  }
}
