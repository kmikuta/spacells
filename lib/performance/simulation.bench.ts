import { bench } from "vitest";
import { Cultures, Terrain, Simulation } from "../src/main";

const terrain = new Terrain(100, 100);
const cells = new Cultures(terrain, 100);
const simulation = new Simulation(terrain, cells);

bench("Simulation step on 100x100 terrain with 100 cells", () => {
  simulation.step();
});
