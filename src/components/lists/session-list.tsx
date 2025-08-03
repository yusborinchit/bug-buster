import { Frown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSession } from "~/hooks/use-session";
import SessionCard from "../cards/session-card";

export default function SessionList() {
  const { t } = useTranslation();
  const { sessions } = useSession();

  return sessions.length > 0 ? (
    <ul className="flex max-h-[200px] flex-col gap-2 overflow-y-scroll">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </ul>
  ) : (
    <div className="flex items-center gap-2 text-zinc-500">
      <Frown className="size-6 shrink-0" />
      <p className="font-semibold">{t("home.emptySessions")}</p>
    </div>
  );
}
