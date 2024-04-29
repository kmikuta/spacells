import { create2DArray, findIndexesIn2DArray, getSurroundingIn2DArray } from "../util/array/array2d";
import { Spot, SpotAddress } from "./Spot";

export class OccupantNotFoundError extends Error {
  constructor(occupantId: string) {
    super(`Cannot find occupant with id: ${occupantId}`);
  }
}

export class Spot2dArray {
  private readonly area: Spot[][] = [];
  private readonly occupantIdAddressMapping = new Map<string, SpotAddress>();

  constructor(
    public readonly rows: number,
    public readonly cols: number,
    initialValueFactory: (address: SpotAddress) => Spot,
  ) {
    this.area = create2DArray(rows, cols, initialValueFactory);

    this.filter((spot) => spot.occupantId !== null).forEach((spot) => {
      this.occupantIdAddressMapping.set(spot.occupantId!, spot.address);
    });
  }

  get items(): Spot[][] {
    return this.area.map((cols) => cols.map((item) => item.copy()));
  }

  public getByOccupantId(occupantId: string): Spot {
    const address = this.occupantIdAddressMapping.get(occupantId);
    if (address === undefined) {
      throw new OccupantNotFoundError(occupantId);
    }
    const { i, j } = address;
    return this.area[i][j].copy();
  }

  public filter(predicate: (spot: Spot) => boolean): Spot[] {
    return findIndexesIn2DArray(this.area, predicate).map(({ i, j }) => this.area[i][j].copy());
  }

  public save(spot: Spot) {
    const { i, j } = spot.address;
    this.area[i][j] = spot;

    if (spot.occupantId !== null) {
      this.occupantIdAddressMapping.set(spot.occupantId, spot.address);
    }
  }

  public getSurroundingOfOccupant(occupantId: string): Spot[] {
    const spot = this.getByOccupantId(occupantId);
    return getSurroundingIn2DArray(spot.address, this.rows, this.cols).map(({ i, j }) => this.area[i][j].copy());
  }
}
