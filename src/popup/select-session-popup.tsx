import { ArrowDownToLine, ArrowUpToLine, LogIn, Trash2 } from "lucide-react"
import { useRef } from "react"

import CreateSessionForm from "~/components/create-session-form"
import type { Session } from "~/hooks/use-sessions"

interface Props {
  createSession: (name: string) => void
  deleteSession: (id: string) => void
  sessions: Session[]
  navigate: (path: string) => void
  handleClearAll: () => Promise<void>
  handleExport: () => Promise<void>
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export default function SelectSessionPopup({
  sessions,
  navigate,
  createSession,
  deleteSession,
  handleClearAll,
  handleExport: exportData,
  handleImport: importData
}: Readonly<Props>) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <h2 className="font-bold text-xl tracking-tight leading-[1] flex gap-1">
          <span className="text-neutral-500 font-medium">#</span>
          <span>Current Sessions:</span>
        </h2>
        <button
          type="button"
          onClick={handleClearAll}
          className="hover:underline">
          Clear All
        </button>
      </header>
      <ul className="flex flex-col gap-2">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <li
              key={session.id}
              className="p-2.5 rounded-sm border-neutral-300 bg-neutral-100 border text-neutral-500 flex gap-2">
              <div className="flex flex-col">
                <p className="text-black">{session.name}</p>
                <a
                  href={session.href}
                  target="_blank"
                  className="text-xs line-clamp-1">
                  {session.site} &rarr;
                </a>
              </div>
              <button
                onClick={() => deleteSession(session.id)}
                aria-label="Delete"
                className="ml-auto">
                <Trash2 className="size-6" />
              </button>
              <button
                onClick={() => navigate(`/session/${session.id}`)}
                aria-label="Enter">
                <LogIn className="size-6" />
              </button>
            </li>
          ))
        ) : (
          <li className="px-4 py-2.5 rounded-sm border-neutral-300 bg-neutral-100 border text-neutral-500">
            There are no sessions yet {":("}
          </li>
        )}
      </ul>
      <CreateSessionForm createSession={createSession} />
      <footer className="flex items-center justify-end gap-2">
        <button
          onClick={exportData}
          aria-label="Export to JSON"
          className="flex items-center">
          <ArrowDownToLine className="size-6" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Import via JSON"
          className="flex items-center">
          <ArrowUpToLine className="size-6" />
        </button>
        <input
          onChange={importData}
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
        />
      </footer>
    </div>
  )
}
