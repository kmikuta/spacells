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

  describe("when a cell consume resources", () => {
    beforeEach(() => {
      terrain = new Terrain(1, 1, 1);
      cells = new Cultures(terrain, 1);
      simulation = new Simulation(terrain, cells);
      simulation.step();
    });

    it("should produce energy", () => {
      expect(cells.get("c0")?.energy).toEqual(5.3);
    });
  });

  describe("when a cell has energy", () => {
    beforeEach(() => {
      terrain = new Terrain(1, 2, 0);
      cells = new Cultures(terrain, 1);
      simulation = new Simulation(terrain, cells);

      simulation.step();
      simulation.step();
      simulation.step();
    });

    it("should consume it for inner processes and migration", () => {
      expect(cells.get("c0")?.energy).toEqual(2.3);
    });

    it("should grow", () => {
      expect(cells.get("c0")?.cellSize).toEqual(2.5);
    });
  });

  describe("when cell has no energy", () => {
    let initialIndex: number;

    beforeEach(() => {
      terrain = new Terrain(1, 2, 0);
      cells = new Cultures(terrain, 1, 0.2); // cell will consume 0.2 for inner processes, so no energy for migration
      simulation = new Simulation(terrain, cells);

      initialIndex = terrain.cellMatrix.flat().findIndex((cellId) => cellId === "c0");
      simulation.step();
    });

    it("should not be able to move", () => {
      const currentIndex = terrain.cellMatrix.flat().findIndex((cellId) => cellId === "c0");
      expect(cells.get("c0")?.energy).toEqual(0);
      expect(currentIndex).toEqual(initialIndex);
    });
  });

  describe("when cell has too much energy", () => {
    beforeEach(() => {
      terrain = new Terrain(1, 1, 1);
      cells = new Cultures(terrain, 1, 50);
      simulation = new Simulation(terrain, cells);
      simulation.step(); // each step consumes 0.7
      simulation.step();
      simulation.step();
    });

    it("should not consume resources", () => {
      expect(cells.get("c0")?.energy).toEqual(47.9);
      expect(terrain.resourceMatrix.flat()[0]).toEqual(1);
    });
  });

  describe("when cell has enough energy to divide", () => {
    beforeEach(() => {
      terrain = new Terrain(1, 2, 10);
      cells = new Cultures(terrain, 1, 1);
      simulation = new Simulation(terrain, cells);

      for (let i = 0; i < 18; i++) {
        simulation.step();
      }
    });

    it("should divide", () => {
      expect(terrain.cellMatrix.flat()).toContain("_c0");
    });
  });
});
