/**
* File transpiled from TypeScript and bundled 
* - at 2023/12/28 22:43:48
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
const $calendarDisplayOptions = document.querySelector("#calendarDisplayOptions");
const $calendarDisplayOptionElems = {
    year: $calendarDisplayOptions.querySelector(`[name="year"]`),
    month: $calendarDisplayOptions.querySelector(`[name="month"]`)
};
if ($calendarDisplayOptions == null) throw new Error("Element #calendarDisplayOptions does not exist.");
const $calendar = document.querySelector("#calendar");
const $calendarDays = $calendar?.querySelector(".days");
if ($calendar == null || $calendarDays == null) throw new Error("Element #calendar or #calendar .days does not exist.");
for (const $elem of [
    $calendarDisplayOptionElems.year,
    $calendarDisplayOptionElems.month
]){
    $elem.addEventListener("change", (_e)=>{
        changeCalendarDisplay(getCalendarDisplayOptions());
    });
}
setCalendarDisplayOptions({
    year: 2024,
    month: 1
});
function getCalendarDisplayOptions() {
    return {
        year: +$calendarDisplayOptionElems.year.value,
        month: +$calendarDisplayOptionElems.month.value
    };
}
function setCalendarDisplayOptions({ year, month }) {
    $calendarDisplayOptionElems.year.value = `${year}`, $calendarDisplayOptionElems.month.value = `${month}`;
}
function changeCalendarDisplay(options) {
    $calendarDays.innerHTML = "";
    $calendarDays.append(...createCalendarDays(options));
}
function createCalendarDays({ year, month }) {
    const $divList = [];
    const firstDate = new Date(year, month - 1, 1);
    for(let i = 0; i < firstDate.getDay(); i++){
        $divList.push(html`<div class="day day-padding"></div>`[0]);
    }
    const date = new Date(firstDate.getTime());
    while(date.getFullYear() === year && date.getMonth() + 1 === month){
        $divList.push(html`<div class="day">
                <p>${date.getDate()}</p>
            </div>`[0]);
        date.setDate(date.getDate() + 1);
    }
    return $divList;
}
