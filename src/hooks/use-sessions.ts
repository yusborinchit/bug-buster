import { getCurrentUrl } from "~/utils/get-current-url"
import { useStorage } from "./use-storage"

export interface Session {
  id: string
  site: string
  href: string
  name: string
  createdAt: string
}

export function useSessions() {
  const [sessions, setSessions] = useStorage<Session[]>("sessions", [])

  async function createSession(name: string) {
    const url = await getCurrentUrl()

    const newSession = {
      id: crypto.randomUUID(),
      site: url.hostname,
      href: url.href,
      name,
      createdAt: new Date().toISOString()
    }

    setSessions([...sessions, newSession])
  }

  function deleteSession(id: string) {
    setSessions(sessions.filter((s) => s.id !== id))
  }

  function clearAllSessions() {
    setSessions([])
  }

  return { sessions, setSessions, createSession, deleteSession, clearAllSessions }
}