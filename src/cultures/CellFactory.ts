import { Terrain } from "../main";
import { TerrainFacade } from "../terrain/TerrainFacade";
import { Cell } from "./Cell";

export interface CellConfig {
  id: string;
  initialEnergy?: number;
  initialSize?: number;
}

export class CellFactory {
  public static createCell(terrain: Terrain, { id, initialEnergy, initialSize }: CellConfig): Cell {
    return new Cell(id, new TerrainFacade(terrain, id), initialEnergy, initialSize);
  }
}
