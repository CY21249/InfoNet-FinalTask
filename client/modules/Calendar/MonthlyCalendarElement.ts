import { html } from "../HTML.ts";
import { ChangeDisplayOptions, MonthlyCalendar } from "@/client/modules/Calendar/MonthlyCalendar.ts";

export class MonthlyCalendarElement extends HTMLElement {
    static readonly tagName = "elem-monthly-calendar";

    readonly #$shadow: ShadowRoot;
    readonly #$elems: {
        days: HTMLElement;
    };

    constructor() {
        super();
        this.#$shadow = this.attachShadow({ mode: "open" });

        const { $children, $elems } = createRootChildren();
        this.#$elems = $elems;
        this.#$shadow.append(...$children);
    }

    update(calendar: MonthlyCalendar) {
        this.#$elems.days.innerHTML = "";
        const { $children } = createDaysChildren(calendar.displayOptions);
        this.#$elems.days.append(...$children);
    }
}

window.customElements.define(MonthlyCalendarElement.tagName, MonthlyCalendarElement);

function createRootChildren() {
    const $days = html`<div class="days"></div>`[0]
    const $children = html`
        <style>
            :scope {
                display: grid;
                grid-column-template: repeat(1fr, 7);
            }
        </style>
        ${$days}
    `;
    return {
        $children,
        $elems: { days: $days }
    };
}

function createDaysChildren({ year, month }: ChangeDisplayOptions) {
    const $divList = [];
    const firstDate = new Date(year, month - 1, 1);
    for (let i = 0; i < firstDate.getDay(); i++) {
        $divList.push(html`
                <div class="day day-padding"></div>
            `[0]);
    }

    let date = firstDate;
    while (date.getFullYear() === year && date.getMonth() + 1 === month) {
        $divList.push(html`
                <div class="day">
                    <p>${date.getDate()}</p>
                </div>
            `[0]);
        date = new Date(date.setDate(date.getDate() + 1));
    }
    return {
        $children: $divList
    };
}