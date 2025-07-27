import { Frown, LogIn, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useNotation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import { useSession } from "~/hooks/use-session";
import IconButton from "../ui/icon-button";

export default function SessionList() {
  const { navigate } = useRoute();
  const { sessions, deleteSession } = useSession();
  const { getNotationsBySessionId, deleteNotation } = useNotation();
  const { getScreenshotsBySessionId, deleteScreenshot } = useScreenshot();

  function handleLoginIntoSession(sessionId: string) {
    return () => navigate(`/session?sessionId=${sessionId}`);
  }

  function handleDeleteSession(sessionId: string) {
    return async (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();

      const notations = getNotationsBySessionId(sessionId);
      const screenshots = getScreenshotsBySessionId(sessionId);

      await Promise.all([
        ...notations.map((n) => deleteNotation(n.id)),
        ...screenshots.map((s) => deleteScreenshot(s.id))
      ]);

      deleteSession(sessionId);
    };
  }

  return sessions.length > 0 ? (
    <ul className="flex flex-col gap-2">
      {sessions.map((session) => (
        <li key={session.id} className="flex items-center rounded bg-zinc-100">
          <span className="px-4 py-3 text-base">{session.name}</span>
          <div className="ml-auto flex gap-2 px-4">
            <IconButton
              type="button"
              onClick={handleLoginIntoSession(session.id)}
              title="Enter Session"
              className="py-3">
              <LogIn className="size-6" />
            </IconButton>
            <IconButton
              type="button"
              onClick={handleDeleteSession(session.id)}
              title="Delete Session"
              className="py-3">
              <Trash2 className="size-6" />
            </IconButton>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="mx-auto flex items-center gap-2 text-zinc-500">
      <Frown className="size-6" />
      <p className="font-semibold">Nothing to see here yet.</p>
    </div>
  );
}
