import { randomArrayElement } from "../../util/array/elements";
import { TerrainFacade } from "../terrain/TerrainFacade";

const consumptionNeed = 1;

export class Cell {
  constructor(public readonly id: string, private readonly terrain: TerrainFacade) {}

  public step() {
    this.consume();
    this.move();
  }

  private consume() {
    this.terrain.consume(consumptionNeed);
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
