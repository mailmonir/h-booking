"use client";

import { createContext, useContext } from "react";
import { Session } from "../server/session";
import { User } from "../server/user";

interface SessionContextProps {
  session: Session | null;
  user: User | null;
}

const SessionContext = createContext<SessionContextProps | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContextProps }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
