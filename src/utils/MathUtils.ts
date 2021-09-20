export class MathUtils {
  static random(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
