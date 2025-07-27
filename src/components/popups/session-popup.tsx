import { Packer } from "docx";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { FORM_TYPES } from "~/const";
import { useNotation, type Notation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import { useScreenshot } from "~/hooks/use-screenshot";
import { useSession } from "~/hooks/use-session";
import { createReportDoc } from "~/utils/docx";
import PopupContainer from "../containers/popup-container";
import IconButton from "../ui/icon-button";

export default function SessionPopup() {
  const { navigate, searchParams } = useRoute();
  const { getSessionById } = useSession();
  const { getNotationsBySessionId } = useNotation();
  const { getScreenshotsBySessionId } = useScreenshot();

  const { sessionId } = searchParams;

  const session = getSessionById(sessionId);
  const notations = getNotationsBySessionId(sessionId);
  const screenshots = getScreenshotsBySessionId(sessionId);

  if (!session) navigate("/404");

  function handleGoToHome() {
    navigate("/home");
  }

  function handleGoToForm(type: Notation["type"]) {
    return () => navigate(`/form?sessionId=${sessionId}&type=${type}`);
  }

  function handleDownloadReport() {
    const doc = createReportDoc(notations, screenshots);
    Packer.toBlob(doc).then((buffer) => {
      chrome.downloads.download({ url: URL.createObjectURL(buffer) });
    });
  }

  const getNotationsLength = (type: Notation["type"]) =>
    notations.filter((d) => d.type === type).length;

  return (
    <PopupContainer>
      <section className="flex flex-col gap-6">
        <header className="flex items-end justify-between">
          <div className="flex flex-col">
            <button
              onClick={handleGoToHome}
              className="w-fit hover:cursor-pointer hover:underline">
              Go Back
            </button>
            <h2 className="text-xl font-black">Session: {session.name}</h2>
          </div>
        </header>
        <ul className="flex flex-col gap-2 text-base text-white">
          {FORM_TYPES.map((form) => (
            <li
              key={"form-" + form.type}
              style={{ "--color": form.color } as CSSProperties}
              className="flex items-center justify-between rounded bg-[var(--color)]">
              <span className="px-4 py-3 font-medium">
                {getNotationsLength(form.type)} {form.label.plural}
              </span>
              <IconButton
                type="button"
                onClick={handleGoToForm(form.type)}
                title="Enter Form"
                className="px-4 py-3">
                <ArrowRight className="size-6" />
              </IconButton>
            </li>
          ))}
        </ul>
      </section>
      <footer className="flex">
        <button
          type="button"
          onClick={handleDownloadReport}
          title="Download Report"
          className="hover:underline">
          Generate Report
        </button>
      </footer>
    </PopupContainer>
  );
}
