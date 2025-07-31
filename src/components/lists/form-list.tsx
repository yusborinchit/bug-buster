import { FORM_TYPES } from "~/const";
import { useNotation, type Notation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import FormCard from "../cards/form-card";

export default function FormList() {
  const { navigate, searchParams } = useRoute();
  const { getNotationsBySessionId } = useNotation();

  const { sessionId } = searchParams;

  const notations = getNotationsBySessionId(sessionId);

  if (!sessionId) navigate("/404");

  const getNotationsLength = (type: Notation["type"]) =>
    notations.filter((d) => d.type === type).length;

  return (
    <ul className="flex flex-col gap-2 text-base text-white">
      {FORM_TYPES.map((form) => (
        <FormCard
          key={form.type}
          url={`/form?sessionId=${sessionId}&type=${form.type}`}
          type={form.type}
          count={getNotationsLength(form.type)}
          color={form.color}
        />
      ))}
    </ul>
  );
}
