import { Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import { useScreenshot, type Screenshot } from "~/hooks/use-screenshot";

interface Props {
  closeModal: () => void;
  attachedScreenshots: Screenshot[];
  handleSelectScreenshots: (screenshots: Screenshot[]) => void;
}

export default function ScreenshotSelectorModal({
  closeModal,
  attachedScreenshots,
  handleSelectScreenshots
}: Readonly<Props>) {
  const { screenshots } = useScreenshot();

  const [selected, setSelected] = useState<Screenshot[]>(attachedScreenshots);

  function handleSelect(screenshot: Screenshot) {
    if (selected.some((s) => s.id === screenshot.id))
      return setSelected((prev) => prev.filter((s) => s.id !== screenshot.id));
    setSelected((prev) => [...prev, screenshot]);
  }

  useEffect(() => {
    handleSelectScreenshots(selected);
  }, [selected, handleSelectScreenshots]);

  return (
    <div
      className="absolute inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
      onClick={closeModal}>
      <section
        className="flex flex-col gap-6 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}>
        <header className="flex-col gap-1">
          <button
            className="flex w-fit items-center gap-1 text-xs hover:underline"
            onClick={closeModal}>
            Go Back
          </button>
          <h2 className="text-xl font-bold tracking-tight">
            Attach Screenshots
          </h2>
        </header>
        <div className="grid grid-cols-4 gap-2">
          {screenshots.slice(0, 8).map((screenshot) => (
            <picture
              key={screenshot.id}
              className="group relative grid aspect-[2/3] place-items-center rounded-sm shadow"
              data-selected={selected.some((s) => s.id === screenshot.id)}
              onClick={() => handleSelect(screenshot)}>
              {selected.some((s) => s.id === screenshot.id) && (
                <div className="absolute -right-1 -top-1 z-[100] rounded-full bg-[var(--data-color)] p-1 text-white">
                  <Paperclip className="size-3" />
                </div>
              )}
              <img
                className="z-[70] aspect-[2/3] h-full w-full rounded-sm object-contain"
                src={screenshot.url}
              />
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
                <img
                  aria-hidden
                  className="inset-0 z-[60] aspect-[2/3] h-full w-full scale-110 overflow-hidden object-cover opacity-50 blur-[2px] brightness-50 grayscale"
                  src={screenshot.url}
                />
              </div>

              {/* Decoration */}
              <div className="absolute inset-1 z-[90] rounded-sm border border-dashed border-white/30"></div>
              <div className="absolute inset-0 z-[80] rounded-sm bg-transparent transition-colors group-hover:bg-black/50"></div>
            </picture>
          ))}
        </div>
      </section>
    </div>
  );
}
