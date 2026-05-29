/**
 * FlexiBus - Framework-agnostic event bus for modal/component communication
 * Uses Map<eventName, Set<callback>> for O(1) unsubscribe
 */

export interface FlexiEntry {
  component: string;
  params?: Record<string, unknown>;
}

type FlexiBusCallback = (entry: FlexiEntry) => void;

export class FlexiBus {
  private static _instance: FlexiBus | null = null;

  static getInstance(): FlexiBus {
    if (!FlexiBus._instance) {
      FlexiBus._instance = new FlexiBus();
    }
    return FlexiBus._instance;
  }

  static resetInstance(): void {
    FlexiBus._instance = null;
  }

  private subscribers: Map<string, Set<FlexiBusCallback>> = new Map();

  subscribe(eventName: string, callback: FlexiBusCallback): void {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, new Set());
    }
    this.subscribers.get(eventName)!.add(callback);
  }

  unsubscribe(eventName: string, callback: FlexiBusCallback): void {
    const callbacks = this.subscribers.get(eventName);
    if (!callbacks) return;
    callbacks.delete(callback);
    if (callbacks.size === 0) {
      this.subscribers.delete(eventName);
    }
  }

  thereAreSubscribers(eventName: string): boolean {
    const callbacks = this.subscribers.get(eventName);
    return callbacks ? callbacks.size > 0 : false;
  }

  push(eventName: string, entry: FlexiEntry): void {
    this._emit(eventName, entry);
  }

  show(eventName: string, entry: FlexiEntry): void {
    this._emit(`${eventName}_show`, entry);
  }

  close(eventName: string): void {
    this._emit(eventName, undefined as unknown as FlexiEntry);
  }

  closeAll(eventName: string): void {
    this._emit(`${eventName}_closeAll`, undefined as unknown as FlexiEntry);
  }

  private _emit(eventName: string, entry: FlexiEntry | undefined): void {
    const callbacks = this.subscribers.get(eventName);
    if (!callbacks) return;
    callbacks.forEach(callback => callback(entry));
  }
}

export const flexiBus = FlexiBus.getInstance();