type Handler<T = unknown> = (payload: T) => void;

class EventBus {
  private handlers: Map<string, Handler[]> = new Map();

  on<T>(event: string, handler: Handler<T>): void {
    const existing = this.handlers.get(event) ?? [];
    this.handlers.set(event, [...existing, handler as Handler]);
  }

  off<T>(event: string, handler: Handler<T>): void {
    const existing = this.handlers.get(event) ?? [];
    this.handlers.set(event, existing.filter(h => h !== handler));
  }

  emit<T>(event: string, payload?: T): void {
    const existing = this.handlers.get(event) ?? [];
    existing.forEach(h => h(payload as unknown));
  }
}

export const gameBus = new EventBus();
