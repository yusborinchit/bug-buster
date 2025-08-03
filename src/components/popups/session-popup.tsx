import { Packer } from "docx";
import { ArrowDownToLine } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNotation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import { useSession } from "~/hooks/use-session";
import { createReportDoc } from "~/utils/docx";
import PopupContainer from "../containers/popup-container";
import FormList from "../lists/form-list";
import IconButton from "../ui/icon-button";

export default function SessionPopup() {
  const { t } = useTranslation();
  const { navigate, getSearchParam } = useRoute();
  const { getSessionById } = useSession();
  const { getNotationsBySessionId } = useNotation();
  const { getScreenshotsBySessionId } = useScreenshot();

  const sessionId = getSearchParam("sessionId", "");

  if (!sessionId) navigate("/404");

  const session = getSessionById(sessionId);
  const notations = getNotationsBySessionId(sessionId);
  const screenshots = getScreenshotsBySessionId(sessionId);

  if (!session) navigate("/404");

  function handleGoToHome() {
    navigate("/home");
  }

  function handleDownloadReport() {
    const doc = createReportDoc(session, notations, screenshots);
    Packer.toBlob(doc).then((buffer) => {
      chrome.downloads.download({ url: URL.createObjectURL(buffer) });
    });
  }

  return (
    <PopupContainer>
      <header className="flex items-end justify-between">
        <div className="flex flex-col">
          <button
            onClick={handleGoToHome}
            className="w-fit hover:cursor-pointer hover:underline">
            {t("session.goBack")}
          </button>
          <h2 className="text-xl font-black">
            {t("session.title", { name: session.name })}
          </h2>
        </div>
      </header>
      <section className="flex flex-col">
        <FormList />
      </section>
      <footer className="flex">
        <IconButton
          type="button"
          onClick={handleDownloadReport}
          title={t("session.downloadDocx")}
          className="hover:underline">
          <span className="flex items-center gap-1">
            <ArrowDownToLine aria-hidden className="size-6" />
            {t("session.downloadDocx")}
          </span>
        </IconButton>
      </footer>
    </PopupContainer>
  );
}
