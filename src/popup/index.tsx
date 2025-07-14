import "~/global.css";
import { useData } from "~/hooks/use-data";
import { useRoute } from "~/hooks/use-route";
import { useSessions } from "~/hooks/use-sessions";
import { clearAllDb } from "~/utils/clear-all-db";
import { exportDb } from "~/utils/export-db";
import { importDb } from "~/utils/import-db";
import SelectSessionPopup from "./select-session-popup";
import SessionPopup from "./session-popup";

export default function MainPopup() {
  const { route, navigate } = useRoute();
  const { sessions, createSession, deleteSession } = useSessions();
  const { createData, deleteData, getSessionData } = useData();

  async function handleExport() {
    await exportDb();
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const file = (e.target as FileReader).result;
        if (typeof file !== "string") return;

        const { sessions, data, screenshots, route } = JSON.parse(file);

        await importDb(sessions, data, screenshots, route);
        window.close();
      } catch (error) {
        alert("Invalid JSON");
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  }

  async function handleClearAll() {
    await clearAllDb();
    window.close();
  }

  return (
    <div className="inline-block min-w-[350px] bg-white px-4 py-6 font-geist text-sm">
      {route === "/" ? (
        <SelectSessionPopup
          sessions={sessions}
          navigate={navigate}
          createSession={createSession}
          deleteSession={deleteSession}
          handleClearAll={handleClearAll}
          handleExport={handleExport}
          handleImport={handleImport}
        />
      ) : route.match(/^\/session\/*/) ? (
        <SessionPopup
          sessions={sessions}
          route={route}
          navigate={navigate}
          createData={createData}
          deleteData={deleteData}
          getSessionData={getSessionData}
        />
      ) : (
        <div>404 Not Found</div>
      )}
    </div>
  );
}
