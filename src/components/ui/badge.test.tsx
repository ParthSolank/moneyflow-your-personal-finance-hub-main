import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge Component", () => {
  it("should render badge with text", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("should apply variant class correctly", () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>);
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("destructive");
  });

  it("should handle different variants", () => {
    const variants = ["default", "secondary", "destructive", "outline"];
    variants.forEach(variant => {
      const { container } = render(
        <Badge variant={variant as any}>{variant}</Badge>
      );
      const badge = container.querySelector("div");
      expect(badge).toHaveClass(variant);
    });
  });

  it("should render with children content", () => {
    render(
      <Badge>
        <span data-testid="child">Child Content</span>
      </Badge>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("should accept className prop", () => {
    const { container } = render(
      <Badge className="custom-class">Test</Badge>
    );
    const badge = container.querySelector("div");
    expect(badge?.className).toContain("custom-class");
  });
});
