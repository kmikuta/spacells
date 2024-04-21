import { Terrain } from "../terrain/Terrain";
import { TerrainFacade } from "../terrain/TerrainFacade";
import { Cell } from "./Cell";

export class Cultures {
  private readonly cells: Cell[] = [];

  constructor(terrain: Terrain, initialCellCount: number) {
    for (let i = 0; i < initialCellCount; i++) {
      const cellId = `c${i}`;
      const cell = new Cell(cellId, new TerrainFacade(terrain, cellId));

      this.cells.push(cell);
      terrain.takeInitialSpot(cellId);
    }
  }

  get cellCount(): number {
    return this.cells.length;
  }

  public step() {
    this.cells.forEach((s) => s.step());
  }
}
