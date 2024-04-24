export class Spot {
  constructor(
    public readonly occupantId: string | null,
    public readonly resourceCount: number,
  ) {}

  public static empty(initialResources: number): Spot {
    return new Spot(null, initialResources);
  }

  get isOccupied() {
    return this.occupantId !== null;
  }

  public subResources(consumption: number) {
    return new Spot(this.occupantId, this.resourceCount - consumption);
  }

  public setOccupant(occupantId: string | null) {
    return new Spot(occupantId, this.resourceCount);
  }

  public copy(): Spot {
    return new Spot(this.occupantId, this.resourceCount);
  }

  public toString(): string {
    return `[${this.occupantId ?? "__"}] (${this.resourceCount})`;
  }
}
