import { sendToBackground } from "@plasmohq/messaging";
import { ImagePlus, ImageUp, Send } from "lucide-react";
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
  toggleModal: () => void;
}

export default function CreateDataForm({
  data,
  form,
  toggleModal
}: Readonly<Props>) {
  const { navigate, searchParams, setSearchParam } = useRoute();
  const { createData } = useData();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    sessionId,
    type,
    message,
    screenshotsIds: screenshotsIdsString
  } = searchParams;
  if (!sessionId || !type) navigate("/404");

  const screenshotsIds =
    screenshotsIdsString && screenshotsIdsString !== ""
      ? screenshotsIdsString.split(",")
      : [];

  function handleAttachScreenshot(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    toggleModal();
    removeNotificationBadge();
  }

  async function handleUploadScreenshot(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    const { status } = await sendToBackground({
      name: "start-screenshot-selection",
      body: { sessionId }
    });

    if (status === "error") {
      alert(
        "For security reasons, you can't upload screenshots from this tab (Or any other internal chrome tab)."
      );
      return;
    }

    window.close();
  }

  function handleFocusTextArea() {
    if (!textAreaRef.current) return;
    textAreaRef.current.focus();
  }

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setSearchParam([{ key: "message", value: event.target.value }]);
  }

  async function handleCreateData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const message = formData.get("bug-message");
    if (!message || typeof message !== "string") return;

    const related = formData.get("bug-id");
    if (!related || typeof related !== "string") return;

    await createData({
      id: crypto.randomUUID(),
      sessionId,
      type: type as Data["type"],
      message,
      screenshotsIds,
      related: related === NO_RELATED_TO_ANY_DATA ? undefined : related,
      createdAt: new Date().toISOString()
    });

    setSearchParam([
      { key: "message", value: "" },
      { key: "screenshotsIds", value: "" }
    ]);

    form.reset();
  }

  return (
    <form onSubmit={handleCreateData} className="flex flex-col gap-2">
      <label htmlFor="bug-message" className="flex gap-1 font-semibold">
        <span className="text-[var(--color)]">#</span>
        <span>Create {form.label.singular}:</span>
      </label>
      <div className="flex flex-col overflow-hidden rounded border border-zinc-500 focus-within:border-[var(--color)] focus-within:outline focus-within:outline-1 focus-within:outline-[var(--color)]">
        <textarea
          id="bug-message"
          name="bug-message"
          ref={textAreaRef}
          onChange={handleTextAreaChange}
          defaultValue={message ?? ""}
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
          <button
            type="button"
            onClick={handleUploadScreenshot}
            title="Upload Screenshot">
            <span className="sr-only">Upload Screenshot</span>
            <ImageUp className="size-6" />
          </button>
          <button type="submit" title="Create">
            <span className="sr-only">Create {form.label.singular}</span>
            <Send className="size-6" />
          </button>
        </div>
      </div>
      <Select id="bug-id" name="bug-id" title="Select Related">
        <option value={NO_RELATED_TO_ANY_DATA}>
          No Related To Any {form.label.singular}
        </option>
        {data.length > 0 &&
          data.map((d) => (
            <option key={d.id} value={d.id}>
              {d.message.substring(0, 32) +
                (d.message.length > 32 ? "..." : "")}
            </option>
          ))}
      </Select>
    </form>
  );
}
