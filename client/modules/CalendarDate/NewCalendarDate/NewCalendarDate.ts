import { NewCalendar } from "@/client/modules/CalendarDate/NewCalendarDate/NewCalendar.ts";

const daysInY1 = 365;
const daysInY4 = daysInY1 * 4 + (4 / 4) * 1; // 4年に1日増える (n年にm日増えるとき、x年には (x/n)*m 日増える)
const daysInY100 = daysInY4 * (100 / 4) * 1 - (100 / 100) * 1;  // {4年間の日数} × (100 / 4) = {4の倍数のみ考えたときの日数}, 100年に1回の閏年は閏年でないから - 1
const daysInY400 = daysInY100 * (400 / 100) * 1 + (400 / 400) * 1; //〃、400年に1回の閏年でない閏年のはずだった年は閏年になるから + 1

const { floor: fl } = Math;

interface INewCalendarDate {
    readonly year: number;
    readonly month: number;
    readonly day: number;

    readonly daysValue: number;
}

export class NewCalendarDate implements INewCalendarDate {
    static readonly daysValueBaseYear = 0;
    static readonly calendar = NewCalendar.create();

    readonly year: number;
    readonly month: number;
    readonly day: number;

    get daysValue() {
        const y = this.year - 1;
        const y400 = fl(y / 400),
            y100 = fl((y % 400) / 100),
            y4 = fl((y % 100) / 4),
            y1 = (y % 4);
        const daysInYears = daysInY400 * y400 + daysInY100 * y100 + daysInY4 * y4 + daysInY1 * y1;
        
        const monthList = NewCalendarDate.calendar.getYearInfo(this.year).monthList,
            monthListUntilThis = monthList.slice(0, this.month - 1);
        const daysInMonths = monthListUntilThis.reduce((p, v) => p + v, 0);
        
        return daysInYears + daysInMonths + this.day;
    }

    constructor({ year, month, day }: { year: number; month: number; day: number }) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    static fromDaysValue(daysValue: number) {
        let daysSum = 0;
        let y400;
        for (y400 = 0; ; y400++) {
            if (daysSum + daysInY400 >= daysValue) // イコールだった時 (例: 800年12月31日，800年1月1日と同じく扱う(それより小さいものと同じく y400=2 をスキップし y400=1に ==> "="を入れる))
                break;
            daysSum += daysInY400;
        }
        let y100;
        for (y100 = 0; ; y100++) {
            if (daysSum + daysInY100 >= daysValue)
                break;
            daysSum += daysInY100;
        }
        let y4;
        for (y4 = 0; ; y4++) {
            if (daysSum + daysInY4 >= daysValue)
                break;
            daysSum += daysInY4;
        }
        let y1;
        for (y1 = 0; ; y1++) {
            if (daysSum + daysInY1 >= daysValue)
                break;
            daysSum += daysInY1;
        }
        const year = y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1;

        const yearInfo = this.calendar.getYearInfo(year);
        let month;
        for (const [monthIndex, monthInfo] of yearInfo.monthList.entries()) {
            if (daysSum + monthInfo >= daysValue) {
                month = monthIndex + 1;
                break;
            }
        }
        if (month == null)
            throw new Error("monthInfo is not proper");

        const day = daysValue - daysSum;

        return this.from({ year, month, day });
    }

    static from({ year, month, day }: { year: number; month: number; day: number; }) {
        return new this({ year, month, day });
    }
}

