// deno-lint-ignore-file no-explicit-any

export interface MyEvent<T, D> {
    readonly data: D;
    readonly target: T | null;
}
type MyEventDefault = MyEvent<any, any>;

type MyEventHandler<E extends MyEvent<any, any>> = (e: E) => any;
export interface MyEventListener<T extends string, E extends MyEventDefault> {
    readonly type: T;
    readonly handler: MyEventHandler<E>;
};
type MyEventListenerDefault = MyEventListener<string, MyEventDefault>;

type MyEventTypeOf<L extends MyEventListenerDefault> = L extends MyEventListener<infer T, MyEventDefault> ? T : never;
type MyEventOf<L extends MyEventListenerDefault> = L extends MyEventListener<string, infer E> ? E : never;

export interface MyEventTarget<L extends MyEventListener<string, MyEventDefault>> {
    dispatchEvent(type: MyEventTypeOf<L>, event: MyEventOf<L>): void;
    addEventListener(listener: L): void;
    removeEventListener(listener: L): void;
}

export class MyEventListeners<L extends MyEventListenerDefault> {
    readonly #map = new Map<MyEventTypeOf<L>, Set<L>>();

    add(listener: L) {
        const type = listener.type as MyEventTypeOf<L>;
        let set = this.#map.get(type)
        if (set == null) {
            set = new Set();
            this.#map.set(type, set);
        }
        set.add(listener);
    }

    remove(listener: L) {
        const type = listener.type as MyEventTypeOf<L>;
        this.#map.get(type)?.delete(listener);
    }

    dispatch<L1 extends L>(type: MyEventTypeOf<L1>, event: MyEventOf<L1>) {
        for (const listener of this.#map.get(type) ?? [])
            listener.handler(event);
    }
}