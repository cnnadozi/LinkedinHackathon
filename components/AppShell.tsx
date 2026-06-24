/** Root shell — global nav, main content area, overlay mount point. */
import type { ReactNode } from "react";
import { LinkedInNav } from "./LinkedInNav";
import type { MainUserProfile } from "@/lib/mainUserProfile";

type AppShellProps = {
  children: ReactNode;
};

function loadMainUserProfile(): MainUserProfile {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getMainUser, memberHeadline } = require("@/server/lib/data") as {
    getMainUser: () => {
      name: string;
      profile_picture_url: string;
      job_history: string[];
      current_location: string;
    } | null;
    memberHeadline: (member: {
      job_history: string[];
      current_location: string;
    }) => string;
  };

  const user = getMainUser();
  if (!user) {
    return { name: "Member", headline: "", profilePictureUrl: "" };
  }

  return {
    name: user.name,
    headline: memberHeadline(user),
    profilePictureUrl: user.profile_picture_url,
  };
}

export function AppShell({ children }: AppShellProps) {
  const mainUserProfile = loadMainUserProfile();

  return (
    <div className="app-shell">
      <LinkedInNav mainUserProfile={mainUserProfile} />
      <div className="app-shell__content">{children}</div>
    </div>
  );
}
