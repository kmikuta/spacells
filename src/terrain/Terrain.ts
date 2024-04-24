import { randomArrayElement } from "../util/array/elements";
import { Spot2dArray, SpotAddress } from "./Spot2dArray";

export class Terrain {
  private readonly area: Spot2dArray;

  constructor(width: number, height: number, resourcesPerSpot: number) {
    this.area = new Spot2dArray(height, width, resourcesPerSpot);
  }

  get dimensions(): string {
    return `${this.area.cols}x${this.area.rows}`;
  }

  get cellMatrix(): string[][] {
    return this.area.items.map((cols) => cols.map((spot) => spot.occupantId ?? ""));
  }

  get resourceMatrix(): number[][] {
    return this.area.items.map((cols) => cols.map((spot) => spot.resourceCount));
  }

  get visualMatrix(): string[][] {
    return this.area.items.map((cols) => cols.map((spot) => spot.toString()));
  }

  public takeSpot(occupantId: string, address: SpotAddress) {
    const currentAddress = this.getOccupantAddress(occupantId);
    const currentSpot = this.area.get(currentAddress);
    const newSpot = this.area.get(address);
    this.area.set(currentAddress, currentSpot.setOccupant(null));
    this.area.set(address, newSpot.setOccupant(occupantId));
  }

  public takeInitialSpot(occupantId: string) {
    const currentAddress = this.area.findAddress((spot) => spot.occupantId === occupantId);
    if (currentAddress !== null) {
      throw new Error("The occupant already has a spot.");
    }

    const freeSpotAddresses = this.area.findAddresses((spot) => !spot.isOccupied);
    if (freeSpotAddresses.length === 0) {
      throw new Error("Cannot find free spot anymore.");
    }

    const address = randomArrayElement(freeSpotAddresses);
    const spot = this.area.get(address);
    this.area.set(address, spot.setOccupant(occupantId));
  }

  public consumeResources(occupantId: string, amount: number): number {
    const address = this.getOccupantAddress(occupantId);
    const spot = this.area.get(address);
    const consumption = Math.min(spot.resourceCount, amount);
    const updated = spot.subResources(consumption);
    this.area.set(address, updated);
    return consumption;
  }

  public getFreeSpotAddressesAround(occupantId: string): SpotAddress[] {
    const address = this.getOccupantAddress(occupantId);
    const surrounding = this.area.getSurrounding(address);
    return surrounding.filter((address) => !this.area.get(address).isOccupied);
  }

  private getOccupantAddress(occupantId: string): SpotAddress {
    const address = this.area.findAddress((spot) => spot.occupantId === occupantId);
    if (address === null) {
      throw new Error(`Occupant ${occupantId} has no address.`);
    }
    return address;
  }
}
