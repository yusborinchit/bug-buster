import "~/global.css"

import { useData } from "~/hooks/use-data"
import { useRoute } from "~/hooks/use-route"
import { useSessions } from "~/hooks/use-sessions"

import SelectSessionPopup from "./select-session-popup"
import SessionPopup from "./session-popup"

export default function MainPopup() {
  const { route, navigate } = useRoute()

  const { sessions, createSession, deleteSession, clearAllSessions } =
    useSessions()

  const { createData, deleteData, clearAllData, getSessionData } = useData()

  async function exportData() {
    // const json = JSON.stringify({ sessions, data })
    // const blob = new Blob([json], { type: "application/json" })
    // const url = URL.createObjectURL(blob)
    // await chrome.downloads.download({
    //   url,
    //   filename: `snap-test.json`,
    //   saveAs: true
    // })
    // URL.revokeObjectURL(url)
  }

  async function importData(event: React.ChangeEvent<HTMLInputElement>) {
    // const file = event.target.files[0]
    // const reader = new FileReader()
    // reader.onload = async (e) => {
    //   try {
    //     const file = (e.target as FileReader).result
    //     if (typeof file !== "string") return
    //     const { sessions, data } = JSON.parse(file)
    //     if (!Array.isArray(sessions) || !Array.isArray(data)) return
    //     setSessions(sessions)
    //     setData(data)
    //   } catch (error) {
    //     alert("Invalid JSON")
    //   }
    // }
    // reader.readAsText(file)
    // event.target.value = ""
  }

  return (
    <div className="inline-block min-w-[350px] font-geist px-4 py-6 bg-white text-sm">
      {route === "/" ? (
        <SelectSessionPopup
          sessions={sessions}
          navigate={navigate}
          createSession={createSession}
          deleteSession={deleteSession}
          clearAllSessions={clearAllSessions}
          clearAllData={clearAllData}
          exportData={exportData}
          importData={importData}
        />
      ) : route.match(/^\/session\/*/) ? (
        <SessionPopup
          sessions={sessions}
          route={route}
          navigate={navigate}
          createData={createData}
          deleteData={deleteData}
          getSessionData={getSessionData}
        />
      ) : (
        <div>404 Not Found</div>
      )}
    </div>
  )
}
