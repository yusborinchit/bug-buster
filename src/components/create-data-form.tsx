import { Check, ChevronDown, ImagePlus, ImageUp } from "lucide-react"
import { useId, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import ScreenshotSelectorModal from "~/components/modals/screenshot-selector-modal"
import type { Data } from "~/hooks/use-data"
import type { Screenshot } from "~/hooks/use-screenshots"
import { removeNotificationBadge } from "~/utils/notification-badge"

const NO_RELATED_ID = "no related"

interface Props {
  label: string
  data: Data[]
  sessionId: string
  type: Data["type"]
  createData: (data: Data) => void
}

export default function CreateDataForm({
  label,
  data,
  sessionId,
  type,
  createData
}: Readonly<Props>) {
  const id = useId()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])

  function handleCreateData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const message = formData.get("message")
    if (!message || typeof message !== "string") return

    const relatedId = formData.get("related-id")
    if (!relatedId || typeof relatedId !== "string") return

    const data: Data = {
      id: crypto.randomUUID(),
      related: relatedId === NO_RELATED_ID ? undefined : relatedId,
      sessionId,
      type,
      message,
      screenshotsIds: screenshots.map((s) => s.id),
      createdAt: new Date().toISOString()
    }

    createData(data)

    setScreenshots([])
    form.reset()
  }

  function handleAttachScreenshot() {
    removeNotificationBadge()
    setIsModalOpen(true)
  }

  function handleSubmitScreenshot() {
    sendToBackground({
      name: "start-screenshot-selection"
    })
  }

  function handleSelectScreenshots(selectedScreenshots: Screenshot[]) {
    setScreenshots(selectedScreenshots)
  }

  return (
    <>
      {isModalOpen && (
        <ScreenshotSelectorModal
          closeModal={() => setIsModalOpen(false)}
          attachedScreenshots={screenshots}
          handleSelectScreenshots={handleSelectScreenshots}
        />
      )}
      <form onSubmit={handleCreateData} className="flex flex-col gap-2">
        <div className="flex-col flex border border-neutral-300 rounded-sm bg-neutral-100">
          <label htmlFor={id} className="sr-only">
            New {label}:
          </label>
          <textarea
            id={id}
            rows={3}
            name="message"
            placeholder={`Add ${label} here...`}
            className="flex-1 text-xs placeholder:text-neutral-500 bg-neutral-100 resize-none p-2.5"></textarea>
          <div className="p-2.5 flex gap-2 text-neutral-500 items-center">
            {screenshots.length > 0 && (
              <p className="text-xs font-bold font-mono">
                {screenshots.length} Screenshots Attached
              </p>
            )}
            <button
              type="button"
              onClick={handleAttachScreenshot}
              aria-label="Attach a screenshot"
              className="ml-auto">
              <ImagePlus className="size-6" />
            </button>
            <button
              type="button"
              onClick={handleSubmitScreenshot}
              aria-label="Upload a screenshot">
              <ImageUp className="size-6" />
            </button>
            <button type="submit" aria-label={`Add ${label}`}>
              <Check className="size-6" />
            </button>
          </div>
        </div>
        <div className="relative flex-1">
          <select
            id={id}
            name="related-id"
            className="text-xs p-2.5 appearance-none rounded-sm border border-neutral-300 bg-neutral-100 w-full hover:cursor-pointer">
            <option value={NO_RELATED_ID} className="text-neutral-500">
              Not related to anything
            </option>
            {data.length > 0 &&
              data.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.message.substring(0, 32) +
                    (d.message.length > 32 ? "..." : "")}
                </option>
              ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 z-30 -translate-y-1/2 text-neutral-500 size-4 pointer-events-none" />
        </div>
      </form>
    </>
  )
}
