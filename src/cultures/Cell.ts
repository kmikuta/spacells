import { randomArrayElement } from "../util/array/elements";
import { TerrainFacade } from "../terrain/TerrainFacade";
import { EnergyStore, NotEnoughEnergyError } from "../energy/EnergyStore";
import { randomStr } from "../util/random";

const MINIMAL_SIZE_TO_DIVIDE = 8;

export type DivisionCallback = (newCell: Cell) => void;

export interface CellParameters {
  initialSize?: number;
  initialEnergy?: number;
  migrationEnergyCost?: number;
  divisionEnergyCost?: number;
  growEnergyCost?: number;
  innerProcessEnergyCost?: number;
  resourceConsumptionRate?: number;
  growRate?: number;
}

type FulfilledCellParameters = Required<CellParameters>;

const DEFAULT_CELL_PARAMETERS: FulfilledCellParameters = {
  initialSize: 1,
  initialEnergy: 5,
  migrationEnergyCost: 0.2,
  divisionEnergyCost: 5,
  growEnergyCost: 0.5,
  innerProcessEnergyCost: 0.2,
  resourceConsumptionRate: 1,
  growRate: 0.5,
};

const ensureParametersFullfilled = (parameters: CellParameters): FulfilledCellParameters => {
  return { ...DEFAULT_CELL_PARAMETERS, ...parameters };
};

export class Cell {
  private readonly energyStore: EnergyStore;
  private readonly parameters: FulfilledCellParameters;
  private size: number;
  private children: Cell[] = [];

  constructor(
    public readonly id: string,
    private readonly terrain: TerrainFacade,
    config: CellParameters = DEFAULT_CELL_PARAMETERS,
  ) {
    this.parameters = ensureParametersFullfilled(config);
    this.energyStore = new EnergyStore(this.parameters.initialEnergy);
    this.size = this.parameters.initialSize;
  }

  get energy(): number {
    return this.energyStore.currentValue;
  }

  get cellSize(): number {
    return this.size;
  }

  private get canDivide(): boolean {
    return this.size >= MINIMAL_SIZE_TO_DIVIDE && this.energyStore.currentValue >= this.parameters.divisionEnergyCost;
  }

  public step() {
    this.executeInnerProcesses();
    this.produceEnergy();
    this.grow();
    this.divide();
  }

  private executeInnerProcesses() {
    try {
      this.energyStore.utilize(this.parameters.innerProcessEnergyCost);
    } catch (e: unknown) {
      if (e instanceof NotEnoughEnergyError) {
        // consider changing the reproduction strategy
      }
    }
  }

  private produceEnergy() {
    // This should be a negative feedback loop instead of a discrete 0/1
    if (!this.energyStore.needsEnergy()) {
      return;
    }
    const consumed = this.consume();
    this.energyStore.add(consumed);
  }

  private consume() {
    const consumed = this.terrain.consume(this.parameters.resourceConsumptionRate);

    if (consumed === 0) {
      this.move();
      return 0;
    }

    return consumed;
  }

  private grow() {
    try {
      this.energyStore.utilize(this.parameters.growEnergyCost);
      this.size += this.parameters.growRate;
    } catch (e: unknown) {
      if (e instanceof NotEnoughEnergyError) {
        // consider changing the reproduction strategy
      }
    }
  }

  private divide() {
    if (!this.canDivide) {
      return;
    }

    const freeSpots = this.terrain.getPossibleNextMoves();
    if (freeSpots.length === 0) {
      return;
    }

    const clone = this.clone();
    this.energyStore.utilize(this.parameters.divisionEnergyCost);
    this.terrain.put(clone, randomArrayElement(freeSpots));
    this.children.push(clone);
  }

  private move() {
    const nextMoves = this.terrain.getPossibleNextMoves();
    if (nextMoves.length === 0) {
      return;
    }

    const nextMove = randomArrayElement(nextMoves);
    try {
      this.energyStore.utilize(this.parameters.migrationEnergyCost);
      this.terrain.moveToSpot(nextMove);
    } catch (e: unknown) {
      if (e instanceof NotEnoughEnergyError) {
        // consider changing the reproduction strategy
      }
    }
  }

  private clone(): Cell {
    const [rootAncestorId] = this.id.split("_");
    let id: string;
    do {
      id = `${rootAncestorId}_${randomStr(4)}`;
    } while (this.children.find((cell) => cell.id === id) !== undefined);
    return new Cell(id, this.terrain.clone(id), this.parameters);
  }
}
