import { useContext } from "react";
import { SessionContext } from "~/contexts/session-context";

export interface Session {
  id: string;
  site: string;
  objective?: string;
  scope?: string;
  href: string;
  name: string;
  createdAt: string;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("SessionContext not found");
  return context;
}
