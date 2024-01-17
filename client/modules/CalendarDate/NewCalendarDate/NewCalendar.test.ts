import { NewCalendar } from "@/client/modules/CalendarDate/NewCalendarDate/NewCalendar.ts";
import { assertEquals } from "testing/asserts";

const calendar = NewCalendar.create();

Deno.test("leap_year", () => {
    assertEquals(calendar.isLeapYear(2000), true);
    assertEquals(calendar.isLeapYear(2001), false);
    assertEquals(calendar.isLeapYear(2004), true);
    assertEquals(calendar.isLeapYear(2100), false);
    assertEquals(calendar.isLeapYear(2400), true);
});

Deno.test("leap_year_huge", () => {
    const withLabel = (label: unknown, value: unknown) => `${label}: ${value}`;
    const stTime = performance.now();
    for (let year = 0; year < 10000; year++) {
        assertEquals(withLabel(year, calendar.isLeapYear(year)), withLabel(year, (
            year % 4 === 0 
                ? (year % 100 === 0
                    ? (year % 400 === 0 
                        ? true 
                        : false)
                    : true) 
                : false)));
    }
    console.log(performance.now() - stTime);
});

Deno.test("yearInfo", () => {
    assertEquals(calendar.getYearInfo(2000).monthList.length, 12);
    assertEquals(calendar.getYearInfo(2000).monthList, [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
    assertEquals(calendar.getYearInfo(2000).daysInYear, 366);
    assertEquals(calendar.getYearInfo(2001).monthList.length, 12);
    assertEquals(calendar.getYearInfo(2001).monthList, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
    assertEquals(calendar.getYearInfo(2001).daysInYear, 365);
});
