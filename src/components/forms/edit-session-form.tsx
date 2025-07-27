import type { Session } from "~/hooks/use-session";
import { LabeledInput } from "../ui/input";
import { LabeledTextarea } from "../ui/textarea";

interface Props {
  session: Session;
}

export default function EditSessionForm({ session }: Readonly<Props>) {
  return (
    <form className="flex flex-col gap-4">
      <LabeledInput
        label="Name"
        name="session-name"
        defaultValue={session.name}
        placeholder="Your Session Name Here..."
      />
      <LabeledTextarea
        label="Objective"
        name="session-objective"
        defaultValue={session.objective}
        placeholder="Your Session Objective Here..."
        rows={4}
      />
      <LabeledTextarea
        label="Scope"
        name="session-scope"
        defaultValue={session.scope}
        placeholder="Your Session Scope Here..."
        rows={4}
      />
    </form>
  );
}
