import { useNotation } from "./use-notation";
import { useScreenshot } from "./use-screenshot";
import { useSession } from "./use-session";

export function useExport() {
  const { sessions } = useSession();
  const { notations } = useNotation();
  const { screenshots } = useScreenshot();

  async function exportDataAsJSON() {
    const blob = new Blob(
      [
        JSON.stringify({
          sessions,
          notations,
          screenshots
        })
      ],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    await chrome.downloads.download({ url, filename: "data-file.json" });
    URL.revokeObjectURL(url);
  }

  return { exportDataAsJSON };
}
