import { html } from "../../modules/HTML.ts";

type Listener = (event: { value: MonthlyCalendarOptionsValue }) => unknown;

export class MonthlyCalendarOptions {
    static #instances = new Map<MonthlyCalendarOptionsElement, MonthlyCalendarOptions>();

    readonly #listeners = new Set<Listener>();
    readonly #view: MonthlyCalendarOptionsElement;
    #value?: MonthlyCalendarOptionsValue;

    private constructor(view: MonthlyCalendarOptionsElement) {
        this.#view = view;
        this.#view.setModel(this);
        this.update(new MonthlyCalendarOptionsValue({ year: 2024, month: 1 }));
    }

    static byAttached(document: Document) {
        const view = document.querySelector(`${MonthlyCalendarOptionsElement.tagName}#monthlyCalendarOptions`) as MonthlyCalendarOptionsElement | null;
        if (view == null)
            throw new Error(`CalendarOptions (${MonthlyCalendarOptionsElement.tagName}#monthlyCalendarOptions) の要素が見つかりません`);

        const instance = this.#instances.get(view);
        if (instance != null) return instance;

        const newInstance = new this(view);
        this.#instances.set(view, newInstance);
        return newInstance;
    }

    update(value: MonthlyCalendarOptionsValue) {
        if (this.#value?.equals(value))
            return;

        this.#view.update(value);
        this.#dispatchEvent({ value });
    }

    #dispatchEvent(event: { value: MonthlyCalendarOptionsValue }) {
        for (const listener of this.#listeners)
            listener(event);
    }

    addListener(fn: Listener) {
        this.#listeners.add(fn);
    }
}

export class MonthlyCalendarOptionsValue {
    readonly year: number;
    readonly month: number;

    constructor({ year, month }: { year: number; month: number; }) {
        this.year = year;
        this.month = month;
    }
    
    equals(other: MonthlyCalendarOptionsValue) {
        return other.year === this.year && other.month === this.month;
    }
};

export class MonthlyCalendarOptionsElement extends HTMLElement {
    static readonly tagName = "elem-monthly-calendar-options";
    
    readonly id = "calendarOptions";
    readonly #$shadow: ShadowRoot;
    readonly #$elems: {
        readonly year: HTMLInputElement;
        readonly month: HTMLInputElement;
    };
    #model?: MonthlyCalendarOptions;

    constructor() {
        super();
        this.#$shadow = this.attachShadow({ mode: "open" });
        this.#$elems = {
            year: html`<input name="year" type="number">`[0] as HTMLInputElement,
            month: html`<input name="month" type="number">`[0] as HTMLInputElement
        };
        this.#$shadow.append(... html`
            <div>
                ${this.#$elems.year}
                <label for="year">年</label>
            </div>
            <div>
                ${this.#$elems.month}
                <label for="year">月</label>
            </div>
        `);
        this.#$elems.year.addEventListener("change", (_e) => {
            this.#model?.update(this.getValue());
        });
        this.#$elems.month.addEventListener("change", (_e) => this.#model?.update(this.getValue()));
    }

    setModel(model: MonthlyCalendarOptions) {
        this.#model = model;
    }

    getValue(): MonthlyCalendarOptionsValue {
        return new MonthlyCalendarOptionsValue({ 
            year: +(this.#$elems.year.value),
            month: +(this.#$elems.month.value)
        });
    }

    update(value: MonthlyCalendarOptionsValue) {
        if (this.getValue().equals(value))
            return;

        this.#$elems.year.value = `${value.year}`;
        this.#$elems.month.value = `${value.month}`;
    }
}

window.customElements.define(MonthlyCalendarOptionsElement.tagName, MonthlyCalendarOptionsElement);