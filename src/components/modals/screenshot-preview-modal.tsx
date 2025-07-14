import { X } from "lucide-react";
import type { Screenshot } from "~/hooks/use-screenshots";

interface Props {
  screenshot: Screenshot;
  closeModal: () => void;
}

export default function ScreenshotPreviewModal({
  screenshot,
  closeModal
}: Readonly<Props>) {
  return (
    <div
      onClick={closeModal}
      className="fixed bottom-0 left-0 right-0 top-0 z-20 grid place-items-center bg-black/70 backdrop-blur-[4px]">
      <div>
        <button
          onClick={closeModal}
          aria-label="Close Preview"
          className="ml-auto flex items-center gap-1 py-2.5 text-white hover:underline">
          <X className="size-6" />
        </button>
        <img onClick={(e) => e.stopPropagation()} src={screenshot.url} />
      </div>
    </div>
  );
}
