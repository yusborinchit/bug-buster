import { ArrowLeft } from "lucide-react";
import { type CSSProperties } from "react";
import { useData } from "~/hooks/use-data";
import { useRoute } from "~/hooks/use-route";
import { useSession } from "~/hooks/use-session";
import { FORM_TYPES } from "~/utils/const";
import PopupContainer from "../containers/popup-container";
import CreateDataForm from "../forms/create-data-form";
import DeleteDataForm from "../forms/delete-data-form";
import AttachScreenshotModal from "../modals/attach-screenshot-modal";

export default function FormPopup() {
  const { navigate, searchParams, setSearchParam } = useRoute();
  const { getSessionById } = useSession();
  const { getDataBySessionId } = useData();

  const { sessionId, type, modal } = searchParams;
  if (!sessionId || !type) navigate("/404");

  const session = getSessionById(sessionId);
  const sessionData = getDataBySessionId(sessionId);

  if (!session) navigate("/404");

  const form = FORM_TYPES.find((f) => f.type === type);
  const data = sessionData.filter((d) => d.type === type);

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
            {data.length} {form.label.plural}
          </h3>
          <button
            type="button"
            onClick={handleGoToSession}
            title="Exit Form"
            className="px-4 py-3 text-white">
            <span className="sr-only">Go Back</span>
            <ArrowLeft className="size-6" />
          </button>
        </div>
        <CreateDataForm form={form} data={data} openModal={handleOpenModal} />
        <DeleteDataForm form={form} data={data} />
      </section>
      {modal === "screenshot" && (
        <AttachScreenshotModal form={form} closeModal={handleCloseModal} />
      )}
    </PopupContainer>
  );
}
