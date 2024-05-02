import { beforeEach, describe, expect, it } from "vitest";
import { EnergyStore } from "./EnergyStore";

describe("EnergyStore", () => {
  let store: EnergyStore;

  beforeEach(() => {
    store = new EnergyStore(8);
  });

  it("should have initial value", () => {
    expect(store.currentValue).toBe(8);
  });

  it("should add energy", () => {
    store.add(5);
    expect(store.currentValue).toBe(13);
  });

  it("should utilize energy", () => {
    store.utilize(5);
    expect(store.currentValue).toBe(3);
  });

  it("should throw error when utilizing more than available", () => {
    expect(() => store.utilize(15)).toThrowError("Not enough energy to utilize.");
  });

  it("should return true when needs energy", () => {
    expect(store.needsEnergy()).toBe(true);
  });

  it("should return false when does not need energy", () => {
    store.add(2);
    expect(store.needsEnergy()).toBe(false);
  });
});
