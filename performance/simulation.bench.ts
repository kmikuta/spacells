import { bench } from "vitest";
import { CellFactory, Simulation, TerrainFactory, generateIds } from "../src/main";

const terrain = TerrainFactory.createTerrain({ width: 100, height: 100, resourcesPerSpot: 1000 });
const cells = generateIds(100).map((id) => CellFactory.createCell(terrain, { id }));
const simulation = new Simulation(terrain, cells);

bench("Simulation step on 100x100 terrain with 100 cells", () => {
  simulation.step();
});
