import { sendToBackground } from "@plasmohq/messaging";
import { ChevronDown, ImagePlus, ImageUp, Send } from "lucide-react";
import { useId, useState } from "react";
import ScreenshotSelectorModal from "~/components/modals/screenshot-selector-modal";
import { useData, type Data } from "~/hooks/use-data";
import type { Screenshot } from "~/hooks/use-screenshot";
import { removeNotificationBadge } from "~/utils/notification-badge";

const NO_RELATED_ID = "no related";

interface Props {
  label: string;
  data: Data[];
  sessionId: string;
  type: Data["type"];
}

export default function CreateDataForm({
  label,
  data,
  sessionId,
  type
}: Readonly<Props>) {
  const id = useId();

  const { createData } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);

  function handleCreateData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const message = formData.get("message");
    if (!message || typeof message !== "string") return;

    const relatedId = formData.get("related-id");
    if (!relatedId || typeof relatedId !== "string") return;

    const data: Data = {
      id: crypto.randomUUID(),
      related: relatedId === NO_RELATED_ID ? undefined : relatedId,
      sessionId,
      type,
      message,
      screenshotsIds: screenshots.map((s) => s.id),
      createdAt: new Date().toISOString()
    };

    setScreenshots([]);

    createData(data);
    form.reset();
  }

  function handleAttachScreenshot() {
    removeNotificationBadge();
    setIsModalOpen(true);
  }

  function handleSubmitScreenshot() {
    sendToBackground({
      name: "start-screenshot-selection"
    });
  }

  function handleSelectScreenshots(selectedScreenshots: Screenshot[]) {
    setScreenshots(selectedScreenshots);
  }

  return (
    <>
      {isModalOpen && (
        <ScreenshotSelectorModal
          attachedScreenshots={screenshots}
          closeModal={() => setIsModalOpen(false)}
          handleSelectScreenshots={handleSelectScreenshots}
        />
      )}
      <form className="flex flex-col gap-3" onSubmit={handleCreateData}>
        <div className="flex flex-col rounded border border-neutral-300">
          <label className="sr-only" htmlFor={id}>
            New {label}:
          </label>
          <textarea
            className="flex-1 resize-none px-4 py-2.5 text-sm placeholder:text-neutral-500"
            id={id}
            name="message"
            placeholder={`Add ${label} here...`}
            rows={3}></textarea>
          <div className="flex items-center gap-1.5 p-2.5 text-[var(--data-color)]">
            {screenshots.length > 0 && (
              <p className="font-mono text-xs font-bold text-neutral-500">
                {screenshots.length} Screenshots Attached
              </p>
            )}
            <button
              aria-label="Attach a screenshot"
              className="ml-auto"
              onClick={handleAttachScreenshot}
              type="button">
              <ImagePlus className="size-6" />
            </button>
            <button
              aria-label="Upload a screenshot"
              onClick={handleSubmitScreenshot}
              type="button">
              <ImageUp className="size-6" />
            </button>
            <button aria-label={`Add ${label}`} type="submit">
              <Send className="size-6" />
            </button>
          </div>
        </div>
        <div className="relative flex-1">
          <select
            className="w-full appearance-none rounded border border-neutral-300 px-4 py-2.5 text-sm hover:cursor-pointer"
            id={id}
            name="related-id">
            <option value={NO_RELATED_ID}>Not related to anything</option>
            {data.length > 0 &&
              data.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.message.substring(0, 32) +
                    (d.message.length > 32 ? "..." : "")}
                </option>
              ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 z-30 size-5 -translate-y-1/2 text-neutral-500" />
        </div>
      </form>
    </>
  );
}
