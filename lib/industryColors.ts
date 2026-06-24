/** Calendar legend colors keyed by host industry. */
export const INDUSTRY_COLOR: Record<string, string> = {
  Technology: "#0a66c2",
  Education: "#057642",
  Healthcare: "#7b5ea7",
  Finance: "#c47b0e",
  Retail: "#0891b2",
};

export function industryColor(industry: string): string {
  return INDUSTRY_COLOR[industry] ?? "#666";
}
