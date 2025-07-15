import { ChevronDown, Trash2 } from "lucide-react";
import { useId } from "react";
import type { Data } from "~/hooks/use-data";

interface Props {
  data: Data[];
  label: string;
  deleteData: (id: string) => void;
}

export default function DeleteDataForm({
  data,
  label,
  deleteData
}: Readonly<Props>) {
  const id = useId();

  function handleDeleteData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const id = formData.get("id");
    if (!id || typeof id !== "string") return;

    deleteData(id);
    form.reset();
  }

  return (
    <form className="flex items-center" onSubmit={handleDeleteData}>
      <label className="sr-only" htmlFor={id}>
        {label} Name:
      </label>
      <div className="relative flex-1">
        <select
          className="w-full appearance-none rounded border border-neutral-300 px-4 py-2.5 text-sm hover:cursor-pointer disabled:opacity-50 disabled:hover:cursor-not-allowed"
          disabled={data.length === 0}
          id={id}
          name="id">
          {data.length > 0 ? (
            data.map((d) => (
              <option key={d.id} value={d.id}>
                {d.message.substring(0, 32) +
                  (d.message.length > 32 ? "..." : "")}
              </option>
            ))
          ) : (
            <option value="null">No {label} added yet</option>
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 z-30 size-5 -translate-y-1/2 text-neutral-500" />
      </div>
      <button
        aria-label="Delete"
        className="p-2.5 text-[var(--data-color)] disabled:opacity-50 disabled:hover:cursor-not-allowed"
        disabled={data.length === 0}
        type="submit">
        <Trash2 className="size-6" />
      </button>
    </form>
  );
}
