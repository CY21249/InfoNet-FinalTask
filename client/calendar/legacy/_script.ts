import { html } from "../../modules/HTML.ts";

type CalendarDisplayOptions= {
    year: number;
    month: number;
};

const $calendarDisplayOptions = document.querySelector("#calendarDisplayOptions")!;
const $calendarDisplayOptionElems = {
    year: $calendarDisplayOptions.querySelector(`[name="year"]`) as HTMLInputElement,
    month: $calendarDisplayOptions.querySelector(`[name="month"]`) as HTMLInputElement
};
if ($calendarDisplayOptions == null)
    throw new Error("Element #calendarDisplayOptions does not exist.");

const $calendar = document.querySelector("#calendar")!;
const $calendarDays = $calendar?.querySelector(".days")!;
if ($calendar == null || $calendarDays == null)
    throw new Error("Element #calendar or #calendar .days does not exist.");

for (const $elem of [$calendarDisplayOptionElems.year, $calendarDisplayOptionElems.month]) {
    $elem.addEventListener("change", _e => {
        changeCalendarDisplay(getCalendarDisplayOptions());
    });
}

setCalendarDisplayOptions({ year: 2024, month: 1 });
changeCalendarDisplay({ year: 2024, month: 1 });

function getCalendarDisplayOptions() {
    return {
        year: +$calendarDisplayOptionElems.year.value,
        month: +$calendarDisplayOptionElems.month.value
    };
}

function setCalendarDisplayOptions({ year, month }: CalendarDisplayOptions) {
    $calendarDisplayOptionElems.year.value = `${year}`,
    $calendarDisplayOptionElems.month.value = `${month}`;
}

function changeCalendarDisplay(options: CalendarDisplayOptions) {
    $calendarDays.innerHTML = "";
    $calendarDays.append(...createCalendarDays(options));
}

function createCalendarDays({ year, month }: CalendarDisplayOptions) {
    const $divList = [];

    const firstDate = new Date(year, month - 1, 1);
    for (let i = 0; i < firstDate.getDay(); i++) {
        $divList.push(
            html`<div class="day day-padding"></div>`[0]
        );
    }

    const date = new Date(firstDate.getTime());
    while (date.getFullYear() === year && date.getMonth() + 1 === month) {
        $divList.push(
            html`<div class="day dow-${getDayOfWeekStr(date.getDay())}">
                <p>${date.getDate()}</p>
            </div>`[0]
        );
        date.setDate(date.getDate() + 1);
    }
    return $divList;
}

function getDayOfWeekStr(dayOfWeekIndex: number) {
    return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][dayOfWeekIndex];
}