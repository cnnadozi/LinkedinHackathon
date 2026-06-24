import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LinkedInNav } from "@/components/LinkedInNav";
import type { MainUserProfile } from "@/lib/mainUserProfile";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

const profile: MainUserProfile = {
  name: "Alice Johnson",
  headline: "HR Coordinator at AI Dynamics",
  profilePictureUrl: "https://i.pravatar.cc/150?u=user_5736",
};

describe("LinkedInNav profile menu", () => {
  it("opens and closes the profile menu from the Me control", async () => {
    const user = userEvent.setup();

    render(<LinkedInNav mainUserProfile={profile} />);

    const meButton = screen.getByRole("button", { name: /Me/i });
    expect(meButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog", { name: "Profile" })).not.toBeInTheDocument();

    await user.click(meButton);
    expect(meButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();

    await user.click(meButton);
    expect(meButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog", { name: "Profile" })).not.toBeInTheDocument();
  });
});
