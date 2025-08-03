import { useId, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  label?: string;
  id?: string;
  name: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  defaultValue?: string;
  placeholder: string;
  rows?: number;
  children?: React.ReactNode;
  className?: string;
}

export function Textarea({
  label,
  id,
  name,
  onKeyDown,
  onChange,
  defaultValue,
  placeholder,
  rows,
  children,
  className = ""
}: Readonly<Props>) {
  const fallbackId = useId();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  function handleFocusTextArea() {
    if (!textAreaRef.current) return;
    textAreaRef.current.focus();
  }

  return (
    <>
      {label && (
        <label htmlFor={id ?? fallbackId} className="sr-only">
          {label}
        </label>
      )}
      <div
        className={twMerge(
          "flex flex-col overflow-hidden rounded border border-zinc-500 focus-within:border-[var(--color,black)] focus-within:ring-1 focus-within:ring-[var(--color,black)]",
          className
        )}>
        <textarea
          ref={textAreaRef}
          id={id ?? fallbackId}
          name={name}
          onKeyDown={onKeyDown}
          onChange={onChange}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={rows}
          className="resize-y px-4 py-3 placeholder:text-zinc-500 focus-visible:outline-none"></textarea>
        {children && (
          <div
            onClick={handleFocusTextArea}
            className="flex items-center gap-1 px-4 py-3 text-[var(--color)]">
            {children}
          </div>
        )}
      </div>
    </>
  );
}

interface PropsWithLabel extends Props {
  label: string;
}

export function LabeledTextarea({
  label,
  id,
  name,
  onChange,
  defaultValue,
  placeholder,
  rows,
  children,
  className = ""
}: Readonly<PropsWithLabel>) {
  const fallbackId = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id ?? fallbackId} className="flex gap-1 font-semibold">
        <span className="text-red-600">#</span>
        <span>{label}:</span>
      </label>
      <Textarea
        id={id ?? fallbackId}
        name={name}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        className={className}>
        {children}
      </Textarea>
    </div>
  );
}
