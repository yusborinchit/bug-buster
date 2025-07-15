import { ChartNoAxesCombined } from "lucide-react";
import { useEffect, useState } from "react";
import DataForm from "~/components/data-form";
import type { Data } from "~/hooks/use-data";
import type { Session } from "~/hooks/use-sessions";
const DATA_FORMS = [
  {
    label: "Bugs",
    type: "bug",
    color: "#fb2c36"
  },
  {
    label: "Notes",
    type: "note",
    color: "#fe9a00"
  },
  {
    label: "Questions",
    type: "question",
    color: "#00a63e"
  },
  {
    label: "Ideas",
    type: "idea",
    color: "#2b7fff"
  }
] as const;
interface Props {
  sessions: Session[];
  route: string;
  navigate: (path: string) => void;
  createData: (data: Data) => void;
  deleteData: (id: string) => void;
  getSessionData: (sessionId: string) => Data[];
}
export default function SessionPopup({
  sessions,
  route,
  navigate,
  createData,
  deleteData,
  getSessionData
}: Readonly<Props>) {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<Data["type"] | undefined>(
    undefined
  );
  useEffect(() => {
    const sessionId = route.split("/").pop();
    const session = sessions.find((s) => s.id === sessionId);
    setSession(session);
  }, [sessions, route]);
  const data = getSessionData(session?.id);
  function handleCreateReport() {
    chrome.tabs.create({
      url: `/tabs/report.html?sessionId=${session?.id}`
    });
  }
  return (
    session && (
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="flex-col gap-1">
            <button
              className="flex w-fit items-center gap-1 text-xs hover:underline"
              onClick={() => navigate("/")}>
              Go Back
            </button>
            <h2 className="text-xl font-bold tracking-tight">{session.name}</h2>
          </div>
          <button aria-label="See Report" onClick={handleCreateReport}>
            <ChartNoAxesCombined className="size-6" />
          </button>
        </header>
        <section className="flex flex-col gap-3">
          {DATA_FORMS.map(({ label, type, color }) => (
            <DataForm
              key={label}
              color={color}
              createData={createData}
              data={data.filter((d) => d.type === type)}
              deleteData={deleteData}
              isSelected={selectedType === type}
              label={label}
              onSelect={() =>
                setSelectedType(selectedType === type ? undefined : type)
              }
              sessionId={session.id}
              type={type}
            />
          ))}
        </section>
      </div>
    )
  );
}
