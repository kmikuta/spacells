import { Simulation } from "./Simulation";
import { Cultures } from "./core/cultures/Cultures";
import { Terrain } from "./core/terrain/Terrain";
import { Visualizer } from "./visualizer/Visualizer";

const terrain = new Terrain(5, 10);
const cells = new Cultures(terrain, 10);
const simulation = new Simulation(terrain, cells);
const vizualizer = new Visualizer(terrain, cells);

// setInterval(() => {
//   console.clear();
//   simulation.step();
//   vizualizer.execute();
// }, 1000);

for (let i = 0; i < 11; i++) {
  simulation.step();
}

vizualizer.execute();
