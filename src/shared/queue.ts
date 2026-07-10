import type { Subscribable } from '@krutoo/utils/store';

/**
 * Simple subscribable queue.
 */
export class Queue<T> implements Subscribable {
  protected items: T[];
  protected listeners: Set<VoidFunction>;

  constructor() {
    this.items = [];
    this.listeners = new Set();
  }

  enqueue(item: T): void {
    this.items.push(item);
    this.listeners.forEach(fn => fn());
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  subscribe(listener: VoidFunction): VoidFunction {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}
