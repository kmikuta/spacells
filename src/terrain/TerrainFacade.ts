import { Cell } from "../cultures/Cell";
import { SpotAddress } from "./Spot2dArray";
import { Terrain } from "./Terrain";

export class TerrainFacade {
  constructor(
    private readonly terrain: Terrain,
    private readonly occupantId: string,
  ) {}

  public consume(amount: number): number {
    return this.terrain.consumeResources(this.occupantId, amount);
  }

  public moveToSpot(address: SpotAddress) {
    this.terrain.takeSpot(this.occupantId, address);
  }

  public getPossibleNextMoves(): SpotAddress[] {
    return this.terrain.getFreeSpotAddressesAround(this.occupantId);
  }

  public put(cell: Cell) {
    this.terrain.takeInitialSpot(cell.id);
  }
}
