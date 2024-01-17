import { Calendar, CalendarDisplayOptions } from "./MonthlyCalendar.ts";

const calendar = new Calendar("calendar1");
calendar.attach(document);

const today = new Date();

const nextMonth = new Date(
    new Date(today).setMonth(today.getMonth() + 1)
);
nextMonth.setDate(1);

calendar.updateDisplay(CalendarDisplayOptions.from({
    year: nextMonth.getFullYear(),
    month: nextMonth.getMonth() + 1
}));