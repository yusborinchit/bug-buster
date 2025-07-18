import { useContext } from "react";
import { RouteContext } from "~/contexts/route-context";

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) throw new Error("RouteContext not found");
  return context;
}
