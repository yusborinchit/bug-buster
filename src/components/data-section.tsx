import { useState } from "react"

import type { Data } from "~/hooks/use-data"
import { useScreenshots, type Screenshot } from "~/hooks/use-screenshots"

import ScreenshotPreviewModal from "./modals/screenshot-preview-modal"

interface Props {
  label: string
  data: Data[]
  className?: string
}

export default function DataSection({
  label,
  data,
  className = "from-neutral-700 to-neutral-500"
}: Readonly<Props>) {
  const { sortedScreenshots } = useScreenshots()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null)

  function handlePreviewScreenshot(screenshot: Screenshot) {
    setScreenshot(screenshot)
    setIsModalOpen(true)
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-2xl flex items-center gap-2 font-bold tracking-tighter">
        <span
          className={`p-1.5 rounded-sm bg-gradient-to-t grid place-items-center text-white leading-[1] font-mono ${className}`}>
          {data.length}
        </span>
        <span>{label}</span>
      </h2>
      {data.length > 0 ? (
        data.map((d) => (
          <article
            key={d.id}
            id={d.id}
            tabIndex={0}
            className="p-6 flex flex-col gap-4 rounded-sm border border-neutral-300 bg-neutral-100 focus:ring-2 focus:ring-offset-4 focus:ring-neutral-500">
            <header className="flex  flex-col gap-1">
              <div className="flex text-sm text-neutral-500 justify-between items-start">
                <div>
                  <p className="">
                    <strong>ID:</strong> #{d.id}
                  </p>
                  {d.related && (
                    <p className="text-sm text-neutral-500">
                      <strong>Related To: </strong>
                      <a href={`#${d.related}`} className="hover:underline">
                        #{d.related}
                      </a>
                    </p>
                  )}
                </div>
                <p>{new Date(d.createdAt).toLocaleString()}</p>
              </div>
              <h3 className="text-xl">{d.message}</h3>
            </header>
            <div className="grid grid-cols-4 gap-4">
              {d.screenshotsIds.length > 0 &&
                sortedScreenshots
                  .filter((s) => d.screenshotsIds.some((id) => id === s.id))
                  .map((s) => (
                    <img
                      key={`${d.id}-${s.id}`}
                      onClick={() => handlePreviewScreenshot(s)}
                      src={s.url}
                      className="w-full h-auto object-contain rounded-md"
                    />
                  ))}
            </div>
          </article>
        ))
      ) : (
        <div className="p-6 rounded-sm border border-neutral-300 bg-neutral-100 text-neutral-500">
          <p>Nothing to show here yet {":("}</p>
        </div>
      )}
      {isModalOpen && (
        <ScreenshotPreviewModal
          screenshot={screenshot}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </section>
  )
}
