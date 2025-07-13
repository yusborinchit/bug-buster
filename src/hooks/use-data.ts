import { useStorage } from "./use-storage"

export interface Data {
  id: string
  sessionId: string
  type: "bug" | "note" | "question" | "idea"
  related?: string
  message: string
  createdAt: string
}

export function useData() {
  const [data, setData] = useStorage<Data[]>("data", [])

  function createData(newData: Data) {
    setData([...data, newData])
  }

  function deleteData(id: string) {
    setData(data.filter((d) => d.id !== id))
  }

  function getSessionData(sessionId: string) {
    return data.filter((d) => d.sessionId === sessionId).sort()
  }

  function clearAllData() {
    setData([])
  }

  return { data, setData, createData, deleteData, clearAllData, getSessionData }
}
