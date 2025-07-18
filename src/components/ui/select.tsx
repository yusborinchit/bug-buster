import { ChevronDown } from "lucide-react";

interface Props {
  children: React.ReactNode;
  id: string;
  name: string;
  title?: string;
  isDisabled?: boolean;
}

export default function Select({
  children,
  id,
  name,
  title,
  isDisabled = false
}: Readonly<Props>) {
  return (
    <div
      data-is-disabled={isDisabled}
      {...(title && { title })}
      className="group relative flex flex-1 items-center rounded border border-zinc-500 focus-within:border-[var(--color)] focus-within:outline focus-within:outline-1 focus-within:outline-[var(--color)] data-[is-disabled=true]:opacity-50">
      <select
        id={id}
        name={name}
        disabled={isDisabled}
        className="flex-1 appearance-none rounded px-4 py-3 focus-visible:outline-none disabled:cursor-not-allowed">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 group-focus-within:text-[var(--color)]" />
    </div>
  );
}
