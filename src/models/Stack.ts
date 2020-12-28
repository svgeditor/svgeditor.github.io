export class Stack<T> {
  private list: T[] = [];
  push(val: T): Stack<T> {
    this.list.push(val);
    return this;
  }
  pop(): T | undefined {
    return this.list.pop();
  }
  size(): number {
    return this.list.length;
  }
}
