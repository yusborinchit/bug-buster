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
    <form onSubmit={handleDeleteData} className="flex items-center">
      <label htmlFor={id} className="sr-only">
        {label} Name:
      </label>
      <div className="relative flex-1">
        <select
          id={id}
          name="id"
          disabled={data.length === 0}
          className="w-full appearance-none rounded-sm border border-neutral-300 bg-neutral-100 p-2.5 text-xs hover:cursor-pointer disabled:opacity-50 disabled:hover:cursor-not-allowed">
          {data.length > 0 ? (
            data.map((d) => (
              <option key={d.id} value={d.id}>
                {d.message.substring(0, 32) +
                  (d.message.length > 32 ? "..." : "")}
              </option>
            ))
          ) : (
            <option value="null" className="text-neutral-500">
              No {label} added yet
            </option>
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 z-30 size-4 -translate-y-1/2 text-neutral-500" />
      </div>
      <button
        type="submit"
        aria-label="Delete"
        disabled={data.length === 0}
        className="p-2.5 text-neutral-500 disabled:opacity-50 disabled:hover:cursor-not-allowed">
        <Trash2 className="size-6" />
      </button>
    </form>
  );
}
