import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfileMenu } from "@/components/linkedin/ProfileMenu";
import type { MainUserProfile } from "@/lib/mainUserProfile";

const profile: MainUserProfile = {
  name: "Alice Johnson",
  headline: "HR Coordinator at AI Dynamics",
  profilePictureUrl: "https://i.pravatar.cc/150?u=user_5736",
};

describe("ProfileMenu", () => {
  it("renders the logged-in member summary only", () => {
    render(<ProfileMenu profile={profile} onClose={() => {}} />);

    expect(screen.getByRole("dialog", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("HR Coordinator at AI Dynamics")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View profile" })).toBeInTheDocument();
    expect(screen.queryByText("Account")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign out")).not.toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ProfileMenu profile={profile} onClose={onClose} />);
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
  });
});
