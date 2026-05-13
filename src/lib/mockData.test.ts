import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/lib/mockData";

describe("formatCurrency - Currency formatting utility", () => {
  it("should format positive amounts correctly", () => {
    const result = formatCurrency(1000);
    expect(result).toBe("₹1,000");
  });

  it("should format negative amounts with minus sign", () => {
    const result = formatCurrency(-1000);
    expect(result).toBe("₹-1,000");
  });

  it("should handle decimal amounts", () => {
    const result = formatCurrency(1234.56);
    expect(result).toBe("₹1,234.56");
  });

  it("should format large numbers with commas", () => {
    const result = formatCurrency(1234567.89);
    expect(result).toBe("₹12,34,567.89");
  });

  it("should handle zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toBe("₹0");
  });

  it("should handle very small decimals", () => {
    const result = formatCurrency(0.50);
    expect(result).toBe("₹0.50");
  });

  it("should not show decimal for whole numbers", () => {
    const result = formatCurrency(5000);
    expect(result).not.toContain(".00");
  });
});
