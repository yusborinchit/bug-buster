import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useRoute } from "~/hooks/use-route";
import IconButton from "../ui/icon-button";

interface Props {
  url: string;
  type: string;
  count: number;
  color: string;
}

export default function FormCard({ url, type, count, color }: Readonly<Props>) {
  const { t } = useTranslation();
  const { navigate } = useRoute();

  function handleGoToForm() {
    navigate(url);
  }

  return (
    <li
      style={{ "--color": color } as CSSProperties}
      className="flex items-center justify-between rounded bg-[var(--color)]">
      <span className="px-4 py-3 font-medium">
        {count} {t(`${type}.plural`)}
      </span>
      <IconButton
        type="button"
        onClick={handleGoToForm}
        title={t("session.enterForm")}
        className="px-4 py-3">
        <ArrowRight className="size-6" />
      </IconButton>
    </li>
  );
}
