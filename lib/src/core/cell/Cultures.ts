import { Cell } from "./Cell";

export class Cultures {
  private readonly cells: Cell[] = [];

  constructor(initialNumberOfCells: number) {
    for (let i = 0; i < initialNumberOfCells; i++) {
      const cell = new Cell(`c${i}`);
      this.cells.push(cell);
    }
  }

  get numberOfCells() {
    return this.cells.length;
  }

  public getAll(): Cell[] {
    return this.cells;
  }
}
