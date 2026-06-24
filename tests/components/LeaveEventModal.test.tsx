import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LeaveEventModal } from "@/components/LeaveEventModal";

describe("LeaveEventModal", () => {
  it("renders confirmation copy and actions", () => {
    render(
      <LeaveEventModal open onClose={() => {}} onConfirm={() => {}} />,
    );

    expect(
      screen.getByRole("dialog", { name: "Leave this event?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/You will no longer be able to access the conversations/),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Leave" })).toBeInTheDocument();
  });

  it("calls onConfirm when Leave is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <LeaveEventModal open onClose={() => {}} onConfirm={onConfirm} />,
    );

    await user.click(screen.getByRole("button", { name: "Leave" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
