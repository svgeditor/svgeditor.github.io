export class Stack<T> {
  private list: T[] = [];
  push(val: T): void {
    this.list.push(val);
  }
  pop(): T | undefined {
    return this.list.pop();
  }
  size(): number {
    return this.list.length;
  }
}
