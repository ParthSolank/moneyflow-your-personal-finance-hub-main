import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn - Tailwind class merger", () => {
  it("should merge tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toContain("py-1");
    expect(result).toContain("px-4");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn(
      "base-class",
      isActive && "active-class"
    );
    expect(result).toContain("base-class");
    expect(result).toContain("active-class");
  });

  it("should ignore false values", () => {
    const result = cn(
      "base-class",
      false && "should-not-appear",
      "another-class"
    );
    expect(result).toContain("base-class");
    expect(result).toContain("another-class");
    expect(result).not.toContain("should-not-appear");
  });

  it("should handle empty strings", () => {
    const result = cn("class1", "", "class2");
    expect(result).toContain("class1");
    expect(result).toContain("class2");
  });
});
