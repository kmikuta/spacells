import { randomArrayElement } from "../util/array/elements";
import { TerrainFacade } from "../terrain/TerrainFacade";

const consumptionNeed = 1;

export class Cell {
  constructor(
    public readonly id: string,
    private readonly terrain: TerrainFacade,
  ) {}

  public step() {
    this.consume();
  }

  private consume() {
    const consumed = this.terrain.consume(consumptionNeed);

    if (consumed === 0) {
      this.move();
    }
  }

  private move() {
    const nextMoves = this.terrain.getPossibleNextMoves();
    if (nextMoves.length === 0) {
      return;
    }
    const nextMove = randomArrayElement(nextMoves);
    this.terrain.moveToSpot(nextMove);
  }
}
