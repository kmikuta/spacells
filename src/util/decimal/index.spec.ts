import { describe, expect, it } from "vitest";
import { round } from "./index";

describe("Decimal utils", () => {
  it("should round a number to a given precision", () => {
    expect(round(1.23456789, 2)).toBe(1.23);
    expect(round(0.23556789, 2)).toBe(0.24);
    expect(round(100.2, 2)).toBe(100.2);
    expect(round(1000, 2)).toBe(1000);
  });
});
