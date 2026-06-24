import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AiConnectionPanel } from "@/components/AiConnectionPanel";

describe("AiConnectionPanel", () => {
  it("shows talking points but not shared themes or mutual events", () => {
    render(
      <AiConnectionPanel
        loading={false}
        data={{
          sharedThemes: ["Completed a new project on GitHub"],
          mutualEvents: [
            { id: "event_1", name: "Breaking Into HR Coordinator Roles" },
            { id: "event_2", name: "Breaking Into Sales Representative Roles" },
          ],
          talkingPoints: ["Ask about their recent GitHub project."],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Suggested Talking Points" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ask about their recent GitHub project."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Shared Themes")).not.toBeInTheDocument();
    expect(screen.queryByText("Mutual Events")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Completed a new project on GitHub"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Breaking Into HR Coordinator Roles"),
    ).not.toBeInTheDocument();
  });
});
