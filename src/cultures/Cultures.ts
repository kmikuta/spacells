import { Terrain } from "../terrain/Terrain";
import { TerrainFacade } from "../terrain/TerrainFacade";
import { Cell } from "./Cell";

const INITIAL_ENERGY = 5;

export class Cultures {
  private readonly cells: Cell[] = [];

  constructor(terrain: Terrain, initialCellCount: number, initialEnergy = INITIAL_ENERGY) {
    for (let i = 0; i < initialCellCount; i++) {
      const cellId = `c${i}`;
      const cell = new Cell(cellId, new TerrainFacade(terrain, cellId), initialEnergy);

      this.cells.push(cell);
      terrain.takeInitialSpot(cellId);
    }
  }

  get cellCount(): number {
    return this.cells.length;
  }

  public get(cellId: string): Cell | null {
    return this.cells.find((cell) => cell.id === cellId)?.copy() ?? null;
  }

  public step() {
    this.cells.forEach((cell) => {
      cell.step();
    });
  }
}
