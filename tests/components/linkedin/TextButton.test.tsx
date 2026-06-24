import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextButton } from "@/components/linkedin/TextButton";

describe("TextButton", () => {
  it("renders label and calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <TextButton variant="default" onClick={onClick}>
        248 attendees
      </TextButton>,
    );

    await user.click(screen.getByRole("button", { name: "248 attendees" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies variant class", () => {
    render(<TextButton variant="connections">12 connections</TextButton>);
    expect(screen.getByRole("button")).toHaveClass("li-text-btn--connections");
  });
});
