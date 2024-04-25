import { round } from "../util/decimal";

export class NotEnoughEnergyError extends Error {
  constructor() {
    super("Not enough energy to utilize.");
  }
}

const ENERGY_LIMIT = 10;
const ENERGY_LIMIT_RATE = 0.85;

export class EnergyStore {
  constructor(private value: number) {}

  get currentValue(): number {
    return this.value;
  }

  public utilize(value: number) {
    if (this.value < value) {
      throw new NotEnoughEnergyError();
    }
    const newValue = this.value - value;
    this.value = round(newValue, 2);
  }

  public add(value: number) {
    const newValue = this.value + value;
    this.value = round(newValue, 2);
  }

  public needsEnergy(): boolean {
    return this.value / ENERGY_LIMIT < ENERGY_LIMIT_RATE;
  }
}
