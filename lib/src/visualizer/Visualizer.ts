import { Cultures } from "../cultures/Cultures";
import { Terrain } from "../terrain/Terrain";

export class Visualizer {
  constructor(
    private readonly terrain: Terrain,
    private readonly cultures: Cultures,
  ) {}

  public execute() {
    console.log("Number of cells ", this.cultures.cellCount);
    console.log("Terrain size", `${this.terrain.dimensions}`);
    console.table(this.terrain.visualMatrix);
  }
}
