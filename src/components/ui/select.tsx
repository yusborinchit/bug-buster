import { ChevronDown } from "lucide-react";
import { useId } from "react";

interface Props {
  children: React.ReactNode;
  id?: string;
  name?: string;
  title?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isDisabled?: boolean;
}

export default function Select({
  children,
  id,
  name,
  title,
  onChange,
  isDisabled = false
}: Readonly<Props>) {
  const fallbackId = useId();

  return (
    <div
      data-is-disabled={isDisabled}
      {...(title && { title })}
      className="group relative flex flex-1 items-center rounded border border-zinc-500 focus-within:border-[var(--color)] focus-within:outline focus-within:outline-1 focus-within:outline-[var(--color)] data-[is-disabled=true]:opacity-50">
      <select
        id={id ?? fallbackId}
        name={name}
        disabled={isDisabled}
        onChange={onChange}
        className="min-w-0 flex-1 appearance-none rounded px-4 py-3 focus-visible:outline-none disabled:cursor-not-allowed">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 h-full -translate-y-1/2 bg-white group-focus-within:text-[var(--color)]" />
    </div>
  );
}
