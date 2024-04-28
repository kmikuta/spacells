import { describe, expect, it } from "vitest";
import * as wasm from "spacells-wasm/spacells_wasm";

describe("Wasm test", () => {
  it("should return a number", () => {
    expect(wasm.compute_sth(2, 4)).toBe(6);
  });
});
