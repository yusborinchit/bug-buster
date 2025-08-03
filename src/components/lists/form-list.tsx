import { NOTATION_COLORS } from "~/const";
import { useNotation } from "~/hooks/use-notation";
import { useRoute } from "~/hooks/use-route";
import FormCard from "../cards/form-card";

export default function FormList() {
  const { navigate, getSearchParam } = useRoute();
  const { getNotationsBySessionId } = useNotation();

  const sessionId = getSearchParam("sessionId", "");

  if (!sessionId) navigate("/404");

  const notations = getNotationsBySessionId(sessionId);

  return (
    <ul className="flex flex-col gap-2 text-base text-white">
      {Object.keys(NOTATION_COLORS).map((type) => (
        <FormCard
          key={type}
          url={`/form?sessionId=${sessionId}&type=${type}`}
          type={type}
          count={notations.filter((n) => n.type === type).length}
          color={NOTATION_COLORS[type]}
        />
      ))}
    </ul>
  );
}
