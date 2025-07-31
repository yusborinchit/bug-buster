import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "~/hooks/use-session";
import { getActiveSiteUrl } from "~/utils/get-active-site-url";
import IconButton from "../ui/icon-button";
import { Input } from "../ui/input";

export default function CreateSessionForm() {
  const { t } = useTranslation();

  const { createSession } = useSession();

  async function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("session-name");
    if (!name || typeof name !== "string") return;

    const url = await getActiveSiteUrl();
    createSession({
      id: crypto.randomUUID(),
      name,
      site: url.hostname,
      href: url.href,
      createdAt: new Date().toISOString()
    });

    form.reset();
  }

  return (
    <form onSubmit={handleCreateSession} className="flex gap-2">
      <Input
        id="session-name"
        name="session-name"
        placeholder={t("home.sessionNamePlaceholder")}
      />
      <IconButton
        type="submit"
        title={t("home.createSession")}
        className="rounded bg-red-600 p-3 text-white">
        <Plus className="size-6" />
      </IconButton>
    </form>
  );
}
