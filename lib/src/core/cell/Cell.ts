export class Cell {
  constructor(public readonly id: string) {}

  public step() {
    console.log(`step of ${this.id}`);
  }
}
