import "~/global.css";

import DataPieChart from "~/components/charts/data-pie-chart";
import DataSection from "~/components/data-section";
import { DataProvider } from "~/contexts/data-context";
import ScreenshotProvider from "~/contexts/screenshot-context";
import SessionProvider from "~/contexts/session-context";
import { useData } from "~/hooks/use-data";
import { useSession } from "~/hooks/use-session";
import { getCurrentDuration } from "~/utils/get-current-duration";

export const DATA_SECTIONS = [
  {
    label: "Bugs",
    type: "bug",
    className: "from-red-700 to-red-500"
  },
  {
    label: "Notes",
    type: "note",
    className: "from-amber-700 to-amber-500"
  },
  {
    label: "Questions",
    type: "question",
    className: "from-green-700 to-green-500"
  },
  {
    label: "Ideas",
    type: "idea",
    className: "from-blue-700 to-blue-500"
  }
];

function Report() {
  const sessionId = new URL(location.href).searchParams.get("sessionId");

  const { sessions } = useSession();
  const { getDataBySessionId } = useData();

  const session = sessions.find((s) => s.id === sessionId);
  const data = getDataBySessionId(sessionId);

  if (!session || !data) return <div>404 Session Not Found</div>;

  const duration = getCurrentDuration(session.createdAt);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-6 font-geist text-base">
      <header className="flex flex-col gap-2">
        <h1 className="mx-auto flex items-center gap-2 text-center text-3xl font-bold tracking-tight">
          <span className="text-neutral-500">#</span>
          <span className="flex gap-2">
            <span>Exploratory Session Report:</span>
            <span className="text-neutral-500">"{session.name}"</span>
          </span>
        </h1>
        <p className="text-center text-neutral-500">
          The session started on{" "}
          <strong>{new Date(session.createdAt).toLocaleString()}</strong> and
          has been open for <strong>{duration}</strong>.
        </p>
      </header>
      <main className="flex flex-col">
        {data.length > 0 && (
          <div className="mx-auto mt-2 max-h-[250px]">
            <DataPieChart data={data} />
          </div>
        )}
        <div className="mt-10 flex flex-col gap-12">
          {DATA_SECTIONS.map(({ label, type, className }) => (
            <DataSection
              key={label}
              className={className}
              data={data.filter((d) => d.type === type)}
              label={label}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ReportWrapper() {
  return (
    <SessionProvider>
      <DataProvider>
        <ScreenshotProvider>
          <Report />
        </ScreenshotProvider>
      </DataProvider>
    </SessionProvider>
  );
}
