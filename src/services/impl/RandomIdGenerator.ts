import { IRandomIdGenerator } from '../IRandomIdGenerator';

export class RandomIdGenerator implements IRandomIdGenerator {
  private static instance: IRandomIdGenerator = new RandomIdGenerator();

  private constructor() {}

  static getInstance(): IRandomIdGenerator {
    return RandomIdGenerator.instance;
  }

  generate(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
