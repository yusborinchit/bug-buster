import {
  ArrowDownToLine,
  ArrowUpToLine,
  BrushCleaning,
  LogIn,
  Trash2
} from "lucide-react";
import { useRef } from "react";
import CreateSessionForm from "~/components/create-session-form";
import type { Session } from "~/hooks/use-sessions";

interface Props {
  createSession: (name: string) => void;
  deleteSession: (id: string) => void;
  sessions: Session[];
  navigate: (path: string) => void;
  handleClearAll: () => Promise<void>;
  handleExport: () => Promise<void>;
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Session Manager</h2>
        <button
          className="hover:underline"
          onClick={handleClearAll}
          type="button">
          <BrushCleaning className="size-6" />
        </button>
      </header>
      <ul className="flex flex-col gap-3">
        {sessions.length > 0 &&
          sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between rounded bg-[#EDEDED] px-4 py-2.5">
              <p>{session.name}</p>
              <div className="flex items-center gap-1.5 text-neutral-500">
                <button
                  aria-label="Delete"
                  onClick={() => deleteSession(session.id)}>
                  <Trash2 className="size-6" />
                </button>
                <button
                  aria-label="Enter"
                  onClick={() => navigate(`/session/${session.id}`)}>
                  <LogIn className="size-6" />
                </button>
              </div>
            </li>
          ))}
      </ul>
      <CreateSessionForm createSession={createSession} />
      <footer className="flex items-center justify-end gap-1">
        <button
          aria-label="Export to JSON"
          className="flex items-center"
          onClick={exportData}>
          <ArrowDownToLine className="size-6" />
        </button>
        <button
          className="flex items-center"
          aria-label="Import via JSON"
          onClick={() => fileInputRef.current?.click()}>
          <ArrowUpToLine className="size-6" />
        </button>
        <input
          ref={fileInputRef}
          accept=".json"
          className="hidden"
          onChange={importData}
          type="file"
        />
      </footer>
    </div>
  );
}
