import { LogIn, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useRoute } from "~/hooks/use-route";
import { useSession } from "~/hooks/use-session";

export default function SessionList() {
  const { navigate } = useRoute();
  const { sessions, deleteSession } = useSession();

  function handleLoginIntoSession(sessionId: string) {
    return () => navigate(`/session?sessionId=${sessionId}`);
  }

  function handleDeleteSession(sessionId: string) {
    return (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      deleteSession(sessionId);
    };
  }

  return sessions.length > 0 ? (
    <ul className="flex flex-col gap-2">
      {sessions.map((session) => (
        <li
          key={session.id}
          onClick={handleLoginIntoSession(session.id)}
          className="flex items-center rounded bg-zinc-200">
          <span className="px-4 py-3 text-base">{session.name}</span>
          <div className="ml-auto flex gap-2 px-4">
            <button
              onClick={handleLoginIntoSession(session.id)}
              title="Enter Session"
              className="py-3">
              <span className="sr-only">Login</span>
              <LogIn className="size-6" />
            </button>
            <button
              onClick={handleDeleteSession(session.id)}
              title="Delete Session"
              className="py-3">
              <span className="sr-only">Delete</span>
              <Trash2 className="size-6" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <>There are no sessions yet.</>
  );
}
