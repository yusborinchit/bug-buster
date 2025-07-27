import { ImagePlus, Send } from "lucide-react";
import { type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import { FORM_TYPES } from "~/const";
import { useNotation, type Notation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { removeNotificationBadge } from "~/utils/notification-badge";
import IconButton from "../ui/icon-button";
import Select from "../ui/select";
import { Textarea } from "../ui/textarea";

interface Props {
  notations: Notation[];
  form: (typeof FORM_TYPES)[number];
  openModal: () => void;
}

export default function CreateNotationForm({
  notations,
  form,
  openModal
}: Readonly<Props>) {
  const { navigate, searchParams, setSearchParam } = useRoute();
  const { createNotation } = useNotation();

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

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setSearchParam([{ key: "title", value: event.target.value }]);
  }

  async function handleCreateNotation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("notation-title");
    if (!title || typeof title !== "string") return;

    const priority = formData.get("notation-priority") as Notation["priority"];
    const severity = formData.get("notation-severity") as Notation["severity"];

    await createNotation({
      id: crypto.randomUUID(),
      sessionId,
      type: type as Notation["type"],
      title,
      screenshotsIds,
      priority: priority,
      severity: severity,
      createdAt: new Date().toISOString()
    });

    setSearchParam([
      { key: "title", value: "" },
      { key: "screenshotsIds", value: "" }
    ]);

    form.reset();
  }

  return (
    <form onSubmit={handleCreateNotation} className="flex flex-col gap-2">
      <label htmlFor="notation-title" className="flex gap-1 font-semibold">
        <span className="text-[var(--color)]">#</span>
        <span>Create {form.label.singular}:</span>
      </label>
      {form.type === "bug" && (
        <div className="grid grid-cols-2 gap-2">
          <Select
            id="notation-priority"
            name="notation-priority"
            title="Select Priority">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
          <Select
            id="notation-severity"
            name="notation-severity"
            title="Select Severity">
            <option value="minor">Minor Severity</option>
            <option value="moderate">Moderate Severity</option>
            <option value="major">Major Severity</option>
            <option value="critical">Critical Severity</option>
          </Select>
        </div>
      )}
      <Textarea
        id="notation-title"
        name="notation-title"
        onChange={handleTextAreaChange}
        defaultValue={title}
        placeholder={`Your ${form.label.singular} Here...`}
        rows={3}>
        <p className="text-xs text-black">
          {screenshotsIds.length} Screenshots Attached
        </p>
        <IconButton
          type="button"
          onClick={handleAttachScreenshot}
          title="Attach Screenshot"
          className="ml-auto">
          <ImagePlus className="size-6" />
        </IconButton>
        <IconButton type="submit" title="Create">
          <Send className="size-6" />
        </IconButton>
      </Textarea>
    </form>
  );
}
