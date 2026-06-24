/**
 * Nav profile dropdown — compact member summary (popover, not a route).
 */
"use client";

import { useEffect } from "react";
import type { MainUserProfile } from "@/lib/mainUserProfile";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

type ProfileMenuProps = {
  profile: MainUserProfile;
  onClose: () => void;
};

export function ProfileMenu({ profile, onClose }: ProfileMenuProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="li-profile-menu" role="dialog" aria-label="Profile">
      <Avatar
        alt={profile.name}
        src={profile.profilePictureUrl}
        size="md"
        className="li-profile-menu__avatar"
      />
      <div className="li-profile-menu__identity">
        <p className="li-profile-menu__name">{profile.name}</p>
        {profile.headline ? (
          <p className="li-profile-menu__headline">{profile.headline}</p>
        ) : null}
      </div>
      <Button variant="secondary" size="sm" className="li-profile-menu__view-btn">
        View profile
      </Button>
    </div>
  );
}
