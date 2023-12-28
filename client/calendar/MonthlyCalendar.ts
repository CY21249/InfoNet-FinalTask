import { html } from "@/client/modules/HTML.ts";

export class MonthlyCalendar {
    static readonly #instances = new Map<MonthlyCalendarElement, MonthlyCalendar>();

    readonly #$view: MonthlyCalendarElement;
    
    update(value: MonthlyCalendarValue) {
        this.#$view.update(value);
    }

    private constructor($view: MonthlyCalendarElement) {
        this.#$view = $view;
    }

    static byAttached(document: Document, id: string) {
        const $view = document.querySelector(`${MonthlyCalendarElement.tagName}#${id}`) as MonthlyCalendarElement | null;
        if ($view == null)
            throw new Error(`${MonthlyCalendarElement.tagName}#${id} does not exist.`);

        const instance = this.#instances.get($view);
        if (instance != null) return instance;

        const newInstance = new this($view);
        this.#instances.set($view, newInstance);
        return newInstance;
    } 
}

class MonthlyCalendarValue {
    readonly year: number;
    readonly month: number;

    constructor({ year, month }: { year: number; month: number; }) {
        this.year = year;
        this.month = month;
    }
}

