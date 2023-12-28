/**
* File transpiled from TypeScript and bundled 
* - at 2023/12/28 23:10:20
* - file: ./client/calendar/script.ts -> ./static/calendar/script.js
* - using: https://deno.land/x/emit@0.32.0/mod.ts
*/
function html(bases, ...args) {
    const idPrefix = "__html-template_will-be-replaced-slot__";
    let htmlElemStr = "";
    const elems = [];
    for(let i = 0; i < bases.length; i++){
        htmlElemStr += bases[i];
        const arg = args[i];
        if (arg === undefined) continue;
        if (arg instanceof HTMLElement) {
            htmlElemStr += `<div id="${idPrefix}${elems.length}"></div>`;
            elems.push(arg);
        } else htmlElemStr += arg;
    }
    const $element = _createElement(htmlElemStr);
    for(let i = 0; i < elems.length; i++){
        const elem = elems[i];
        $element.querySelector(`#${idPrefix}${i}`).replaceWith(elem);
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
changeCalendarDisplay({
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
        $divList.push(html`<div class="day dow-${getDayOfWeekStr(date.getDay())}">
                <p>${date.getDate()}</p>
            </div>`[0]);
        date.setDate(date.getDate() + 1);
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
