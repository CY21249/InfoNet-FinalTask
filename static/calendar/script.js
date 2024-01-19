/**
* File transpiled from TypeScript and bundled 
* - at 2024/1/19 19:49:31
* - file: ./client/calendar/script.ts -> ./static/calendar/script.js
* - using: https://deno.land/x/emit@0.32.0/mod.ts
*/
function h(tag, attrs, listeners, children) {
    const elem = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs ?? {})){
        elem.setAttribute(name, `${value}`);
    }
    for (const [type, fn] of Object.entries(listeners ?? {})){
        elem.addEventListener(type, fn);
    }
    elem.append(...children?.map((child)=>child instanceof HTMLElement || typeof child === "string" ? child : `${child}`) ?? []);
    return elem;
}
document.addEventListener("click", (e)=>e);
h("body", {}, {}, [
    h("h1", {}, {
        mousedown (e) {
            e.altKey;
        }
    }, [
        "Hello, World!"
    ])
]);
class CalendarDisplayOptionsChangedEvent extends Event {
    static type = "Calendar::change-display";
    data;
    constructor(data){
        super(CalendarDisplayOptionsChangedEvent.type);
        this.data = data;
    }
}
class CalendarDisplayOptions {
    year;
    month;
    constructor({ year, month }){
        if (month < 1 || month > 12) throw new TypeError(`Invalid month: ${month}`);
        this.year = year;
        this.month = month;
    }
    static from({ year, month }) {
        const monthLeft = ((month - 1) % 12 + 12) % 12 + 1;
        const yearAdded = Math.floor((month - 1) / 12);
        return new this({
            year: year + yearAdded,
            month: monthLeft
        });
    }
    equals(other) {
        return other.year === this.year && other.month === this.month;
    }
}
class CalendarDisplayControllerElement extends HTMLElement {
    static tagName = "elem-monthly_calendar-display_controller";
    #elems;
    constructor(){
        super();
        this.attachShadow({
            mode: "open"
        });
        this.#elems = {
            year: h("input", {
                name: "year",
                type: "number"
            }, {
                change: this.#onInputChangedHandler
            }),
            month: h("input", {
                name: "month",
                type: "number"
            }, {
                change: this.#onInputChangedHandler
            })
        };
        const $style = this.shadowRoot?.appendChild(document.createElement("style"));
        if ($style) $style.textContent = getStyle();
        this.shadowRoot?.append(h("div", {}, {}, [
            h("div", {
                class: "inputs"
            }, {}, [
                h("div", {
                    class: "year"
                }, {}, [
                    this.#elems.year,
                    h("span", {}, {}, [
                        "年"
                    ])
                ]),
                h("div", {
                    class: "month"
                }, {}, [
                    this.#elems.month,
                    h("span", {}, {}, [
                        "月"
                    ])
                ])
            ]),
            h("div", {
                class: "buttons"
            }, {}, [
                h("button", {
                    class: "btn-sub_month"
                }, {
                    click: this.#onSubMonthClickedHandler
                }, [
                    "<"
                ]),
                h("button", {
                    class: "btn-back_month"
                }, {
                    click: this.#onBackMonthClickedHandler
                }, [
                    "今月"
                ]),
                h("button", {
                    class: "btn-add_month"
                }, {
                    click: this.#onAddMonthClickedHandler
                }, [
                    ">"
                ])
            ])
        ]));
    }
    #onInputChangedHandler = ()=>{
        this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(this.getValue()));
    };
    #onSubMonthClickedHandler = ()=>{
        const current = this.getValue();
        this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(CalendarDisplayOptions.from({
            year: current.year,
            month: current.month - 1
        })));
    };
    #onAddMonthClickedHandler = ()=>{
        const current = this.getValue();
        this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(CalendarDisplayOptions.from({
            year: current.year,
            month: current.month + 1
        })));
    };
    #onBackMonthClickedHandler = ()=>{
        const today = new Date(Date.now());
        this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(CalendarDisplayOptions.from({
            year: today.getFullYear(),
            month: today.getMonth() + 1
        })));
    };
    getValue() {
        return CalendarDisplayOptions.from(this.getRawValue());
    }
    getRawValue() {
        return {
            year: +this.#elems.year.value,
            month: +this.#elems.month.value
        };
    }
    update(value) {
        const raw = this.getRawValue();
        if (raw.year === value.year && raw.month === value.month) return;
        this.#elems.year.value = `${value.year}`;
        this.#elems.month.value = `${value.month}`;
        this.dispatchEvent(new CalendarDisplayOptionsChangedEvent(value));
    }
}
class Calendar {
    name;
    #eventTarget = new EventTarget();
    #value;
    constructor(name){
        this.name = name;
    }
    updateDisplay(value) {
        if (this.#value != null && value.equals(this.#value)) return;
        this.#value = value;
        this.#eventTarget.dispatchEvent(new CalendarDisplayOptionsChangedEvent(value));
    }
    addEventListener(type, listener) {
        this.#eventTarget.addEventListener(type, listener);
    }
    attach(document1) {
        const $calendarList = document1.querySelectorAll(`${CalendarElement.tagName}[name="${this.name}"]`);
        for (const $calendar of Array.from($calendarList)){
            this.connectElem($calendar);
        }
        const $displayControllerList = document1.querySelectorAll(`${CalendarDisplayControllerElement.tagName}[for="${this.name}"]`);
        for (const $controller of Array.from($displayControllerList)){
            this.connectDisplayControllerElem($controller);
        }
    }
    connectElem($calendar) {
        $calendar.addEventListener(CalendarDisplayOptionsChangedEvent.type, (_e)=>{});
        this.addEventListener(CalendarDisplayOptionsChangedEvent.type, (e)=>{
            $calendar.update(e.data);
        });
    }
    connectDisplayControllerElem($controller) {
        $controller.addEventListener(CalendarDisplayOptionsChangedEvent.type, (e)=>{
            if (e instanceof CalendarDisplayOptionsChangedEvent) this.updateDisplay(e.data);
        });
        this.addEventListener(CalendarDisplayOptionsChangedEvent.type, (e)=>{
            $controller.update(e.data);
        });
    }
}
class CalendarElement extends HTMLElement {
    static tagName = "elem-monthly_calendar";
    #elems;
    constructor(){
        super();
        this.attachShadow({
            mode: "open"
        });
        this.#elems = {
            days: h("div", {
                class: "days"
            })
        };
        this.shadowRoot?.append(h("style", {}, {}, [
            getCalendarElemStyle()
        ]), this.#elems.days);
    }
    update(options) {
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
function createCalendarDays({ year, month }) {
    const $divList = [];
    const firstDate = new Date(year, month - 1, 1);
    for(let i = 0; i < firstDate.getDay(); i++){
        $divList.push(h("div", {
            class: "day day-padding"
        }));
    }
    const today = new Date(Date.now());
    const date = new Date(firstDate.getTime());
    while(date.getFullYear() === year && date.getMonth() + 1 === month){
        const class_isToday = date.toDateString() === today.toDateString() ? "today" : "";
        const class_dayOfWeek = `dow-${getDayOfWeekStr(date.getDay())}`;
        $divList.push(h("div", {
            class: `day ${class_dayOfWeek} ${class_isToday}`
        }, {}, [
            h("p", {}, {}, [
                date.getDate()
            ])
        ]));
        date.setDate(date.getDate() + 1);
    }
    if (date.getDay() >= 1) {
        for(let i = date.getDay(); i < 7; i++){
            $divList.push(h("div", {
                class: "day day-padding"
            }));
        }
    }
    return $divList;
}
function getDayOfWeekStr(dayOfWeekIndex) {
    return [
        "sun",
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat"
    ][dayOfWeekIndex];
}
function getStyle() {
    return `
		:host > div {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			box-shadow: 0 1rem 3rem #0364;
			border-radius: 1rem;
			padding: .25rem 1rem;
		}

		:host > div > div {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}

		.buttons {
			align-items: center;

			& > button {
				background-color: white;
				border: none;
				box-shadow: 0 .25rem .75rem #0002;
				transition: .2s;
				padding: .5rem 1rem;

				&:hover {
					background-color: #6AF;
					color: white;
				}

				&.btn-add_month,
				&.btn-sub_month {
					border-radius: 100rem;
				}
	
				&.btn-back_month {
					border-radius: .5rem;
				}
			}
		}
		
		input {
			border: none;
			background-color: transparent;
			font-size: 2rem;
			text-align: right;

			&[name="year"] {
				width: 4em;
			}

			&[name="month"] {
				width: 2em;
			}
		}
	`;
}
window.customElements.define(CalendarDisplayControllerElement.tagName, CalendarDisplayControllerElement);
const calendar = new Calendar("calendar1");
calendar.attach(document);
const today = new Date();
calendar.updateDisplay(CalendarDisplayOptions.from({
    year: today.getFullYear(),
    month: today.getMonth() + 1
}));
