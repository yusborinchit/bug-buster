import { useScreenshots } from "~/hooks/use-screenshots"

export default function ScreenshotSelectorModal() {
  const { sortedScreenshots } = useScreenshots()

  return (
    <div className="absolute inset-0 bg-white p-4 flex flex-col gap-2 overflow-y-scroll z-50">
      <section className="grid grid-cols-2 gap-2 ">
        {sortedScreenshots.slice(0.5).map((screenshot) => (
          <picture
            key={screenshot.id}
            className="relative group overflow-hidden aspect-square grid place-items-center rounded-sm shadow">
            <div className="absolute inset-1 border rounded-sm border-dashed border-white/40 z-60 group-hover:bg-black/30"></div>
            <img
              src={screenshot.url}
              className="w-full object-contain object-center"
            />
            <img
              aria-hidden
              src={screenshot.url}
              className="w-full object-cover absolute inset-0 h-full -z-10 brightness-150 blur-sm scale-110 opacity-75"
            />
          </picture>
        ))}
      </section>
    </div>
  )
}
