/**
* File transpiled from TypeScript and bundled 
* - at 2023/12/28 20:39:01
* - file: ./client/calendar/script.ts -> ./static/calendar/script.js
* - using: https://deno.land/x/emit@0.32.0/mod.ts
*/
function html(bases, ...args) {
    const idPrefix = "__html-template_will-be-replaced-slot__";
    let htmlElemStr = "";
    for(let i = 0; i < bases.length; i++){
        htmlElemStr += bases[i];
        if (i < args.length) htmlElemStr += `<div id="${idPrefix}${i}"></div>`;
    }
    const $element = _createElement(htmlElemStr);
    for(let i = 0; i < args.length; i++){
        const arg = args[i];
        const $elem = arg instanceof HTMLElement ? arg : _createElement(arg);
        $element.querySelector(`#${idPrefix}${i}`).replaceWith($elem);
    }
    return Array.from($element.children);
}
function _createElement(value) {
    return new DOMParser().parseFromString(`
        <!DOCTYPE html>
        <head></head>
        <body>
            ${value}
        </body>
    `, "text/html").body;
}
class MonthlyCalendarOptions {
    static #instances = new Map();
    #listeners = new Set();
    #view;
    #value;
    constructor(view){
        this.#view = view;
        this.#view.setModel(this);
        this.update(new MonthlyCalendarOptionsValue({
            year: 2024,
            month: 1
        }));
    }
    static byAttached(document1) {
        const view = document1.querySelector(`${MonthlyCalendarOptionsElement.tagName}#monthlyCalendarOptions`);
        if (view == null) throw new Error(`CalendarOptions (${MonthlyCalendarOptionsElement.tagName}#monthlyCalendarOptions) の要素が見つかりません`);
        const instance = this.#instances.get(view);
        if (instance != null) return instance;
        const newInstance = new this(view);
        this.#instances.set(view, newInstance);
        return newInstance;
    }
    update(value) {
        if (this.#value?.equals(value)) return;
        this.#view.update(value);
        this.#dispatchEvent({
            value
        });
    }
    #dispatchEvent(event) {
        for (const listener of this.#listeners)listener(event);
    }
    addListener(fn) {
        this.#listeners.add(fn);
    }
}
class MonthlyCalendarOptionsValue {
    year;
    month;
    constructor({ year, month }){
        this.year = year;
        this.month = month;
    }
    equals(other) {
        return other.year === this.year && other.month === this.month;
    }
}
class MonthlyCalendarOptionsElement extends HTMLElement {
    static tagName = "elem-monthly-calendar-options";
    id = "calendarOptions";
    #$shadow;
    #$elems;
    #model;
    constructor(){
        super();
        this.#$shadow = this.attachShadow({
            mode: "open"
        });
        this.#$elems = {
            year: html`<input name="year" type="number">`[0],
            month: html`<input name="month" type="number">`[0]
        };
        this.#$shadow.append(...html`
            <div>
                ${this.#$elems.year}
                <label for="year">年</label>
            </div>
            <div>
                ${this.#$elems.month}
                <label for="year">月</label>
            </div>
        `);
        this.#$elems.year.addEventListener("change", (_e)=>{
            this.#model?.update(this.getValue());
        });
        this.#$elems.month.addEventListener("change", (_e)=>this.#model?.update(this.getValue()));
    }
    setModel(model) {
        this.#model = model;
    }
    getValue() {
        return new MonthlyCalendarOptionsValue({
            year: +this.#$elems.year.value,
            month: +this.#$elems.month.value
        });
    }
    update(value) {
        if (this.getValue().equals(value)) return;
        this.#$elems.year.value = `${value.year}`;
        this.#$elems.month.value = `${value.month}`;
    }
}
window.customElements.define(MonthlyCalendarOptionsElement.tagName, MonthlyCalendarOptionsElement);
const calendarOptions = MonthlyCalendarOptions.byAttached(document);
calendarOptions.addListener((value)=>{
    console.log(value);
});
