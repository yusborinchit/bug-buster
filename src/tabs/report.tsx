import "~/global.css"

import DataPieChart from "~/components/data-pie-chart"
import DataSection from "~/components/data-section"
import { useData } from "~/hooks/use-data"
import { useSessions } from "~/hooks/use-sessions"
import { getCurrentDuration } from "~/utils/get-current-duration"

export const DATA_SECTIONS = [
  { label: "Bugs", type: "bug", className: "from-red-700 to-red-500" },
  { label: "Notes", type: "note", className: "from-amber-700 to-amber-500" },
  {
    label: "Questions",
    type: "question",
    className: "from-green-700 to-green-500"
  },
  { label: "Ideas", type: "idea", className: "from-blue-700 to-blue-500" }
]

export default function ReportTab() {
  const sessionId = new URL(location.href).searchParams.get("sessionId")

  const { sessions } = useSessions()
  const { getSessionData } = useData()

  const session = sessions.find((s) => s.id === sessionId)
  const data = getSessionData(sessionId)

  if (!session || !data) return <div>404 Session Not Found</div>

  const duration = getCurrentDuration(session.createdAt)

  return (
    <div className="max-w-3xl mx-auto p-6 text-base font-geist flex flex-col gap-4">
      <header className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-center mx-auto flex items-center gap-2">
          <span className="text-neutral-500">#</span>
          <span className="flex gap-2">
            <span>Exploratory Session Report:</span>
            <span className="text-neutral-500">"{session.name}"</span>
          </span>
        </h1>
        <p className="text-neutral-500 text-center">
          The session started on{" "}
          <strong>{new Date(session.createdAt).toLocaleString()}</strong> and
          has been open for <strong>{duration}</strong>.
        </p>
      </header>
      <main className="flex flex-col">
        {data.length > 0 && (
          <div className="max-h-[250px] mx-auto mt-4">
            <DataPieChart data={data} />
          </div>
        )}
        <div className="flex flex-col gap-12 mt-10">
          {DATA_SECTIONS.map(({ label, type, className }) => (
            <DataSection
              key={label}
              label={label}
              data={data.filter((d) => d.type === type)}
              className={className}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
