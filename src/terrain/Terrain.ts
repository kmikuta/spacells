import { randomArrayElement } from "../util/array/elements";
import { Spot, SpotAddress } from "./Spot";
import { Spot2dArray } from "./Spot2dArray";

export class TerrainFullError extends Error {
  constructor() {
    super("No free spots left.");
  }
}

export class Terrain {
  private readonly spotArray: Spot2dArray;

  constructor(width: number, height: number, resourcesPerSpot: number) {
    this.spotArray = new Spot2dArray(height, width, (address: SpotAddress) => Spot.empty(address, resourcesPerSpot));
  }

  get spots(): Spot[][] {
    return this.spotArray.items;
  }

  get dimensions(): string {
    return `${this.spotArray.cols}x${this.spotArray.rows}`;
  }

  get cellMatrix(): string[][] {
    return this.spotArray.items.map((cols) => cols.map((spot) => spot.occupantId ?? ""));
  }

  get resourceMatrix(): number[][] {
    return this.spotArray.items.map((cols) => cols.map((spot) => spot.resourceCount));
  }

  get visualMatrix(): string[][] {
    return this.spotArray.items.map((cols) => cols.map((spot) => spot.toString()));
  }

  public getSpot(occupantId: string): Spot {
    return this.spotArray.getByOccupantId(occupantId);
  }

  public takeSpot(occupantId: string, destSpot: Spot) {
    try {
      const currentSpot = this.spotArray.getByOccupantId(occupantId);
      this.spotArray.save(currentSpot.setOccupant(null));
    } catch {
    } finally {
      this.spotArray.save(destSpot.setOccupant(occupantId));
    }
  }

  public takeSpotRandomly(occupantId: string) {
    const freeSpots = this.spotArray.filter((spot) => !spot.isOccupied);
    if (freeSpots.length === 0) {
      throw new TerrainFullError();
    }
    const spot = randomArrayElement(freeSpots);
    this.spotArray.save(spot.setOccupant(occupantId));
  }

  public consumeResources(occupantId: string, amount: number): number {
    const spot = this.spotArray.getByOccupantId(occupantId);
    const consumption = Math.min(spot.resourceCount, amount);
    const updated = spot.subResources(consumption);
    this.spotArray.save(updated);
    return consumption;
  }

  public getFreeSpotsAround(occupantId: string): Spot[] {
    return this.spotArray.getSurroundingOfOccupant(occupantId).filter((spot) => !spot.isOccupied);
  }
}
