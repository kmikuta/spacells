import { Simulation } from "./Simulation";
import { Cultures } from "./core/cell/Cultures";
import { Terrain } from "./core/terrain/Terrain";
import { Visualizer } from "./visualizer/Visualizer";

const terrain = new Terrain(10, 10);
const cultures = new Cultures(5);
const sim = new Simulation(terrain, cultures);
const vizualizer = new Visualizer(terrain, cultures);

sim.step();
sim.step();
sim.step();
sim.step();
sim.step();

vizualizer.execute();
