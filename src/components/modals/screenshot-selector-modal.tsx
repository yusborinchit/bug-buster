import { Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import { useScreenshots, type Screenshot } from "~/hooks/use-screenshots";

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
  const { sortedScreenshots } = useScreenshots();
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
      onClick={closeModal}
      className="absolute inset-0 z-50 overflow-y-scroll bg-black/50 backdrop-blur-[2px]">
      <section
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-6 bg-white px-4 py-6 shadow-lg">
        <header className="flex-col gap-2">
          <button
            onClick={closeModal}
            className="flex w-fit items-center gap-1 text-xs hover:underline">
            Go Back
          </button>
          <h2 className="flex gap-1 text-xl font-bold leading-[1] tracking-tight">
            <span className="font-medium text-neutral-500">#</span>
            <span>Select a screenshot</span>
          </h2>
        </header>
        <div className="grid grid-cols-4 gap-2">
          {sortedScreenshots.slice(0, 8).map((screenshot) => (
            <picture
              key={screenshot.id}
              onClick={() => handleSelect(screenshot)}
              data-selected={selected.some((s) => s.id === screenshot.id)}
              className="group relative grid aspect-[2/3] place-items-center rounded-sm shadow">
              {selected.some((s) => s.id === screenshot.id) && (
                <div className="absolute -right-1 -top-1 z-[100] rounded-full bg-gradient-to-t from-red-700 to-red-500 p-1 text-white">
                  <Paperclip className="size-3" />
                </div>
              )}
              <img
                src={screenshot.url}
                className="z-[70] aspect-[2/3] h-full w-full rounded-sm object-contain"
              />
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
                <img
                  aria-hidden
                  src={screenshot.url}
                  className="inset-0 z-[60] aspect-[2/3] h-full w-full scale-110 overflow-hidden object-cover opacity-50 blur-[2px] brightness-50 grayscale"
                />
              </div>

              {/* Decoration */}
              <div className="absolute inset-1 z-[90] rounded-sm border border-dashed border-white/30"></div>
              <div className="absolute inset-0 z-[80] rounded-sm bg-transparent transition-colors group-hover:bg-black/50"></div>
            </picture>
          ))}
        </div>
        <button
          onClick={closeModal}
          className="grid place-items-center rounded-sm bg-gradient-to-t from-red-700 to-red-500 px-4 py-2.5 font-medium text-white shadow">
          Attach {selected.length} Screenshots
        </button>
      </section>
    </div>
  );
}
