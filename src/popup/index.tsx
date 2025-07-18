import "~/global.css";

import NotFoundPopup from "~/components/popups/404-popup";
import FormPopup from "~/components/popups/form-popup";
import HomePopup from "~/components/popups/home-popup";
import SessionPopup from "~/components/popups/session-popup";
import Router from "~/components/router";
import { DataProvider } from "~/contexts/data-context";
import RouteProvider from "~/contexts/route-context";
import ScreenshotProvider from "~/contexts/screenshot-context";
import SessionProvider from "~/contexts/session-context";

export default function IndexPopup() {
  return (
    <RouteProvider>
      <SessionProvider>
        <DataProvider>
          <ScreenshotProvider>
            <Router
              routes={[
                {
                  path: "/home",
                  component: HomePopup
                },
                {
                  path: "/session",
                  component: SessionPopup
                },
                {
                  path: "/form",
                  component: FormPopup
                },
                {
                  path: "/404",
                  component: NotFoundPopup
                }
              ]}
            />
          </ScreenshotProvider>
        </DataProvider>
      </SessionProvider>
    </RouteProvider>
  );
}
