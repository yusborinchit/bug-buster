import { ChartNoAxesCombined } from "lucide-react";
import { useEffect, useState } from "react";
import DataForm from "~/components/forms/data-form";
import { useData, type Data } from "~/hooks/use-data";
import { useRoute } from "~/hooks/use-route";
import { useSession, type Session } from "~/hooks/use-session";

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

export default function SessionPopup() {
  const { route, navigate } = useRoute();
  const { sessions } = useSession();
  const { createData, deleteData, getSessionData } = useData();

  const [session, setSession] = useState<Session | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<Data["type"] | undefined>(
    undefined
  );

  const data = getSessionData(session?.id);

  useEffect(() => {
    const sessionId = route.split("/").pop();
    const session = sessions.find((s) => s.id === sessionId);
    setSession(session);
  }, [sessions, route]);

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
              data={data.filter((d) => d.type === type)}
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
