import { IRandomIdService } from '../IRandomIdService';

export class RandomIdService implements IRandomIdService {
  private static instance: IRandomIdService = new RandomIdService();

  private constructor() {}

  static getInstance(): IRandomIdService {
    return RandomIdService.instance;
  }

  generate(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
