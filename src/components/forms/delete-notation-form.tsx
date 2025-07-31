import { Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FORM_TYPES } from "~/const";
import { useNotation, type Notation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import IconButton from "../ui/icon-button";
import Select from "../ui/select";

interface Props {
  notations: Notation[];
  form: (typeof FORM_TYPES)[number];
}

export default function DeleteNotationForm({
  notations,
  form
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { navigate, getSearchParam } = useRoute();
  const { deleteNotation } = useNotation();

  const sessionId = getSearchParam("sessionId", "");
  const type = getSearchParam<Notation["type"]>("type", "bug");

  if (!sessionId || !type) navigate("/404");

  const isDisabled = notations.length === 0;

  async function handleDeleteNotation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const id = formData.get("notation-id");
    if (!id || typeof id !== "string") return;

    await deleteNotation(id);
    form.reset();
  }

  return (
    <form onSubmit={handleDeleteNotation} className="flex flex-col gap-2">
      <label htmlFor="notation-id" className="flex gap-1 font-semibold">
        <span className="text-[var(--color)]">#</span>
        <span>
          {t("form.deleteNotationLabel", { type: t(`${type}.singular`) })}
        </span>
      </label>
      <div className="flex w-full gap-2">
        <Select
          id="notation-id"
          name="notation-id"
          title={t("form.selectNotation", { type: t(`${type}.singular`) })}
          isDisabled={isDisabled}>
          {!isDisabled ? (
            notations.map((n) => (
              <option key={n.id} value={n.id}>
                {n.title.substring(0, 32) + (n.title.length > 32 ? "..." : "")}
              </option>
            ))
          ) : (
            <option>
              {t("form.emptyNotations", { type: t(`${type}.plural`) })}
            </option>
          )}
        </Select>
        <IconButton
          type="submit"
          disabled={isDisabled}
          title={t("form.deleteNotation", { type: t(`${type}.singular`) })}
          className="text-[var(--color)] disabled:cursor-not-allowed disabled:opacity-50">
          <Trash2 className="size-6" />
        </IconButton>
      </div>
    </form>
  );
}
