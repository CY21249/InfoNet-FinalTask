export class NewCalendar {
    static #instance?: NewCalendar;

    private constructor() {}

    static create() {
        if (this.#instance != null)
            return this.#instance;
        return this.#instance = new NewCalendar();
    }

    getYearInfo(year: number) {
        const basicMonthList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const monthList = (this.isLeapYear(year))
            ? [...basicMonthList.slice(0, 1), basicMonthList[1] + 1, ...basicMonthList.slice(2)]
            : basicMonthList;
            
        return { daysInYear: monthList.reduce((p, v) => p + v, 0), monthList };
    }
    isLeapYear(year: number) {
        return ((year % 4) === 0 && year % 100 !== 0) || year % 400 === 0;
    }
}