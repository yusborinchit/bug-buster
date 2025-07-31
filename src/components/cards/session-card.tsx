import { LogIn, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNotation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import { useSession, type Session } from "~/hooks/use-session";
import IconButton from "../ui/icon-button";

interface Props {
  session: Session;
}

export default function SessionCard({ session }: Readonly<Props>) {
  const { t } = useTranslation();
  const { navigate } = useRoute();
  const { deleteSession } = useSession();
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

  return (
    <li className="flex items-center rounded bg-zinc-100">
      <span className="px-4 py-3 text-base">{session.name}</span>
      <div className="ml-auto flex gap-2 px-4">
        <IconButton
          type="button"
          onClick={handleLoginIntoSession(session.id)}
          title={t("home.enterSession")}
          className="py-3">
          <LogIn className="size-6" />
        </IconButton>
        <IconButton
          type="button"
          onClick={handleDeleteSession(session.id)}
          title={t("home.deleteSession")}
          className="py-3">
          <Trash2 className="size-6" />
        </IconButton>
      </div>
    </li>
  );
}
