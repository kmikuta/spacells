import { Terrain } from "../terrain/Terrain";
import { TerrainProxy } from "../terrain/TerrainProxy";
import { Cell } from "./Cell";

export class Cultures {
  private readonly cells: Cell[] = [];

  constructor(terrain: Terrain, initialCellCount: number) {
    for (let i = 0; i < initialCellCount; i++) {
      const id = `c${i}`;
      this.cells.push(new Cell(id, new TerrainProxy(terrain, id)));
    }
  }

  get cellCount(): number {
    return this.cells.length;
  }

  public step() {
    this.cells.forEach((s) => s.step());
  }
}
