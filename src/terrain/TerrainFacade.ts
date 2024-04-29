import { Cell } from "../cultures/Cell";
import { Spot } from "./Spot";
import { Terrain } from "./Terrain";

export class TerrainFacade {
  constructor(
    private readonly terrain: Terrain,
    private readonly occupantId: string,
  ) {}

  public consume(amount: number): number {
    return this.terrain.consumeResources(this.occupantId, amount);
  }

  public moveToSpot(spot: Spot) {
    this.terrain.takeSpot(this.occupantId, spot);
  }

  public getPossibleNextMoves(): Spot[] {
    return this.terrain.getFreeSpotsAround(this.occupantId);
  }

  public put(cell: Cell) {
    this.terrain.takeSpotRandomly(cell.id);
  }
}
