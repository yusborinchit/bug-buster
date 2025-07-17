import "~/global.css";

import { DataProvider } from "~/contexts/data-context";
import RouteProvider from "~/contexts/route-context";
import ScreenshotProvider from "~/contexts/screenshot-context";
import SessionProvider from "~/contexts/session-context";
import { useRoute } from "~/hooks/use-route";
import { clearAllDb } from "~/utils/clear-all-db";
import { exportDb } from "~/utils/export-db";
import { importDb } from "~/utils/import-db";
import HomePopup from "../components/popups/home-popup";
import SessionPopup from "../components/popups/session-popup";

function Popup() {
  const { route } = useRoute();

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
    <SessionProvider>
      <DataProvider>
        <ScreenshotProvider>
          <div className="inline-block min-w-[350px] bg-white p-6 font-geist text-base">
            {route === "/" ? (
              <HomePopup
                handleClearAll={handleClearAll}
                handleExport={handleExport}
                handleImport={handleImport}
              />
            ) : route.match(/^\/session\/*/) ? (
              <SessionPopup />
            ) : (
              <div>404 Not Found</div>
            )}
          </div>
        </ScreenshotProvider>
      </DataProvider>
    </SessionProvider>
  );
}

export default function PopupWrapper() {
  return (
    <RouteProvider>
      <Popup />
    </RouteProvider>
  );
}
