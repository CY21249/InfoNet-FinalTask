import { CalendarDate } from "@/client/modules/CalendarDate/CalendarDate.ts";

export type YMDRaw = {
    readonly year: number;
    readonly month: number;
    readonly day: number;
};

export type YearInfo = {
    readonly year: number;
    // readonly isLeap: boolean; // always false
    readonly days: number;
    // readonly hasLeap: boolean;
    readonly months: MonthInfo[];
};

export type MonthInfo = {
    readonly year: number;
    readonly month: number;
    readonly isLeap: boolean;
    // readonly hasLeap: boolean;
    readonly days: number;
};

export interface Calendar {
    readonly baseYear: number;
    getYearInfo(year: number): YearInfo;
};

export function fromDaysValue(daysValue: number, calendar: Calendar) {
    const { baseYear } = calendar;

    let daysSum = 0;
    let year;
    for (year = baseYear; true; year++) {
        const { days: daysInYear, months } = calendar.getYearInfo(year);
        if (daysSum + daysInYear > daysSum)
            break;
        
    }
}