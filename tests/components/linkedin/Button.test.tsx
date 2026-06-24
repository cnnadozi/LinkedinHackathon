import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/linkedin/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Connect</Button>);
    expect(screen.getByRole("button", { name: "Connect" })).toBeInTheDocument();
  });

  it("forwards onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
