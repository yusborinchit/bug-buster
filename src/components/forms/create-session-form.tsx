import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useSession } from "~/hooks/use-session";
import IconButton from "../ui/icon-button";
import { Input } from "../ui/input";

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
      <Input
        id="session-name"
        name="session-name"
        placeholder="Your Session Name Here..."
      />
      <IconButton
        type="submit"
        title="Create Session"
        className="rounded bg-red-600 p-3 text-white">
        <Plus className="size-6" />
      </IconButton>
    </form>
  );
}
