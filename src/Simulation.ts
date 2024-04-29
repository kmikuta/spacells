import { Cell } from "./cultures/Cell";
import { Terrain } from "./terrain/Terrain";

export class Simulation {
  constructor(
    private readonly terrain: Terrain,
    private readonly cells: Cell[],
  ) {
    this.cells.forEach((cell) => {
      this.terrain.takeInitialSpot(cell.id);
    });
  }

  public step(): void {
    this.cells.forEach((cell) => cell.step());
  }
}
