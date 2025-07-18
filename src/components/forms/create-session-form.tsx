import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useSession } from "~/hooks/use-session";

export default function CreateSessionForm() {
  const { createSession } = useSession();

  function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("session-name");
    if (!name || typeof name !== "string") return;

    createSession(name);
    form.reset();
  }

  return (
    <form onSubmit={handleCreateSession} className="flex gap-2">
      <label htmlFor="session-name" className="sr-only">
        Session Name
      </label>
      <input
        id="session-name"
        name="session-name"
        type="text"
        placeholder="Your Session Name Here..."
        className="w-full rounded border border-zinc-500 px-4 py-3 placeholder:text-zinc-500"
      />
      <button type="submit" className="rounded bg-red-600 p-3 text-white">
        <span className="sr-only">Create Session</span>
        <Plus className="size-6" />
      </button>
    </form>
  );
}
