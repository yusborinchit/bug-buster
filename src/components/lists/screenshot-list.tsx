import { Frown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Notation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import ScreenshotCard from "../cards/screenshot-card";

export default function ScreenshotList() {
  const { t } = useTranslation();
  const { navigate, getSearchParam } = useRoute();
  const { getScreenshotsBySessionId } = useScreenshot();

  const sessionId = getSearchParam("sessionId", "");
  const type = getSearchParam<Notation["type"]>("type", "bug");

  if (!sessionId || !type) navigate("/404");

  const screenshots = getScreenshotsBySessionId(sessionId)
    .filter((s) => s.type === type)
    .slice(0, 8);

  return (
    <div className="grid grid-cols-4 gap-2">
      {screenshots.length > 0 ? (
        screenshots.map((s) => <ScreenshotCard key={s.id} screenshot={s} />)
      ) : (
        <div className="col-span-4 flex items-center gap-2 text-zinc-500">
          <Frown className="size-6 shrink-0" />
          <p className="font-semibold">{t("modal.emptyScreenshots")}</p>
        </div>
      )}
    </div>
  );
}
