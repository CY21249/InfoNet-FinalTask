import { Calendar, CalendarDisplayOptions } from "./MonthlyCalendar.ts";

const calendar = new Calendar("calendar1");
calendar.attach(document);

const today = new Date();

calendar.updateDisplay(CalendarDisplayOptions.from({
    year: today.getFullYear(),
    month: today.getMonth() + 1
}));
