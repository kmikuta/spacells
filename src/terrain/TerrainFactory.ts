import { Terrain } from "./Terrain";

export interface TerrainConfig {
  width: number;
  height: number;
  resourcesPerSpot: number;
}

export class TerrainFactory {
  public static createTerrain({ width, height, resourcesPerSpot }: TerrainConfig): Terrain {
    return new Terrain(width, height, resourcesPerSpot);
  }
}
