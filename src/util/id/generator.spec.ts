import { describe, expect, it } from "vitest";
import { generateIds } from "./generator";

describe("id generator", () => {
  it("should return an empty array when count is 0", () => {
    expect(generateIds(0)).toEqual([]);
  });

  it("should return an empty array when count is negative", () => {
    expect(generateIds(-1)).toEqual([]);
  });

  it("should generate ids", () => {
    expect(generateIds(3)).toEqual(["c0", "c1", "c2"]);
  });
});
