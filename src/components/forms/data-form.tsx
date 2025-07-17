import { Minus, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import { type Data } from "~/hooks/use-data";
import CreateDataForm from "./create-data-form";
import DeleteDataForm from "./delete-data-form";

interface Props {
  data: Data[];
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  sessionId: string;
  type: Data["type"];
  color: string;
}

export default function DataForm({
  data,
  label,
  isSelected,
  onSelect,
  sessionId,
  type,
  color
}: Readonly<Props>) {
  return (
    <section
      style={{ "--data-color": color } as CSSProperties}
      className="flex flex-col gap-3">
      <header className="flex items-center justify-between rounded bg-[var(--data-color)] px-4 py-2.5 text-white">
        <h3 className="flex items-center gap-1 text-base font-semibold">
          {data.length} {label}:
        </h3>
        <button
          aria-label={isSelected ? "Deselect" : "Select"}
          onClick={onSelect}>
          {isSelected ? (
            <Minus className="size-6" />
          ) : (
            <Plus className="size-6" />
          )}
        </button>
      </header>
      {isSelected && (
        <>
          <CreateDataForm
            data={data}
            label={label}
            sessionId={sessionId}
            type={type}
          />
          <div className="border-b-1 relative my-2 h-px w-full border border-dashed border-neutral-300">
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 py-0.5 text-sm text-neutral-500">
              Or
            </p>
          </div>
          <DeleteDataForm data={data} label={label} />
        </>
      )}
    </section>
  );
}
