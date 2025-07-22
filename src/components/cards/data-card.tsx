import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type CSSProperties
} from "react";
import { useData, type Data } from "~/hooks/use-data";
import { useScreenshot } from "~/hooks/use-screenshot";
import { PRIORITY_COLORS } from "~/utils/const";

interface Props {
  data: Data;
}

export default function DataCard({ data }: Readonly<Props>) {
  const { putData } = useData();
  const { getScreenshotsBySessionId } = useScreenshot();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const screenshots = getScreenshotsBySessionId(data.sessionId);

  const resizeTextArea = useCallback(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resizeTextArea();
  }, [resizeTextArea]);

  // TODO: Add some sort of debounce here
  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
    putData({ ...data, description: e.target.value });
    resizeTextArea();
  }

  const getScreenshotById = (id: string) =>
    screenshots.find((s) => s.id === id);

  return (
    <article className="flex flex-col gap-2 py-12 last:pb-0">
      <h3 className="text-lg font-semibold leading-[1]">{data.title}</h3>
      <ul key={data.id} className="pl-5">
        {data.type === "bug" && (
          <li className="list-disc">
            <span className="underline">Priority</span>:{" "}
            <span
              style={
                {
                  "--priority-color": PRIORITY_COLORS[data.priority]
                } as CSSProperties
              }
              className="rounded bg-[var(--priority-color)] px-1 py-0.5 text-center text-xs font-bold capitalize leading-[1.5] text-white">
              {data.priority}
            </span>
          </li>
        )}
        <li className="list-disc">
          <span className="underline">Report Id</span>: {data.id}
        </li>
        {data.related && (
          <li className="list-disc">
            <span className="underline">Related To</span>: {data.related}
          </li>
        )}
        <li className="list-disc">
          <span className="underline">Reported At</span>:{" "}
          {new Date(data.createdAt).toLocaleString("es-ES")}
        </li>
      </ul>
      <textarea
        ref={textAreaRef}
        onChange={handleDescriptionChange}
        defaultValue={data.description}
        placeholder="Add some description here..."
        className="resize-none overflow-y-hidden rounded border border-zinc-500 px-4 py-3 placeholder:text-zinc-500 print:border-none print:p-0"></textarea>
      {data.screenshotsIds.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {data.screenshotsIds.map((id) => (
              <img
                key={id}
                src={getScreenshotById(id)?.url}
                alt={`Report ${data.id} Screenshot`}
                className="h-auto w-full object-contain"
              />
            ))}
          </div>
        </>
      )}
    </article>
  );
}
