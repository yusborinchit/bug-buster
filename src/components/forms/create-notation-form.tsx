import { ImagePlus, Send } from "lucide-react";
import {
  useRef,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent
} from "react";
import { useTranslation } from "react-i18next";
import { useNotation, type Notation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import IconButton from "../ui/icon-button";
import Select from "../ui/select";
import { Textarea } from "../ui/textarea";

interface Props {
  openModal: () => void;
}

export default function CreateNotationForm({ openModal }: Readonly<Props>) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const { navigate, getSearchParam, setSearchParam } = useRoute();
  const { createNotation } = useNotation();

  const sessionId = getSearchParam("sessionId", "");
  const type = getSearchParam<Notation["type"]>("type", "bug");
  const title = getSearchParam("title", "");
  const screenshotsIdsString = getSearchParam("screenshotsIds", "");

  if (!sessionId || !type) navigate("/404");

  const screenshotsIds = screenshotsIdsString
    .split(",")
    .filter((s) => s !== "");

  function handleAttachScreenshot(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    openModal();
  }

  function handleTextAreaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!formRef.current) return;

    const { key } = event;
    if (key !== "Enter" || event.shiftKey) return;

    formRef.current.requestSubmit();
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
      type,
      title,
      screenshotsIds,
      priority,
      severity,
      createdAt: new Date().toISOString()
    });

    setSearchParam([
      { key: "title", value: "" },
      { key: "screenshotsIds", value: "" }
    ]);

    form.reset();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleCreateNotation}
      className="flex flex-col gap-2">
      <label htmlFor="notation-title" className="flex gap-1 font-semibold">
        <span className="text-[var(--color)]">#</span>
        <span>
          {t("form.createNotationLabel", { type: t(`${type}.singular`) })}
        </span>
      </label>
      {type === "bug" && (
        <div className="grid grid-cols-2 gap-2">
          <Select
            id="notation-priority"
            name="notation-priority"
            title={t("form.selectPriority")}>
            <option value="low">{t("form.lowPriority")}</option>
            <option value="medium">{t("form.mediumPriority")}</option>
            <option value="high">{t("form.highPriority")}</option>
          </Select>
          <Select
            id="notation-severity"
            name="notation-severity"
            title={t("form.selectSeverity")}>
            <option value="minor">{t("form.minorSeverity")}</option>
            <option value="moderate">{t("form.moderateSeverity")}</option>
            <option value="major">{t("form.majorSeverity")}</option>
            <option value="critical">{t("form.criticalSeverity")}</option>
          </Select>
        </div>
      )}
      <Textarea
        id="notation-title"
        name="notation-title"
        onKeyDown={handleTextAreaKeyDown}
        onChange={handleTextAreaChange}
        defaultValue={title}
        placeholder={t("form.notationTitlePlaceholder", {
          type: t(`${type}.singular`)
        })}
        rows={3}>
        <p className="text-xs text-black">
          {screenshotsIds.length} {t("form.screenshotsAttached")}
        </p>
        <IconButton
          type="button"
          onClick={handleAttachScreenshot}
          title={t("form.attachScreenshot")}
          className="ml-auto">
          <ImagePlus className="size-6" />
        </IconButton>
        <IconButton
          type="submit"
          title={t("form.createNotation", { type: t(`${type}.singular`) })}>
          <Send className="size-6" />
        </IconButton>
      </Textarea>
    </form>
  );
}
