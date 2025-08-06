import { sendToBackground } from "@plasmohq/messaging";
import { ImageUp } from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { NOTATION_COLORS } from "~/const";
import { useRoute } from "~/hooks/use-route";
import ScreenshotList from "../lists/screenshot-list";
import IconButton from "../ui/icon-button";

interface Props {
  closeModal: () => void;
}

export default function AttachScreenshotModal({ closeModal }: Readonly<Props>) {
  const { t } = useTranslation();
  const { navigate, getSearchParam } = useRoute();

  const sessionId = getSearchParam("sessionId", "");
  const type = getSearchParam("type", "bug");
  const selectedIdsString = getSearchParam("screenshotsIds", "");

  if (!sessionId || !type) navigate("/404");

  const selectedIds = selectedIdsString.split(",").filter((s) => s !== "");

  function handleCloseModal() {
    closeModal();
  }

  async function handleUploadScreenshot(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    const { status } = await sendToBackground({
      name: "start-screenshot-selection",
      body: { sessionId, type }
    });

    if (status === "error") return alert(t("modal.uploadError"));

    window.close();
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
        <ScreenshotList />
        <button
          onClick={handleCloseModal}
          className="rounded bg-[var(--color)] px-4 py-3 text-base font-semibold text-white">
          {t("modal.attachScreenshots", { count: selectedIds.length })}
        </button>
      </section>
    </div>
  );
}
