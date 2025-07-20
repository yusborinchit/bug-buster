import { ImagePlus, Send } from "lucide-react";
import {
  useRef,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent
} from "react";
import { useData, type Data } from "~/hooks/use-data";
import { useRoute } from "~/hooks/use-route";
import { FORM_TYPES, NO_RELATED_TO_ANY_DATA } from "~/utils/const";
import { removeNotificationBadge } from "~/utils/notification-badge";
import Select from "../ui/select";

interface Props {
  data: Data[];
  form: (typeof FORM_TYPES)[number];
  openModal: () => void;
}

export default function CreateDataForm({
  data,
  form,
  openModal
}: Readonly<Props>) {
  const { navigate, searchParams, setSearchParam } = useRoute();
  const { createData } = useData();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    sessionId,
    type,
    title,
    screenshotsIds: screenshotsIdsString
  } = searchParams;
  if (!sessionId || !type) navigate("/404");

  const screenshotsIds =
    screenshotsIdsString && screenshotsIdsString !== ""
      ? screenshotsIdsString.split(",")
      : [];

  function handleAttachScreenshot(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    openModal();
    removeNotificationBadge();
  }

  function handleFocusTextArea() {
    if (!textAreaRef.current) return;
    textAreaRef.current.focus();
  }

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setSearchParam([{ key: "title", value: event.target.value }]);
  }

  async function handleCreateData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("data-title");
    if (!title || typeof title !== "string") return;

    const priority = formData.get("data-priority");

    const related = formData.get("data-id");
    if (!related || typeof related !== "string") return;

    await createData({
      id: crypto.randomUUID(),
      sessionId,
      type: type as Data["type"],
      title,
      screenshotsIds,
      related: related === NO_RELATED_TO_ANY_DATA ? undefined : related,
      priority: priority as Data["priority"],
      createdAt: new Date().toISOString()
    });

    setSearchParam([
      { key: "title", value: "" },
      { key: "screenshotsIds", value: "" }
    ]);

    form.reset();
  }

  return (
    <form onSubmit={handleCreateData} className="flex flex-col gap-2">
      <label htmlFor="data-title" className="flex gap-1 font-semibold">
        <span className="text-[var(--color)]">#</span>
        <span>Create {form.label.singular}:</span>
      </label>
      {form.type === "bug" && (
        <Select id="data-priority" name="data-priority" title="Select Priority">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </Select>
      )}
      <div className="flex flex-col overflow-hidden rounded border border-zinc-500 focus-within:border-[var(--color)] focus-within:outline focus-within:outline-1 focus-within:outline-[var(--color)]">
        <textarea
          id="data-title"
          name="data-title"
          ref={textAreaRef}
          onChange={handleTextAreaChange}
          defaultValue={title ?? ""}
          rows={3}
          placeholder={`Your ${form.label.singular} Here...`}
          className="resize-none px-4 py-3 placeholder:text-zinc-500 focus-visible:outline-none"></textarea>
        <div
          onClick={handleFocusTextArea}
          className="flex items-center gap-1 px-4 py-3 text-[var(--color)]">
          <p className="text-xs text-black">
            {screenshotsIds.length} Screenshots Attached
          </p>
          <button
            type="button"
            onClick={handleAttachScreenshot}
            title="Attach Screenshot"
            className="ml-auto">
            <span className="sr-only">Attach Screenshot</span>
            <ImagePlus className="size-6" />
          </button>
          <button type="submit" title="Create">
            <span className="sr-only">Create {form.label.singular}</span>
            <Send className="size-6" />
          </button>
        </div>
      </div>
      <Select id="data-id" name="data-id" title="Select Related">
        <option value={NO_RELATED_TO_ANY_DATA}>
          No Related To Any {form.label.singular}
        </option>
        {data.length > 0 &&
          data.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title.substring(0, 32) + (d.title.length > 32 ? "..." : "")}
            </option>
          ))}
      </Select>
    </form>
  );
}
