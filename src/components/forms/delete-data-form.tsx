import { Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useData, type Data } from "~/hooks/use-data";
import { useRoute } from "~/hooks/use-route";
import { FORM_TYPES } from "~/utils/const";
import Select from "../ui/select";

interface Props {
  data: Data[];
  form: (typeof FORM_TYPES)[number];
}

export default function DeleteDataForm({ data, form }: Readonly<Props>) {
  const { navigate, searchParams } = useRoute();
  const { deleteData } = useData();

  const { sessionId, type } = searchParams;
  if (!sessionId || !type) navigate("/404");

  const isDisabled = data.length === 0;

  async function handleDeleteData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const id = formData.get("bug-id");
    if (!id || typeof id !== "string") return;

    await deleteData(id);
    form.reset();
  }

  return (
    <form onSubmit={handleDeleteData} className="flex flex-col gap-2">
      <label htmlFor="bug-id" className="flex gap-1 font-semibold">
        <span className="text-[var(--color)]">#</span>
        <span>Delete {form.label.singular}:</span>
      </label>
      <div className="flex w-full gap-2">
        <Select id="bug-id" name="bug-id" isDisabled={isDisabled}>
          {!isDisabled ? (
            data.map((d) => (
              <option key={d.id} value={d.id}>
                {d.message.substring(0, 32) +
                  (d.message.length > 32 ? "..." : "")}
              </option>
            ))
          ) : (
            <option>No {form.label.plural} Added Yet</option>
          )}
        </Select>
        <button
          type="submit"
          disabled={isDisabled}
          title="Delete"
          className="text-[var(--color)] disabled:cursor-not-allowed disabled:opacity-50">
          <span className="sr-only">Delete {form.label.singular}</span>
          <Trash2 className="size-6" />
        </button>
      </div>
    </form>
  );
}
