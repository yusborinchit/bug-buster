import { useState } from "react";
import type { Data } from "~/hooks/use-data";
import { useScreenshot, type Screenshot } from "~/hooks/use-screenshot";
import ScreenshotPreviewModal from "./modals/screenshot-preview-modal";

interface Props {
  label: string;
  data: Data[];
  className?: string;
}

export default function DataSection({
  label,
  data,
  className = "from-neutral-700 to-neutral-500"
}: Readonly<Props>) {
  const { screenshots } = useScreenshot();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null);

  function handlePreviewScreenshot(screenshot: Screenshot) {
    setScreenshot(screenshot);
    setIsModalOpen(true);
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
        <span
          className={`grid place-items-center rounded-sm bg-gradient-to-t p-1.5 font-mono leading-[1] text-white ${className}`}>
          {data.length}
        </span>
        <span>{label}</span>
      </h2>
      {data.length > 0 ? (
        data.map((d) => (
          <article
            key={d.id}
            className="flex flex-col gap-4 rounded-sm border border-neutral-300 bg-neutral-100 p-6 focus:ring-2 focus:ring-neutral-500 focus:ring-offset-4"
            id={d.id}
            tabIndex={0}>
            <header className="flex flex-col gap-1">
              <div className="flex items-start justify-between text-sm text-neutral-500">
                <div>
                  <p className="">
                    <strong>ID:</strong> #{d.id}
                  </p>
                  {d.related && (
                    <p className="text-sm text-neutral-500">
                      <strong>Related To: </strong>
                      <a className="hover:underline" href={`#${d.related}`}>
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
                screenshots
                  .filter((s) => d.screenshotsIds.some((id) => id === s.id))
                  .map((s) => (
                    <img
                      key={`${d.id}-${s.id}`}
                      className="h-auto w-full rounded-md object-contain"
                      onClick={() => handlePreviewScreenshot(s)}
                      src={s.url}
                    />
                  ))}
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-sm border border-neutral-300 bg-neutral-100 p-6 text-neutral-500">
          <p>Nothing to show here yet {":("}</p>
        </div>
      )}
      {isModalOpen && (
        <ScreenshotPreviewModal
          closeModal={() => setIsModalOpen(false)}
          screenshot={screenshot}
        />
      )}
    </section>
  );
}
