import { beforeEach, describe, expect, it } from "vitest";
import { Terrain } from "./terrain/Terrain";
import { Simulation } from "./Simulation";
import { Cell } from "./cultures/Cell";
import { CellFactory } from "./cultures/CellFactory";
import { TerrainFactory } from "./terrain/TerrainFactory";
import { SpotAddress } from "./terrain/Spot2dArray";
import { generateIds } from "./util/id/generator";

describe("E2E simulation test", () => {
  let terrain: Terrain, cells: Cell[], simulation: Simulation;
  let initialIndex: SpotAddress;

  describe("when terrain and cultures are being created", () => {
    beforeEach(() => {
      terrain = TerrainFactory.createTerrain({ width: 3, height: 3, resourcesPerSpot: 1 });
      cells = generateIds(3).map((id) => CellFactory.createCell(terrain, { id }));
      simulation = new Simulation(terrain, cells);
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
      terrain = TerrainFactory.createTerrain({ width: 1, height: 1, resourcesPerSpot: 1 });
      cells = [CellFactory.createCell(terrain, { id: "c0" })];
      simulation = new Simulation(terrain, cells);
      simulation.step();
    });

    it("should consume resources", () => {
      expect(terrain.resourceMatrix[0][0]).toBe(0);
    });
  });

  describe("when resources are not available for the cell", () => {
    beforeEach(() => {
      terrain = TerrainFactory.createTerrain({ width: 1, height: 2, resourcesPerSpot: 1 });
      cells = [CellFactory.createCell(terrain, { id: "c0" })];
      simulation = new Simulation(terrain, cells);

      simulation.step();
      initialIndex = terrain.getOccupantAddress("c0");
      simulation.step();
    });

    it("should migrate", () => {
      const currentIndex = terrain.getOccupantAddress("c0");
      expect(currentIndex).not.toEqual(initialIndex);
    });
  });

  describe("when there is no free spot for the cell to migrate", () => {
    beforeEach(() => {
      terrain = TerrainFactory.createTerrain({ width: 2, height: 2, resourcesPerSpot: 0 });
      cells = generateIds(4).map((id) => CellFactory.createCell(terrain, { id }));
      simulation = new Simulation(terrain, cells);

      initialIndex = terrain.getOccupantAddress("c0");
      simulation.step();
    });

    it("should stay in the same place", () => {
      const currentIndex = terrain.getOccupantAddress("c0");
      expect(currentIndex).toEqual(initialIndex);
    });
  });

  describe("when a cell consume resources", () => {
    beforeEach(() => {
      terrain = TerrainFactory.createTerrain({ width: 1, height: 1, resourcesPerSpot: 1 });
      cells = [CellFactory.createCell(terrain, { id: "c0" })];
      simulation = new Simulation(terrain, cells);
      simulation.step();
    });

    it("should produce energy", () => {
      expect(cells[0].energy).toEqual(5.3);
    });
  });

  describe("when a cell has energy", () => {
    beforeEach(() => {
      terrain = TerrainFactory.createTerrain({ width: 1, height: 3, resourcesPerSpot: 0 });
      cells = [CellFactory.createCell(terrain, { id: "c0" })];
      simulation = new Simulation(terrain, cells);

      simulation.step();
      simulation.step();
      simulation.step();
    });

    it("should consume it for inner processes and migration", () => {
      expect(cells[0].energy).toEqual(2.3);
    });

    it("should grow", () => {
      expect(cells[0].cellSize).toEqual(2.5);
    });
  });

  describe("when cell has no energy", () => {
    beforeEach(() => {
      terrain = TerrainFactory.createTerrain({ width: 1, height: 2, resourcesPerSpot: 0 });
      cells = [CellFactory.createCell(terrain, { id: "c0", initialEnergy: 0.2 })]; // cell will consume 0.2 for inner processes, so no energy for migration
      simulation = new Simulation(terrain, cells);

      initialIndex = terrain.getOccupantAddress("c0");

      simulation.step();
    });

    it("should not be able to move", () => {
      const currentIndex = terrain.getOccupantAddress("c0");
      expect(cells[0].energy).toEqual(0);
      expect(currentIndex).toEqual(initialIndex);
    });
  });

  describe("when cell has too much energy", () => {
    beforeEach(() => {
      terrain = TerrainFactory.createTerrain({ width: 1, height: 1, resourcesPerSpot: 1 });
      cells = [CellFactory.createCell(terrain, { id: "c0", initialEnergy: 50 })];
      simulation = new Simulation(terrain, cells);
      simulation.step(); // each step consumes 0.7
      simulation.step();
      simulation.step();
    });

    it("should not consume resources", () => {
      expect(cells[0].energy).toEqual(47.9);
      expect(terrain.getSpot({ i: 0, j: 0 }).resourceCount).toEqual(1);
    });
  });

  describe("when cell has enough energy to divide", () => {
    beforeEach(() => {
      terrain = TerrainFactory.createTerrain({ width: 1, height: 2, resourcesPerSpot: 10 });
      cells = [CellFactory.createCell(terrain, { id: "c0", initialEnergy: 1 })];
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
