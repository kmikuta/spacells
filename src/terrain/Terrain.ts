import { randomArrayElement } from "../util/array/elements";
import { Spot, SpotAddress } from "./Spot";
import { Spot2dArray } from "./Spot2dArray";

export class TerrainFullError extends Error {
  constructor() {
    super("No free spots left.");
  }
}

export class Terrain {
  private readonly spots: Spot2dArray;

  constructor(width: number, height: number, resourcesPerSpot: number) {
    this.spots = new Spot2dArray(height, width, (address: SpotAddress) => Spot.empty(address, resourcesPerSpot));
  }

  get dimensions(): string {
    return `${this.spots.cols}x${this.spots.rows}`;
  }

  get cellMatrix(): string[][] {
    return this.spots.items.map((cols) => cols.map((spot) => spot.occupantId ?? ""));
  }

  get resourceMatrix(): number[][] {
    return this.spots.items.map((cols) => cols.map((spot) => spot.resourceCount));
  }

  get visualMatrix(): string[][] {
    return this.spots.items.map((cols) => cols.map((spot) => spot.toString()));
  }

  public getSpot(occupantId: string): Spot {
    return this.spots.getByOccupantId(occupantId);
  }

  public takeSpot(occupantId: string, destSpot: Spot) {
    try {
      const currentSpot = this.spots.getByOccupantId(occupantId);
      this.spots.save(currentSpot.setOccupant(null));
    } catch {
    } finally {
      this.spots.save(destSpot.setOccupant(occupantId));
    }
  }

  public takeSpotRandomly(occupantId: string) {
    const freeSpots = this.spots.filter((spot) => !spot.isOccupied);
    if (freeSpots.length === 0) {
      throw new TerrainFullError();
    }
    const spot = randomArrayElement(freeSpots);
    this.spots.save(spot.setOccupant(occupantId));
  }

  public consumeResources(occupantId: string, amount: number): number {
    const spot = this.spots.getByOccupantId(occupantId);
    const consumption = Math.min(spot.resourceCount, amount);
    const updated = spot.subResources(consumption);
    this.spots.save(updated);
    return consumption;
  }

  public getFreeSpotsAround(occupantId: string): Spot[] {
    return this.spots.getSurroundingOfOccupant(occupantId).filter((spot) => !spot.isOccupied);
  }
}
