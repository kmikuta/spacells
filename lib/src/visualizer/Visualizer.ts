import { Cultures } from "../core/cell/Cultures";
import { Terrain } from "../core/terrain/Terrain";

export class Visualizer {
  constructor(
    private readonly terrain: Terrain,
    private readonly cultures: Cultures
  ) {}

  public execute() {
    console.log("Number of cells ", this.cultures.numberOfCells);
    console.log("Terrain size", `${this.terrain.width}x${this.terrain.height}`);
    console.table(this.terrain.getVisualMatrix());
  }
}
