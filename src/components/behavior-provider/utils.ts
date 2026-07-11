import type { CoreEvents, ElementRegistry, ElementRegistryItem } from '#types/core';

export class ElementRegistryImpl implements ElementRegistry {
  protected map: Map<string, ElementRegistryItem>;

  protected registryListeners: Set<VoidFunction>;

  protected anyStoreListeners: Set<VoidFunction>;

  protected anyStoreFlushers: Map<string, VoidFunction>;

  protected handleAnyStoreChange: VoidFunction;

  readonly events: CoreEvents;

  constructor() {
    this.map = new Map<string, ElementRegistryItem>();
    this.registryListeners = new Set<VoidFunction>();
    this.anyStoreListeners = new Set<VoidFunction>();
    this.anyStoreFlushers = new Map<string, VoidFunction>();
    this.handleAnyStoreChange = () => {
      this.anyStoreListeners.forEach(fn => fn());
    };

    this.events = {
      registryChanged: {
        subscribe: fn => {
          this.registryListeners.add(fn);

          return () => {
            this.registryListeners.delete(fn);
          };
        },
      },
      anyStoreChanged: {
        subscribe: fn => {
          this.anyStoreListeners.add(fn);

          return () => {
            this.anyStoreListeners.delete(fn);
          };
        },
      },
    };
  }

  get(elementId: string): ElementRegistryItem | undefined {
    return this.map.get(elementId);
  }

  set(elementId: string, item: ElementRegistryItem): void {
    this.map.set(elementId, item);

    if (item.store) {
      this.anyStoreFlushers.set(elementId, item.store.subscribe(this.handleAnyStoreChange));
    }

    this.registryListeners.forEach(fn => fn());
  }

  delete(elementId: string): void {
    this.map.delete(elementId);
    this.anyStoreFlushers.get(elementId)?.();
    this.anyStoreFlushers.delete(elementId);
    this.registryListeners.forEach(fn => fn());
  }

  subscribe(listener: VoidFunction): VoidFunction {
    this.registryListeners.add(listener);

    return () => {
      this.registryListeners.delete(listener);
    };
  }

  values(): IterableIterator<ElementRegistryItem<unknown>> {
    return this.map.values();
  }
}
