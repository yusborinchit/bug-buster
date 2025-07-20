import { sendToBackground } from "@plasmohq/messaging";
import { ImageUp, Pin } from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import type { FORM_TYPES } from "~/utils/const";

interface Props {
  form: (typeof FORM_TYPES)[number];
  closeModal: () => void;
}

export default function AttachScreenshotModal({
  form,
  closeModal
}: Readonly<Props>) {
  const { searchParams, navigate, setSearchParam } = useRoute();
  const { getScreenshotsBySessionId } = useScreenshot();

  const { sessionId, screenshotsIds: selectedIdsString } = searchParams;
  if (!sessionId || typeof sessionId !== "string") navigate("/404");

  const screenshots = getScreenshotsBySessionId(sessionId).slice(0, 8);
  const selectedIds =
    selectedIdsString && selectedIdsString !== ""
      ? selectedIdsString.split(",")
      : [];

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
      alert(
        "For security reasons, you can't upload screenshots from this tab (Or any other internal chrome tab)."
      );
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
      style={{ "--color": form.color } as CSSProperties}
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
              Go Back
            </button>
            <h2 className="text-xl font-black">Attach Screenshots</h2>
          </div>
          <button
            type="button"
            onClick={handleUploadScreenshot}
            title="Upload Screenshot">
            <span className="sr-only">Upload Screenshot</span>
            <ImageUp className="size-6" />
          </button>
        </header>
        <div className="grid grid-cols-4 gap-2">
          {screenshots.map((s) => (
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
                alt={`Screenshot taken on ${s.createdAt}`}
                className="absolute inset-0 aspect-[2/3] rounded bg-white/50 object-contain backdrop-blur-[2px]"
              />
            </picture>
          ))}
        </div>
        <button
          onClick={handleCloseModal}
          className="rounded bg-[var(--color)] px-4 py-3 text-base font-semibold text-white">
          Attach {selectedIds.length} Screenshots
        </button>
      </section>
    </div>
  );
}
