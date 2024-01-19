import { CalendarDisplayControllerElement } from "./MonthlyCalendarDisplayController.ts";
import { h } from "@/client/modules/HTML.ts";

export class Calendar {
    readonly name: string;
    readonly #eventTarget = new EventTarget();
    #value?: CalendarDisplayOptions;

    constructor(name: string) {
        this.name = name;
    }

    updateDisplay(value: CalendarDisplayOptions) {
        if (this.#value != null && value.equals(this.#value))
            return;

        this.#value = value;
        this.#eventTarget.dispatchEvent(new CalendarDisplayOptionsChangedEvent(value));
    }

    addEventListener(type: typeof CalendarDisplayOptionsChangedEvent.type, listener: (e: CalendarDisplayOptionsChangedEvent) => unknown) {
        this.#eventTarget.addEventListener(type, listener as EventListener);
    }

    attach(document: Document) {
        const $calendarList = document.querySelectorAll(`${CalendarElement.tagName}[name="${this.name}"]`)
        for (const $calendar of Array.from($calendarList) as CalendarElement[]) {
            this.connectElem($calendar);
        }

        const $displayControllerList = document.querySelectorAll(`${CalendarDisplayControllerElement.tagName}[for="${this.name}"]`);
        for (const $controller of Array.from($displayControllerList) as CalendarDisplayControllerElement[]) {
            this.connectDisplayControllerElem($controller);
        }
    }

    connectElem($calendar: CalendarElement) {
        $calendar.addEventListener(CalendarDisplayOptionsChangedEvent.type, _e => { });
        this.addEventListener(CalendarDisplayOptionsChangedEvent.type, e => {
            $calendar.update(e.data);
        });
    }

    connectDisplayControllerElem($controller: CalendarDisplayControllerElement) {
        $controller.addEventListener(CalendarDisplayOptionsChangedEvent.type, e => {
            if (e instanceof CalendarDisplayOptionsChangedEvent)
                this.updateDisplay(e.data);
        });
        this.addEventListener(CalendarDisplayOptionsChangedEvent.type, e => {
            $controller.update(e.data);
        });
    }
}

export class CalendarDisplayOptions {
    readonly year: number;
    readonly month: number;

    private constructor({ year, month }: { year: number; month: number; }) {
        if (month < 1 || month > 12)
            throw new TypeError(`Invalid month: ${month}`);
        this.year = year;
        this.month = month;
    }

    static from({ year, month }: { year: number; month: number; }) {
        const monthLeft = ((month - 1) % 12 + 12) % 12 + 1;
        const yearAdded = Math.floor((month - 1) / 12);
        return new this({
            year: year + yearAdded,
            month: monthLeft
        });
    }

    equals(other: CalendarDisplayOptions) {
        return other.year === this.year && other.month === this.month;
    }
};

export class CalendarDisplayOptionsChangedEvent extends Event {
    static readonly type = "Calendar::change-display";

    readonly data: CalendarDisplayOptions;
    constructor(data: CalendarDisplayOptions) {
        super(CalendarDisplayOptionsChangedEvent.type);
        this.data = data;
    }
}

export class CalendarElement extends HTMLElement {
    static readonly tagName = "elem-monthly_calendar";

    readonly #elems: {
        readonly days: HTMLElement;
    };

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.#elems = {
            days: h("div", { class: "days" })
        };
        this.shadowRoot?.append(
            h("style", {}, {}, [getCalendarElemStyle()]),
            this.#elems.days
        );
    }

    update(options: CalendarDisplayOptions) {
        this.#elems.days.innerHTML = "";
        this.#elems.days.append(...createCalendarDays(options));
    }
}

window.customElements.define(CalendarElement.tagName, CalendarElement);

function getCalendarElemStyle() {
    return `
    .days {
        background-color: #FFF;
        border-radius: 2rem;
        box-shadow: 0 1rem 3rem #0264;

        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: 1fr;
        height: 75vh;

        .day {
            text-align: center;

            &:nth-child(n + 8) {
                border-top: solid 1px #0002;
            }

            & > p {
                display: inline-block;
                width: 4rem;
                text-align: center;
            }

            &.dow-sun {
                color: #F00;
            }
        
            &.dow-sat {
                color: #f55f5f;
            }    

            &.today > p {
                border-radius: 100rem;
                background-color: #f55f5f;
                color: #FFF;
            }
        }
    }
    `;
}

function createCalendarDays({ year, month }: CalendarDisplayOptions) {
    const $divList = [];

    const firstDate = new Date(year, month - 1, 1);
    for (let i = 0; i < firstDate.getDay(); i++) {
        $divList.push(
            h("div", { class: "day day-padding" })
        );
    }

    const today = new Date(Date.now());
    const date = new Date(firstDate.getTime());
    while (date.getFullYear() === year && date.getMonth() + 1 === month) {
        const class_isToday = date.toDateString() === today.toDateString() ? "today" : "";
        const class_dayOfWeek = `dow-${getDayOfWeekStr(date.getDay())}`;

        $divList.push(
            h("div", { class: `day ${class_dayOfWeek} ${class_isToday}` }, {}, [
                h("p", {}, {}, [date.getDate()])
            ])
        );
        date.setDate(date.getDate() + 1);
    }
    if (date.getDay() >= 1) {
        for (let i = date.getDay(); i < 7; i++) {
            $divList.push(
                h("div", { class: "day day-padding" })
            );
        }
    }
    return $divList;
}

function getDayOfWeekStr(dayOfWeekIndex: number) {
    return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][dayOfWeekIndex];
}
