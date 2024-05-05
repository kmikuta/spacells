import { Terrain } from "../main";
import { TerrainFacade } from "../terrain/TerrainFacade";
import { Cell, CellParameters } from "./Cell";

export class CellFactory {
  public static createCell(id: string, terrain: Terrain, parameters?: CellParameters): Cell {
    return new Cell(id, new TerrainFacade(terrain, id), parameters);
  }
}
