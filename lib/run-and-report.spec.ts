import { test } from "vitest";

import { Cultures, Terrain, Simulation, Visualizer } from "./src/main";

test("Simulation test with report", () => {
  const terrain = new Terrain(10, 10, 1000);
  const cells = new Cultures(terrain, 10);
  const simulation = new Simulation(terrain, cells);
  const visualizer = new Visualizer(terrain, cells);

  for (let i = 0; i < 11; i++) {
    simulation.step();
  }

  visualizer.execute();
});
