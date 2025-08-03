import { ArrowLeft } from "lucide-react";
import { type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { NOTATION_COLORS } from "~/const";
import { useNotation, type Notation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useSession } from "~/hooks/use-session";
import PopupContainer from "../containers/popup-container";
import CreateNotationForm from "../forms/create-notation-form";
import DeleteNotationForm from "../forms/delete-notation-form";
import AttachScreenshotModal from "../modals/attach-screenshot-modal";
import IconButton from "../ui/icon-button";

export default function FormPopup() {
  const { t } = useTranslation();
  const { navigate, getSearchParam, setSearchParam } = useRoute();
  const { getSessionById } = useSession();
  const { getNotationsBySessionId } = useNotation();

  const sessionId = getSearchParam("sessionId", "");
  const type = getSearchParam<Notation["type"]>("type", "bug");
  const modal = getSearchParam("modal", "");

  if (!sessionId || !type) navigate("/404");

  const session = getSessionById(sessionId);
  const notations = getNotationsBySessionId(sessionId);

  if (!session) navigate("/404");

  const filteredNotations = notations.filter((n) => n.type === type);

  function handleGoToSession() {
    navigate(`/session?sessionId=${sessionId}`);
  }

  function handleOpenModal() {
    setSearchParam([{ key: "modal", value: "screenshot" }]);
  }

  function handleCloseModal() {
    setSearchParam([{ key: "modal", value: "" }]);
  }

  return (
    <PopupContainer>
      <header className="flex flex-col">
        <button
          onClick={handleGoToSession}
          className="w-fit hover:cursor-pointer hover:underline">
          {t("form.goBack")}
        </button>
        <h2 className="text-xl font-black">
          {t("form.title", { type: t(`${type}.plural`) })}
        </h2>
      </header>
      <section
        style={{ "--color": NOTATION_COLORS[type] } as CSSProperties}
        className="flex flex-col gap-6">
        <div className="flex items-center justify-between rounded bg-[var(--color)] text-white">
          <h3 className="px-4 py-3 text-base font-medium">
            {filteredNotations.length} {t(`${type}.plural`)}
          </h3>
          <IconButton
            type="button"
            onClick={handleGoToSession}
            title={t("form.exitForm")}
            className="px-4 py-3 text-white">
            <ArrowLeft className="size-6" />
          </IconButton>
        </div>
        <CreateNotationForm openModal={handleOpenModal} />
        <DeleteNotationForm notations={filteredNotations} />
      </section>
      {modal && <AttachScreenshotModal closeModal={handleCloseModal} />}
    </PopupContainer>
  );
}
