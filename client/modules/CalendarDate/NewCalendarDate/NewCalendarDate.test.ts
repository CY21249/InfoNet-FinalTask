import { assertEquals } from "testing/asserts";
import { NewCalendarDate } from "@/client/modules/CalendarDate/NewCalendarDate/NewCalendarDate.ts";

Deno.test("daysValue", () => {
    assertEquals(NewCalendarDate.from({ year: 1, month: 1, day: 1 }).daysValue, 1);
    assertEquals(NewCalendarDate.from({ year: 1, month: 12, day: 31 }).daysValue, 365);
    assertEquals(NewCalendarDate.from({ year: 2, month: 1, day: 1 }).daysValue, 365 + 1);
    assertEquals(NewCalendarDate.from({ year: 3, month: 12, day: 31 }).daysValue, 365 * 3);
    assertEquals(NewCalendarDate.from({ year: 4, month: 1, day: 1 }).daysValue, 365 * 3 + 1);
    assertEquals(NewCalendarDate.from({ year: 5, month: 1, day: 1 }).daysValue, (365 * 4 + 1) + 1);
});

Deno.test("fromDaysValue", () => {
    assertEquals(NewCalendarDate.fromDaysValue(1), NewCalendarDate.from({ year: 1, month: 1, day: 1 }));
    assertEquals(NewCalendarDate.fromDaysValue(365), NewCalendarDate.from({ year: 1, month: 12, day: 31 }));
    assertEquals(NewCalendarDate.fromDaysValue(365 + 1), NewCalendarDate.from({ year: 2, month: 1, day: 1 }));
    assertEquals(NewCalendarDate.fromDaysValue(365 * 3), NewCalendarDate.from({ year: 3, month: 12, day: 31 }));
    assertEquals(NewCalendarDate.fromDaysValue(365 * 3 + 1), NewCalendarDate.from({ year: 4, month: 1, day: 1 }));
    assertEquals(NewCalendarDate.fromDaysValue((365 + 4 + 1) + 1), NewCalendarDate.from({ year: 4, month:51, day: 1 }));
});