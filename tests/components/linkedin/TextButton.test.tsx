import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "@/components/linkedin/Tabs";
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

describe("Tabs", () => {
  it("selects tab and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs
        options={[
          { value: "details", label: "Details" },
          { value: "comments", label: "Comments" },
        ]}
        value="details"
        onChange={onChange}
        aria-label="Event sections"
      />,
    );

    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.click(screen.getByRole("tab", { name: "Comments" }));
    expect(onChange).toHaveBeenCalledWith("comments");
  });
});
