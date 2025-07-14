import { ChartNoAxesCombined } from "lucide-react";
import { useEffect, useState } from "react";
import DataForm from "~/components/data-form";
import type { Data } from "~/hooks/use-data";
import type { Session } from "~/hooks/use-sessions";

const DATA_FORMS = [
  { label: "Bugs", type: "bug", className: "from-red-700 to-red-500" },
  { label: "Notes", type: "note", className: "from-amber-700 to-amber-500" },
  {
    label: "Questions",
    type: "question",
    className: "from-green-700 to-green-500"
  },
  { label: "Ideas", type: "idea", className: "from-blue-700 to-blue-500" }
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
        <header className="flex items-end justify-between">
          <div className="flex-col gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex w-fit items-center gap-1 text-xs hover:underline">
              Go Back
            </button>
            <h2 className="flex gap-1 text-xl font-bold leading-[1] tracking-tight">
              <span className="font-medium text-neutral-500">#</span>
              <span>{session.name}</span>
            </h2>
          </div>
          <button onClick={handleCreateReport} aria-label="See Report">
            <ChartNoAxesCombined className="size-6" />
          </button>
        </header>
        <section className="flex flex-col gap-2">
          {DATA_FORMS.map(({ label, type, className }) => (
            <DataForm
              key={label}
              label={label}
              data={data.filter((d) => d.type === type)}
              onSelect={() =>
                setSelectedType(selectedType === type ? undefined : type)
              }
              isSelected={selectedType === type}
              sessionId={session.id}
              type={type}
              createData={createData}
              deleteData={deleteData}
              className={className}
            />
          ))}
        </section>
      </div>
    )
  );
}
