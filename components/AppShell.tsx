/** Root shell — global nav, main content area, overlay mount point. */
import type { ReactNode } from "react";
import { LinkedInNav } from "./LinkedInNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <LinkedInNav />
      <div className="app-shell__content">{children}</div>
    </div>
  );
}
