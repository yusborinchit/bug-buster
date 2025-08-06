import { Pin } from "lucide-react";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "~/hooks/use-route";
import type { Screenshot } from "~/hooks/use-screenshot";

interface Props {
  screenshot: Screenshot;
}

export default function ScreenshotCard({ screenshot }: Readonly<Props>) {
  const { t } = useTranslation();
  const { getSearchParam, setSearchParam } = useRoute();

  const selectedIdsString = getSearchParam("screenshotsIds", "");
  const selectedIds = selectedIdsString.split(",").filter((s) => s !== "");

  function handleSelectScreenshot() {
    const newSelectedIds = (
      selectedIds.includes(screenshot.id)
        ? selectedIds.filter((id) => id !== screenshot.id)
        : [...selectedIds, screenshot.id]
    ).join(",");
    setSearchParam([{ key: "screenshotsIds", value: newSelectedIds }]);
  }

  return (
    <picture
      style={{ "--url": `url('${screenshot.url}')` } as CSSProperties}
      onClick={handleSelectScreenshot}
      className="relative aspect-[2/3] rounded bg-cover [background:var(--url)] hover:cursor-pointer">
      {selectedIds.includes(screenshot.id) && (
        <div className="absolute right-2 top-2 z-30 grid place-items-center rounded bg-[var(--color)] p-1 text-white">
          <Pin className="size-3" />
        </div>
      )}
      <img
        src={screenshot.url}
        alt={t("modal.screenshotAlt")}
        className="absolute inset-0 aspect-[2/3] w-full rounded bg-black/50 object-contain backdrop-blur-sm"
      />
    </picture>
  );
}
