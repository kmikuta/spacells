import { Terrain } from "./Terrain";

export class TerrainProxy {
  constructor(private readonly terrain: Terrain, private readonly occupantId: string) {}

  public consume(amount: number): number {
    return this.terrain.consumeResources(this.occupantId, amount);
  }

  public occupy() {
    this.terrain.takeSpot(this.occupantId);
  }
}
