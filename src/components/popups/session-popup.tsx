import { ArrowRight, ChartNoAxesCombined } from "lucide-react";
import type { CSSProperties } from "react";
import { useData, type Data } from "~/hooks/use-data";
import { useRoute } from "~/hooks/use-route";
import { useSession } from "~/hooks/use-session";
import { FORM_TYPES } from "~/utils/const";
import PopupContainer from "../containers/popup-container";

export default function SessionPopup() {
  const { navigate, searchParams } = useRoute();
  const { getSessionById } = useSession();
  const { getDataBySessionId } = useData();

  const { sessionId } = searchParams;

  const session = getSessionById(sessionId);
  const allData = getDataBySessionId(sessionId);

  const getDataLength = (type: Data["type"]) =>
    allData.filter((d) => d.type === type).length;

  if (!session) navigate("/404");

  function handleGoToHome() {
    navigate("/home");
  }

  function handleGoToForm(type: Data["type"]) {
    return () => navigate(`/form?sessionId=${sessionId}&type=${type}`);
  }

  function handleGoToReport() {
    chrome.tabs.create({ url: `/tabs/report.html?sessionId=${sessionId}` });
  }

  return (
    <PopupContainer>
      <section className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="flex flex-col">
            <p
              onClick={handleGoToHome}
              className="hover:cursor-pointer hover:underline">
              Go Back
            </p>
            <h2 className="text-xl font-black">Session: {session.name}</h2>
          </div>
          <button onClick={handleGoToReport} title="Generate Report">
            <span className="sr-only">Generate Report</span>
            <ChartNoAxesCombined className="size-6" />
          </button>
        </header>
        <ul className="flex flex-col gap-2 text-base text-white">
          {FORM_TYPES.map((form) => (
            <li
              key={"form-" + form.type}
              style={{ "--color": form.color } as CSSProperties}
              className="flex items-center justify-between rounded bg-[var(--color)]">
              <span className="px-4 py-3 font-medium">
                {getDataLength(form.type)} {form.label.plural}
              </span>
              <button
                onClick={handleGoToForm(form.type)}
                title="Enter Form"
                className="px-4 py-3">
                <span className="sr-only">Add {form.label.singular}</span>
                <ArrowRight className="size-6" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </PopupContainer>
  );
}
