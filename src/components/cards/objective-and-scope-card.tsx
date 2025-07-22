import type { ChangeEvent } from "react";
import { useSession, type Session } from "~/hooks/use-session";

interface Props {
  session: Session;
}

export default function ObjectiveAndScopeCard({ session }: Readonly<Props>) {
  const { putSession } = useSession();

  // TODO: Add some kind of debounce
  function handleObjectiveChange(event: ChangeEvent<HTMLTextAreaElement>) {
    putSession({ ...session, objective: event.target.value });
  }

  // TODO: Add some kind of debounce
  function handleScopeChange(event: ChangeEvent<HTMLTextAreaElement>) {
    putSession({ ...session, scope: event.target.value });
  }

  return (
    <section className="flex flex-col gap-6">
      <article className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold leading-[1] tracking-tight">
          Objective
        </h2>
        <textarea
          onChange={handleObjectiveChange}
          defaultValue={session?.objective ?? ""}
          placeholder="Add the objective here..."
          className="resize-none overflow-y-hidden rounded border border-zinc-500 px-4 py-3 placeholder:text-zinc-500 print:border-none print:p-0"></textarea>
      </article>
      <article className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold leading-[1] tracking-tight">Scope</h2>
        <textarea
          onChange={handleScopeChange}
          defaultValue={session?.scope ?? ""}
          placeholder="Add the scope here..."
          className="resize-none overflow-y-hidden rounded border border-zinc-500 px-4 py-3 placeholder:text-zinc-500 print:border-none print:p-0"></textarea>
      </article>
    </section>
  );
}
