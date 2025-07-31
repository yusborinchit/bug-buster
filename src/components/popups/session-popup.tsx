import { Packer } from "docx";
import { useTranslation } from "react-i18next";
import { useNotation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import { useSession } from "~/hooks/use-session";
import { createReportDoc } from "~/utils/docx";
import PopupContainer from "../containers/popup-container";
import FormList from "../lists/form-list";

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
    const doc = createReportDoc(notations, screenshots);
    Packer.toBlob(doc).then((buffer) => {
      chrome.downloads.download({ url: URL.createObjectURL(buffer) });
    });
  }

  return (
    <PopupContainer>
      <section className="flex flex-col gap-6">
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
        <FormList />
      </section>
      <footer className="flex">
        <button
          type="button"
          onClick={handleDownloadReport}
          title={t("session.generateReport")}
          className="hover:underline">
          {t("session.generateReport")}
        </button>
      </footer>
    </PopupContainer>
  );
}
