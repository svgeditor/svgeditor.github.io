export class PercentageUtils {
  static getPartialValue(initialValue: number, percentage: number): number {
    return (initialValue * percentage) / 100;
  }
}
