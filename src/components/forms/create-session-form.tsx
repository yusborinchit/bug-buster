import { Plus } from "lucide-react";
import { useSession } from "~/hooks/use-session";

export default function CreateSessionForm() {
  const { createSession } = useSession();

  async function handleCreateSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("session-name");
    if (!name || typeof name !== "string") return;

    createSession(name);
    form.reset();
  }

  return (
    <form className="flex gap-2.5" onSubmit={handleCreateSession}>
      <label className="sr-only" htmlFor="session-name">
        Session Name:
      </label>
      <input
        id="session-name"
        autoComplete="off"
        className="flex-1 rounded border border-neutral-300 px-4 py-2.5 text-sm placeholder:text-neutral-500"
        type="text"
        name="session-name"
        placeholder="Session name here..."
      />
      <button
        className="grid place-items-center rounded bg-black p-2.5 text-white"
        type="submit"
        aria-label="Create Session">
        <Plus className="size-6" />
      </button>
    </form>
  );
}
