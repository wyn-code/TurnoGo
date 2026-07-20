import { describe, it, expect } from "vitest";
import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats small amounts with AR locale", () => {
    expect(formatCurrency(1000)).toBe("$1.000");
  });

  it("formats large amounts", () => {
    expect(formatCurrency(1500000)).toBe("$1.500.000");
  });

  it("formats decimal values", () => {
    const result = formatCurrency(1500.5);
    expect(result).toContain("1");
    expect(result).toContain("500");
  });

  it("formats negative values", () => {
    expect(formatCurrency(-500)).toBe("$-500");
  });
});
