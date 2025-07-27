import { ArrowLeft } from "lucide-react";
import { type CSSProperties } from "react";
import { FORM_TYPES } from "~/const";
import { useNotation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useSession } from "~/hooks/use-session";
import PopupContainer from "../containers/popup-container";
import CreateNotationForm from "../forms/create-notation-form";
import DeleteNotationForm from "../forms/delete-notation-form";
import AttachScreenshotModal from "../modals/attach-screenshot-modal";
import IconButton from "../ui/icon-button";

export default function FormPopup() {
  const { navigate, searchParams, setSearchParam } = useRoute();
  const { getSessionById } = useSession();
  const { getNotationsBySessionId } = useNotation();

  const { sessionId, type, modal } = searchParams;
  if (!sessionId || !type) navigate("/404");

  const session = getSessionById(sessionId);
  const notations = getNotationsBySessionId(sessionId);

  if (!session) navigate("/404");

  const form = FORM_TYPES.find((f) => f.type === type);
  const notationsByFormType = notations.filter((d) => d.type === type);

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
      <section
        style={{ "--color": form.color } as CSSProperties}
        className="flex flex-col gap-6">
        <header className="flex flex-col">
          <button
            onClick={handleGoToSession}
            className="w-fit hover:cursor-pointer hover:underline">
            Go Back
          </button>
          <h2 className="text-xl font-black">Manage {form.label.plural}</h2>
        </header>
        <div className="flex items-center justify-between rounded bg-[var(--color)] text-white">
          <h3 className="px-4 py-3 text-base font-medium">
            {notationsByFormType.length} {form.label.plural}
          </h3>
          <IconButton
            type="button"
            onClick={handleGoToSession}
            title="Exit Form"
            className="px-4 py-3 text-white">
            <ArrowLeft className="size-6" />
          </IconButton>
        </div>
        <CreateNotationForm
          form={form}
          notations={notationsByFormType}
          openModal={handleOpenModal}
        />
        <DeleteNotationForm form={form} notations={notationsByFormType} />
      </section>
      {modal === "screenshot" && (
        <AttachScreenshotModal form={form} closeModal={handleCloseModal} />
      )}
    </PopupContainer>
  );
}
