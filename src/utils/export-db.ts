import { promiseDb } from "./database";

export async function exportDb() {
  const db = await promiseDb;

  const [sessions, data, screenshots, [route]] = await Promise.all([
    db.getAll("sessions"),
    db.getAll("data"),
    db.getAll("screenshots"),
    db.getAll("route")
  ]);

  const json = JSON.stringify({ sessions, data, screenshots, route });
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  await chrome.downloads.download({
    url,
    filename: `snap-test.json`,
    saveAs: true
  });

  URL.revokeObjectURL(url);
}
