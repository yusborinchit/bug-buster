import "~/global.css";

import { useMemo } from "react";
import { NotationProvider } from "~/contexts/notation-context";
import ScreenshotProvider from "~/contexts/screenshot-context";
import SessionProvider from "~/contexts/session-context";
import { useNotation } from "~/hooks/use-notation";
import { useScreenshot } from "~/hooks/use-screenshot";
import { useSession } from "~/hooks/use-session";

export default function DashboardWrapper() {
  return (
    <SessionProvider>
      <NotationProvider>
        <ScreenshotProvider>
          <Dashboard />
        </ScreenshotProvider>
      </NotationProvider>
    </SessionProvider>
  );
}

function Dashboard() {
  const { getSessionById } = useSession();
  const { getNotationsBySessionId } = useNotation();
  const { getScreenshotsBySessionId } = useScreenshot();

  const sessionId = useMemo(
    () => new URLSearchParams(window.location.search).get("sessionId"),
    [window.location.search]
  );

  const session = getSessionById(sessionId);
  const notations = getNotationsBySessionId(sessionId);
  const screenshots = getScreenshotsBySessionId(sessionId);

  if (!session || !notations || !screenshots) return <div>Loading...</div>;

  function handleDownload() {}

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-16 p-6 font-geist text-base">
      <section className="flex flex-col gap-4">
        <button onClick={handleDownload}>download</button>
      </section>
      <section>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-white [&>th]:border [&>th]:border-black [&>th]:p-2">
              <th>Type</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Priority</th>
              <th>Screenshots</th>
              <th>Created At</th>
              <th>...</th>
            </tr>
          </thead>
          <tbody>
            {notations
              .sort((a, b) => b.title.localeCompare(a.title))
              .map((notation) => (
                <tr
                  key={notation.id}
                  className="capitalize [&>td]:border [&>td]:border-black [&>td]:p-2 [&>td]:text-center">
                  <td>{notation.type}</td>
                  <td>{notation.title}</td>
                  <td>{notation.severity}</td>
                  <td>{notation.priority}</td>
                  <td>{notation.screenshotsIds.length}</td>
                  <td>{new Date(notation.createdAt).toLocaleString()}</td>
                  <td>
                    <button>View</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
