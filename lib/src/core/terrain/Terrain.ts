import { Spot2dArray } from "./Spot2dArray";

export class Terrain {
  private readonly area: Spot2dArray;

  constructor(width: number, height: number) {
    this.area = new Spot2dArray(height, width);
  }

  get dimensions(): string {
    return `${this.area.cols}x${this.area.rows}`;
  }

  get visualMatrix(): string[][] {
    return this.area.toStringArray();
  }

  public takeSpot(occupantId: string) {
    const freeSpotAddress = this.area.getAddress((spot) => !spot.isOccupied);
    const freeSpot = this.area.get(freeSpotAddress);
    const updated = freeSpot.setOccupant(occupantId);
    this.area.set(freeSpotAddress, updated);
  }

  public consumeResources(occupantId: string, amount: number): number {
    const address = this.area.getAddress((spot) => spot.occupantId === occupantId);
    const spot = this.area.get(address);
    const consumption = Math.min(spot.resourceCount, amount);
    const updated = spot.subResources(consumption);
    this.area.set(address, updated);
    return consumption;
  }
}
