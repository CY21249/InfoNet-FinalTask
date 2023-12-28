export type ChangeDisplayOptions = {
    readonly year: number;
    readonly month: number;
};

export class ChangeDisplayEvent extends Event {
    readonly data: ChangeDisplayOptions;

    constructor(data: ChangeDisplayOptions) {
        super("change-display");
        this.data = data;
    }
};

export class MonthlyCalendar {
    readonly #eventTarget = new EventTarget();
    displayOptions?: ChangeDisplayOptions;

    changeDisplay(displayOptions: ChangeDisplayOptions) {
        this.displayOptions = displayOptions;
        
        this.#eventTarget.dispatchEvent(new ChangeDisplayEvent(displayOptions));
    }

    addEventListener(name: "change-display", fn: (e: ChangeDisplayEvent) => unknown) {
        this.#eventTarget.addEventListener(name, fn as EventListener);
    }
}