import { Packer } from "docx";
import { ArrowDownToLine, FileText, Sheet } from "lucide-react";
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

  function handleDownloadDocx() {
    const doc = createReportDoc(session, notations, screenshots);
    Packer.toBlob(doc).then((buffer) => {
      chrome.downloads.download({ url: URL.createObjectURL(buffer) });
    });
  }

  // TODO: improve this maybe with excel.js
  function handleDownloadCsv() {
    const header = t("csv.headers") + "\n";
    const content = notations
      .map((notation) => {
        return t("csv.row", {
          ...notation,
          date: new Date(notation.createdAt)
        });
      })
      .join("\n");

    const blob = new Blob([header + content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({ url, filename: `${session.name}.csv` });
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
      <footer className="flex items-center gap-4">
        <IconButton
          type="button"
          onClick={handleDownloadDocx}
          title={t("session.downloadDocx")}
          className="hover:underline">
          <div className="flex items-center">
            <ArrowDownToLine aria-hidden className="size-6" />
            <FileText aria-hidden className="size-6" />
          </div>
        </IconButton>
        <IconButton
          type="button"
          onClick={handleDownloadCsv}
          title={t("session.downloadCsv")}
          className="hover:underline">
          <div className="flex items-center">
            <ArrowDownToLine aria-hidden className="size-6" />
            <Sheet aria-hidden className="size-6" />
          </div>
        </IconButton>
      </footer>
    </PopupContainer>
  );
}
