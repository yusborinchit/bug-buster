import { sendToBackground } from "@plasmohq/messaging";
import { Frown, ImageUp, Pin } from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { NOTATION_COLORS } from "~/const";
import type { Notation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import IconButton from "../ui/icon-button";

interface Props {
  closeModal: () => void;
}

export default function AttachScreenshotModal({ closeModal }: Readonly<Props>) {
  const { t } = useTranslation();
  const { navigate, getSearchParam, setSearchParam } = useRoute();
  const { getScreenshotsBySessionId } = useScreenshot();

  const sessionId = getSearchParam("sessionId", "");
  const type = getSearchParam<Notation["type"]>("type", "bug");
  const selectedIdsString = getSearchParam("screenshotsIds", "");

  if (!sessionId || typeof sessionId !== "string") navigate("/404");

  const screenshots = getScreenshotsBySessionId(sessionId).slice(0, 8);
  const selectedIds = selectedIdsString.split(",").filter((s) => s !== "");

  const isSelected = (id: string) => selectedIds.some((s) => s === id);

  function handleCloseModal() {
    closeModal();
  }

  async function handleUploadScreenshot(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    const { status } = await sendToBackground({
      name: "start-screenshot-selection",
      body: { sessionId }
    });

    if (status === "error") {
      alert(t("modal.uploadError"));
      return;
    }

    window.close();
  }

  function handleSelectScreenshot(id: string) {
    return () =>
      setSearchParam([
        {
          key: "screenshotsIds",
          value: isSelected(id)
            ? selectedIds.filter((s) => s !== id).join(",")
            : [...selectedIds, id].join(",")
        }
      ]);
  }

  return (
    <div
      style={{ "--color": NOTATION_COLORS[type] } as CSSProperties}
      onClick={handleCloseModal}
      className="absolute inset-0 bg-black/75 backdrop-blur-[4px]">
      <section
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 right-0 top-0 flex flex-col gap-6 bg-white p-6">
        <header className="flex items-center justify-between">
          <div className="flex flex-col">
            <button
              onClick={handleCloseModal}
              className="w-fit hover:cursor-pointer hover:underline">
              {t("modal.goBack")}
            </button>
            <h2 className="text-xl font-black">{t("modal.title")}</h2>
          </div>
          <IconButton
            type="button"
            onClick={handleUploadScreenshot}
            title={t("modal.uploadScreenshot")}>
            <ImageUp className="size-10" />
          </IconButton>
        </header>
        <div className="grid grid-cols-4 gap-2">
          {screenshots.length > 0 ? (
            screenshots.map((s) => (
              <picture
                key={s.id}
                style={{ "--url": `url('${s.url}')` } as CSSProperties}
                onClick={handleSelectScreenshot(s.id)}
                className="relative aspect-[2/3] rounded bg-cover [background:var(--url)] hover:cursor-pointer">
                {isSelected(s.id) && (
                  <div className="absolute left-1 top-1 z-30 grid place-items-center rounded bg-[var(--color)] p-1 text-white">
                    <Pin className="size-3" />
                  </div>
                )}
                <img
                  src={s.url}
                  alt={t("modal.screenshotAlt")}
                  className="absolute inset-0 aspect-[2/3] w-full rounded bg-black/50 object-contain backdrop-blur-[2px]"
                />
              </picture>
            ))
          ) : (
            <div className="col-span-4 flex items-center gap-2 text-zinc-500">
              <Frown className="size-6 shrink-0" />
              <p className="font-semibold">{t("modal.emptyScreenshots")}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleCloseModal}
          className="rounded bg-[var(--color)] px-4 py-3 text-base font-semibold text-white">
          {t("modal.attachScreenshots", { count: selectedIds.length })}
        </button>
      </section>
    </div>
  );
}
