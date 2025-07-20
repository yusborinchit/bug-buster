import "~/global.css";

import { useMemo, type CSSProperties } from "react";
import DataCard from "~/components/cards/data-card";
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
        <h1 className="text-3xl font-bold tracking-tight">Session Report</h1>
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
      <section className="flex flex-col gap-6">
        <table className="w-full border-collapse">
          <thead className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
            <th className="text-start">Notation Type</th>
            <th className="w-0">Total</th>
          </thead>
          <tbody>
            {Object.entries(dataByType).map(([type, d]) => (
              <tr
                key={`$tr-{type}`}
                className="[&>*]:border [&>*]:border-black [&>*]:px-4 [&>*]:py-2">
                <td className="capitalize">
                  {getFormByType(type).label.singular}
                </td>
                <td className="text-center">{d.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {Object.entries(dataByType).map(
        ([type, d]) =>
          d.length > 0 && (
            <section
              key={`section-${type}`}
              style={{ "--color": getFormByType(type).color } as CSSProperties}
              className="flex flex-col">
              <h2 className="text-2xl font-bold tracking-tight underline decoration-[var(--color)] decoration-4">
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
      <footer></footer>
    </main>
  );
}
