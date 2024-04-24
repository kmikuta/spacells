import { beforeEach, describe, expect, it, vi } from "vitest";
import { Terrain } from "./terrain/Terrain";
import { Cultures } from "./cultures/Cultures";
import { Simulation } from "./Simulation";

describe("E2E simulation test", () => {
  let terrain: Terrain, cells: Cultures, simulation: Simulation;

  describe("when terrain and cultures are being created", () => {
    beforeEach(() => {
      terrain = new Terrain(3, 3, 1);
      cells = new Cultures(terrain, 3);
    });

    it("should put cells all around the place randomly", () => {
      const cellIds = terrain.cellMatrix
        .flat()
        .filter((el) => el !== "")
        .sort();
      expect(cellIds).toEqual(["c0", "c1", "c2"]);
    });
  });

  describe("when resources are available for the cell", () => {
    beforeEach(() => {
      terrain = new Terrain(1, 1, 1);
      cells = new Cultures(terrain, 1);
      simulation = new Simulation(terrain, cells);
      simulation.step();
    });

    it("should consume resources", () => {
      const resourceCount = terrain.resourceMatrix.flat()[0];
      expect(resourceCount).toBe(0);
    });
  });

  describe("when resources are not available for the cell", () => {
    let initialIndex: number;

    beforeEach(() => {
      terrain = new Terrain(1, 2, 1);
      cells = new Cultures(terrain, 1);
      simulation = new Simulation(terrain, cells);

      simulation.step();
      initialIndex = terrain.cellMatrix.flat().findIndex((cellId) => cellId === "c0");
      simulation.step();
    });

    it("should migrate", () => {
      const currentIndex = terrain.cellMatrix.flat().findIndex((cellId) => cellId === "c0");
      expect(currentIndex).not.toEqual(initialIndex);
    });
  });

  describe("when there is no free spot for the cell to migrate", () => {
    let initialIndex: number;

    beforeEach(() => {
      terrain = new Terrain(2, 2, 0);
      cells = new Cultures(terrain, 4);
      simulation = new Simulation(terrain, cells);

      initialIndex = terrain.cellMatrix.flat().findIndex((cellId) => cellId === "c0");
      simulation.step();
    });

    it("should stay in the same place", () => {
      const currentIndex = terrain.cellMatrix.flat().findIndex((cellId) => cellId === "c0");
      expect(currentIndex).toEqual(initialIndex);
    });
  });
});
