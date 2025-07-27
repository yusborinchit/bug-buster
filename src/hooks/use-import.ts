import { useNotation, type Notation } from "./use-notation";
import { useScreenshot, type Screenshot } from "./use-screenshot";
import { useSession, type Session } from "./use-session";

export function useImport() {
  const { sessions, createSession, deleteSession } = useSession();
  const { notations, createNotation, deleteNotation } = useNotation();
  const { screenshots, createScreenshot, deleteScreenshot } = useScreenshot();

  async function importDataFromJSON(json: string) {
    const data = JSON.parse(json);

    await Promise.all([
      ...notations.map((n) => deleteNotation(n.id)),
      ...screenshots.map((s) => deleteScreenshot(s.id)),
      ...sessions.map((s) => deleteSession(s.id))
    ]);

    await Promise.all([
      ...data.sessions.map((s: Session) => createSession("NO NEEDED", s)),
      ...data.notations.map((n: Notation) => createNotation(n)),
      ...data.screenshots.map((s: Screenshot) => createScreenshot(s))
    ]);
  }

  return { importDataFromJSON };
}
