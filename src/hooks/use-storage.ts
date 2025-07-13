import { useEffect, useState } from "react"

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    chrome.storage.local.get(key).then((data) => {
      setValue(data[key] ?? initialValue)
    })
  }, [])

  function set(newValue: T) {
    chrome.storage.local.set({ [key]: newValue }, () => {
      setValue(newValue)
    })
  }

  return [value, set] as const
} 