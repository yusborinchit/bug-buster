import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, type CSSProperties } from "react";
import { FORM_TYPES } from "~/const";
import type { Notation } from "~/hooks/use-notation";
import IconButton from "../ui/icon-button";
import { LabeledInput } from "../ui/input";
import { LabeledTextarea } from "../ui/textarea";

interface Props {
  notation: Notation;
}

export default function EditNotationForm({ notation }: Readonly<Props>) {
  const [isVisible, setIsVisible] = useState(false);

  const form = FORM_TYPES.find((f) => f.type === notation.type);

  function handleToggleVisibility(event: React.MouseEvent) {
    event.stopPropagation();
    setIsVisible((prev) => !prev);
  }

  return (
    <article
      style={{ "--color": form.color } as CSSProperties}
      className="flex flex-col gap-4">
      <header
        onClick={handleToggleVisibility}
        className="flex items-center justify-between rounded bg-[var(--color)] font-medium text-white hover:cursor-pointer">
        <h4 className="px-4 py-3 text-base">{notation.title}</h4>
        <IconButton
          type="button"
          onClick={handleToggleVisibility}
          title={isVisible ? "Hide Form" : "Show Form"}
          className="px-4 py-3">
          {isVisible ? (
            <ChevronDown className="size-6" />
          ) : (
            <ChevronUp className="size-6" />
          )}
        </IconButton>
      </header>
      {isVisible && (
        <form className="flex flex-col gap-4 px-6 pb-6">
          <LabeledInput
            label="Title"
            name="notation-title"
            defaultValue={notation.title}
            placeholder="Your Notation Title Here..."
          />
          <LabeledTextarea
            label="Description"
            name="notation-description"
            defaultValue={notation.description}
            placeholder="Your Notation Description Here..."
            rows={4}
          />
        </form>
      )}
    </article>
  );
}
