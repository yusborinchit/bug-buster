import "~/global.css";

import { useMemo } from "react";
import DataCard from "~/components/cards/data-card";
import ObjectiveAndScopeCard from "~/components/cards/objective-and-scope-card";
import ReportSummaryTable from "~/components/tables/report-summary-table";
import { DataProvider } from "~/contexts/data-context";
import ScreenshotProvider from "~/contexts/screenshot-context";
import SessionProvider from "~/contexts/session-context";
import { useData, type Data } from "~/hooks/use-data";
import { useSession } from "~/hooks/use-session";
import { FORM_TYPES } from "~/utils/const";

export default function DashboardWrapper() {
  return (
    <SessionProvider>
      <DataProvider>
        <ScreenshotProvider>
          <Dashboard />
        </ScreenshotProvider>
      </DataProvider>
    </SessionProvider>
  );
}

type DataByType = {
  [K in Data["type"]]: Data[];
};

function Dashboard() {
  const { getSessionById } = useSession();
  const { getDataBySessionId } = useData();

  const sessionId = useMemo(
    () => new URLSearchParams(window.location.search).get("sessionId"),
    [window.location.search]
  );

  const session = getSessionById(sessionId);
  const data = getDataBySessionId(sessionId);

  if (!session || !data) return <div>Loading...</div>;

  const dataByType: DataByType = data.reduce(
    (acc, data) => {
      acc[data.type].push(data);
      return acc;
    },
    { bug: [], note: [], question: [], idea: [] }
  );

  const getFormByType = (type: string) =>
    FORM_TYPES.find((f) => f.type === type);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-24 p-6 font-geist text-base">
      <header className="flex flex-col gap-6">
        <h1 className="text-5xl font-bold leading-[1] tracking-tight">
          Session Report
        </h1>
        <ul className="pl-5">
          <li className="list-disc">
            <span className="underline">Name</span>: {session.name}
          </li>
          <li className="list-disc">
            <span className="underline">Site</span>: {session.site}
          </li>
          <li className="list-disc">
            <span className="underline">Created At</span>:{" "}
            {new Date(session.createdAt).toLocaleString("es-ES")}
          </li>
        </ul>
      </header>
      <ObjectiveAndScopeCard session={session} />
      {Object.entries(dataByType).map(
        ([type, d]) =>
          d.length > 0 && (
            <section key={`section-${type}`} className="flex flex-col">
              <h2 className="text-3xl font-bold leading-[1] tracking-tight">
                {getFormByType(type).label.plural}
              </h2>
              <div className="divide-y divide-black">
                {d.map((data) => (
                  <DataCard data={data} />
                ))}
              </div>
            </section>
          )
      )}
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold leading-[1] tracking-tight">
          Report Summary
        </h2>
        <p>During this session we have reported the next data:</p>
        <ReportSummaryTable data={Object.entries(dataByType)} />
      </section>
      <footer></footer>
    </main>
  );
}
