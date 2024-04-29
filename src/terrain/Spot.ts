export type SpotAddress = { i: number; j: number };

export class Spot {
  private constructor(
    public readonly address: SpotAddress,
    public readonly occupantId: string | null,
    public readonly resourceCount: number,
  ) {}

  public static empty(address: SpotAddress, initialResources: number): Spot {
    return new Spot(address, null, initialResources);
  }

  public static create(address: SpotAddress, occupantId: string, initialResources: number): Spot {
    return new Spot(address, occupantId, initialResources);
  }

  get isOccupied() {
    return this.occupantId !== null;
  }

  public subResources(consumption: number) {
    return new Spot(this.address, this.occupantId, this.resourceCount - consumption);
  }

  public setOccupant(occupantId: string | null) {
    return new Spot(this.address, occupantId, this.resourceCount);
  }

  public copy(): Spot {
    return new Spot(this.address, this.occupantId, this.resourceCount);
  }

  public toString(): string {
    return `[${this.occupantId ?? "__"}] (${this.resourceCount})`;
  }
}
