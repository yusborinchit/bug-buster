import { Minus, Plus } from "lucide-react";
import type { Data } from "~/hooks/use-data";
import CreateDataForm from "./create-data-form";
import DeleteDataForm from "./delete-data-form";

interface Props {
  data: Data[];
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  sessionId: string;
  type: Data["type"];
  createData: (data: Data) => void;
  deleteData: (id: string) => void;
  className?: string;
}

export default function DataForm({
  data,
  label,
  isSelected,
  onSelect,
  sessionId,
  type,
  createData,
  deleteData,
  className = "from-neutral-700 to-neutral-500"
}: Readonly<Props>) {
  return (
    <section className="flex flex-col gap-2">
      <header
        className={`flex items-center justify-between rounded-sm bg-gradient-to-t px-3.5 py-1.5 text-white shadow ${className}`}>
        <h3 className="flex items-center gap-1 text-base font-semibold">
          {data.length} {label}:
        </h3>
        <button
          onClick={onSelect}
          aria-label={isSelected ? "Deselect" : "Select"}>
          {isSelected ? (
            <Minus className="size-6" />
          ) : (
            <Plus className="size-6" />
          )}
        </button>
      </header>
      {isSelected && (
        <>
          <DeleteDataForm data={data} label={label} deleteData={deleteData} />
          <div className="border-b-1 relative my-1 h-px w-full border border-dashed border-neutral-300">
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 py-0.5 text-[10px] text-neutral-500">
              Or
            </p>
          </div>
          <CreateDataForm
            label={label}
            data={data}
            sessionId={sessionId}
            type={type}
            createData={createData}
          />
        </>
      )}
    </section>
  );
}
