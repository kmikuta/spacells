import { TerrainProxy } from "../terrain/TerrainProxy";

const consumptionNeed = 1;

export class Cell {
  constructor(public readonly id: string, private readonly terrain: TerrainProxy) {
    this.terrain.occupy();
  }

  public step() {
    this.consume();
  }

  private consume() {
    this.terrain.consume(consumptionNeed);
  }
}
