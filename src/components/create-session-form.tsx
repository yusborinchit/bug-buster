interface Props {
  createSession: (name: string) => void
}

export default function CreateSessionForm({ createSession }: Readonly<Props>) {
  async function handleCreateSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = formData.get("session-name")
    if (!name || typeof name !== "string") return

    createSession(name)
    form.reset()
  }

  return (
    <form onSubmit={handleCreateSession} className="flex gap-2">
      <label htmlFor="session-name" className="sr-only">
        Session Name:
      </label>
      <input
        id="session-name"
        name="session-name"
        type="text"
        placeholder="Session name here..."
        autoComplete="off"
        className="flex-1 placeholder:text-neutral-500 border border-neutral-300 rounded-sm p-2.5"
      />
      <button
        type="submit"
        className="px-4 place-items-center py-2.5 grid font-medium rounded-sm shadow bg-gradient-to-t from-red-700 to-red-500 text-white">
        Add
      </button>
    </form>
  )
}
