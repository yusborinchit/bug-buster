import { useId } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  id?: string;
  label?: string;
  name: string;
  defaultValue?: string;
  placeholder: string;
  className?: string;
}

export function Input({
  id,
  label,
  name,
  defaultValue,
  placeholder,
  className = ""
}: Readonly<Props>) {
  const fallbackId = useId();

  return (
    <>
      {label && (
        <label htmlFor={id ?? fallbackId} className="sr-only">
          {label}
        </label>
      )}
      <input
        id={id ?? fallbackId}
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={twMerge(
          "w-full rounded border border-zinc-500 px-4 py-3 placeholder:text-zinc-500",
          className
        )}
      />
    </>
  );
}

interface PropsWithLabel extends Props {
  label: string;
}

export function LabeledInput({
  id,
  label,
  name,
  defaultValue,
  placeholder,
  className = ""
}: Readonly<PropsWithLabel>) {
  const fallbackId = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id ?? fallbackId} className="flex gap-1 font-semibold">
        <span className="text-red-600">#</span>
        <span>{label}:</span>
      </label>
      <Input
        id={id ?? fallbackId}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}
