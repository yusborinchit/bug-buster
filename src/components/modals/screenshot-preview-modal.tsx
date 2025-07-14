import { X } from "lucide-react"

import type { Screenshot } from "~/hooks/use-screenshots"

interface Props {
  screenshot: Screenshot
  closeModal: () => void
}

export default function ScreenshotPreviewModal({
  screenshot,
  closeModal
}: Readonly<Props>) {
  return (
    <div
      onClick={closeModal}
      className="fixed top-0 left-0 right-0 grid place-items-center bottom-0 bg-black/70 backdrop-blur-[4px] z-20">
      <div>
        <button
          onClick={closeModal}
          aria-label="Close Preview"
          className="hover:underline  ml-auto flex items-center gap-1 text-white py-2.5">
          <X className="size-6" />
        </button>
        <img onClick={(e) => e.stopPropagation()} src={screenshot.url} />
      </div>
    </div>
  )
}
