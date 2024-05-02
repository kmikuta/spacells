import { Unsubscribe, createNanoEvents } from "nanoevents";
import { Spot, SpotAddress } from "./Spot";
import { Spot2dArray } from "./Spot2dArray";
import { randomArrayElement } from "../util/array/elements";

export class TerrainFullError extends Error {
  constructor() {
    super("No free spots left.");
  }
}

export interface TerrainOccupant {
  id: string;
}

export type OccupantAddedHandler = (cell: TerrainOccupant) => void;

const Events = {
  OccupantAdded: "@terrain/occupant-added",
};

export class Terrain {
  private readonly spotArray: Spot2dArray;
  private readonly emitter = createNanoEvents();

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

  public onOccupantAdded(handler: OccupantAddedHandler): Unsubscribe {
    return this.emitter.on(Events.OccupantAdded, handler);
  }

  public getSpot(occupantId: TerrainOccupant["id"]): Spot {
    return this.spotArray.getByOccupantId(occupantId);
  }

  public takeSpot(occupantId: TerrainOccupant["id"], destSpot: Spot) {
    try {
      const currentSpot = this.spotArray.getByOccupantId(occupantId);
      this.spotArray.save(currentSpot.setOccupant(null));
    } catch {
    } finally {
      this.spotArray.save(destSpot.setOccupant(occupantId));
    }
  }

  public takeSpotRandomly(occupantId: TerrainOccupant["id"]) {
    const freeSpots = this.spotArray.filter((spot) => !spot.isOccupied);
    if (freeSpots.length === 0) {
      throw new TerrainFullError();
    }
    const spot = randomArrayElement(freeSpots);
    this.spotArray.save(spot.setOccupant(occupantId));
  }

  public consumeResources(occupantId: TerrainOccupant["id"], amount: number): number {
    const spot = this.spotArray.getByOccupantId(occupantId);
    const consumption = Math.min(spot.resourceCount, amount);
    const updated = spot.subResources(consumption);
    this.spotArray.save(updated);
    return consumption;
  }

  public getFreeSpotsAround(occupantId: TerrainOccupant["id"]): Spot[] {
    return this.spotArray.getSurroundingOfOccupant(occupantId).filter((spot) => !spot.isOccupied);
  }

  public putOccupant(occupant: TerrainOccupant, spot: Spot) {
    this.takeSpot(occupant.id, spot);
    this.emitter.emit(Events.OccupantAdded, occupant);
  }
}
