import { Cell } from "../main";
import { Terrain } from "../terrain/Terrain";

export class Visualizer {
  constructor(
    private readonly terrain: Terrain,
    private readonly cells: Cell[],
  ) {}

  public execute() {
    console.log("Number of cells", this.cells.length);
    console.log("Terrain size", this.terrain.dimensions);
    console.table(this.terrain.visualMatrix);
  }
}
