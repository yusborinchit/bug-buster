import { Pin } from "lucide-react";
import type { CSSProperties } from "react";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import type { FORM_TYPES } from "~/utils/const";

interface Props {
  form: (typeof FORM_TYPES)[number];
  toggleModal: () => void;
}

export default function AttachScreenshotModal({
  form,
  toggleModal
}: Readonly<Props>) {
  const { searchParams, navigate, setSearchParam } = useRoute();
  const { getScreenshotsBySessionId } = useScreenshot();

  const { sessionId, screenshotsIds: selectedIdsString } = searchParams;
  if (!sessionId || typeof sessionId !== "string") navigate("/404");

  const screenshots = getScreenshotsBySessionId(sessionId);
  const selectedIds =
    selectedIdsString && selectedIdsString !== ""
      ? selectedIdsString.split(",")
      : [];

  const isSelected = (id: string) => selectedIds.some((s) => s === id);

  function handleCloseModal() {
    toggleModal();
  }

  function handleSelectScreenshot(id: string) {
    return () =>
      setSearchParam([
        {
          key: "screenshotsIds",
          value: isSelected(id)
            ? selectedIds.filter((s) => s !== id).join(",")
            : [...selectedIds, id].join(",")
        }
      ]);
  }

  return (
    <div
      style={{ "--color": form.color } as CSSProperties}
      onClick={handleCloseModal}
      className="absolute inset-0 bg-black/75 backdrop-blur-[4px]">
      <section
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 right-0 top-0 flex flex-col gap-6 bg-white p-6">
        <header className="flex flex-col">
          <p
            onClick={handleCloseModal}
            className="hover:cursor-pointer hover:underline">
            Go Back
          </p>
          <h2 className="text-xl font-black">Attach Screenshots</h2>
        </header>
        <div className="grid grid-cols-4 gap-2">
          {screenshots.map((s) => (
            <picture
              key={s.id}
              style={{ "--url": `url('${s.url}')` } as CSSProperties}
              onClick={handleSelectScreenshot(s.id)}
              className="relative aspect-[2/3] rounded bg-cover [background:var(--url)] hover:cursor-pointer">
              {isSelected(s.id) && (
                <div className="absolute left-1 top-1 z-30 grid place-items-center rounded bg-[var(--color)] p-1 text-white">
                  <Pin className="size-3" />
                </div>
              )}
              <img
                src={s.url}
                alt={`Screenshot taken on ${s.createdAt}`}
                className="absolute inset-0 aspect-[2/3] rounded bg-white/50 object-contain backdrop-blur-[2px]"
              />
            </picture>
          ))}
        </div>
      </section>
    </div>
  );
}
