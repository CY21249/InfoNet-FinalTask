
type CalendarDateArgs = {
    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly dayOfWeek: number;
    readonly dayCount: number;
};

export abstract class CalendarDate {
    static readonly calendarInfo: {
        readonly baseYear: number;
        getDaysInYear(year: number): number;
        getMonthInfoListOfYear(year: number): { month: number; isLeapMonth: boolean; daysInMonth: number; }[];
    };

    readonly year: number;
    readonly month: number;
    readonly day: number;
    readonly dayOfWeek: number;
    readonly daysValue: number;

    constructor({ year, month, day, dayOfWeek, dayCount }: CalendarDateArgs) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.dayOfWeek = dayOfWeek;
        this.daysValue = dayCount;
    }

    protected static fromDaysValue(dayCount: number) {
        const startYear = this.calendarInfo.baseYear;
        let dayCountSum = 0;
        let year;
        for (year = startYear; true; year++) {
            const dayCountOfYear = this.calendarInfo.getDaysInYear(year);
            if (dayCountSum + dayCountOfYear > dayCount)
                break;
            dayCountSum += dayCountOfYear;
        }

        const monthInfoList = this.calendarInfo.getMonthInfoListOfYear(year);
        for (const monthInfo of monthInfoList) {
            if (dayCountSum + monthInfo.dayCount > dayCount) {
                return new this({
                    year,
                    month: monthInfo.month,
                    monthInfo: { isLeapMonth: monthInfo.isLeapMonth },

                });
            }
            dayCountSum += monthInfo.dayCount;
        }  

    }
}