import { Paperclip } from "lucide-react"
import { useEffect, useState } from "react"

import { useScreenshots, type Screenshot } from "~/hooks/use-screenshots"

interface Props {
  closeModal: () => void
  attachedScreenshots: Screenshot[]
  handleSelectScreenshots: (screenshots: Screenshot[]) => void
}

export default function ScreenshotSelectorModal({
  closeModal,
  attachedScreenshots,
  handleSelectScreenshots
}: Readonly<Props>) {
  const { sortedScreenshots } = useScreenshots()
  const [selected, setSelected] = useState<Screenshot[]>(attachedScreenshots)

  function handleSelect(screenshot: Screenshot) {
    if (selected.some((s) => s.id === screenshot.id))
      return setSelected((prev) => prev.filter((s) => s.id !== screenshot.id))
    setSelected((prev) => [...prev, screenshot])
  }

  useEffect(() => {
    handleSelectScreenshots(selected)
  }, [selected, handleSelectScreenshots])

  return (
    <div
      onClick={closeModal}
      className="absolute inset-0 bg-black/50 backdrop-blur-[2px] overflow-y-scroll z-50">
      <section
        onClick={(e) => e.stopPropagation()}
        className="px-4 py-6 flex flex-col gap-6 bg-white shadow-lg">
        <header className="flex-col gap-2">
          <button
            onClick={closeModal}
            className="hover:underline flex w-fit items-center text-xs gap-1">
            Go Back
          </button>
          <h2 className="font-bold text-xl tracking-tight leading-[1] flex gap-1">
            <span className="text-neutral-500 font-medium">#</span>
            <span>Select a screenshot</span>
          </h2>
        </header>
        <div className="grid grid-cols-4 gap-2 ">
          {sortedScreenshots.slice(0, 8).map((screenshot) => (
            <picture
              key={screenshot.id}
              onClick={() => handleSelect(screenshot)}
              data-selected={selected.some((s) => s.id === screenshot.id)}
              className="relative aspect-[2/3] grid place-items-center rounded-sm shadow group">
              {selected.some((s) => s.id === screenshot.id) && (
                <div className="bg-gradient-to-t z-[100] absolute -top-1 -right-1 p-1 rounded-full from-red-700 to-red-500 text-white">
                  <Paperclip className="size-3" />
                </div>
              )}
              <img
                src={screenshot.url}
                className="w-full h-full object-contain aspect-[2/3] z-[70] rounded-sm"
              />
              <div className="inset-0 absolute overflow-hidden pointer-events-none rounded-sm">
                <img
                  aria-hidden
                  src={screenshot.url}
                  className="w-full object-cover inset-0 aspect-[2/3] h-full z-[60] brightness-50 blur-[2px] scale-110 opacity-50 overflow-hidden grayscale"
                />
              </div>

              {/* Decoration */}
              <div className="absolute inset-1 border rounded-sm border-dashed border-white/30 z-[90]"></div>
              <div className="absolute inset-0 bg-transparent z-[80] transition-colors group-hover:bg-black/50 rounded-sm"></div>
            </picture>
          ))}
        </div>
        <button
          onClick={closeModal}
          className="px-4 place-items-center py-2.5 grid font-medium rounded-sm shadow bg-gradient-to-t from-red-700 to-red-500 text-white">
          Attach {selected.length} Screenshots
        </button>
      </section>
    </div>
  )
}
