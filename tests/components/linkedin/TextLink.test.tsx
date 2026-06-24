import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TextLink from "@/components/linkedin/TextLink";

describe("TextLink", () => {
  it("uses the LinkedIn blue link class", () => {
    render(<TextLink href="#">View profile</TextLink>);
    const link = screen.getByRole("link", { name: "View profile" });
    expect(link).toHaveClass("li-text-link");
    expect(link).not.toHaveClass("li-text-link-muted");
  });
});
