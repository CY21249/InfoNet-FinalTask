import { Temporal } from "@js-temporal";

const chineseCalendar = new Temporal.Calendar("chinese");

const date = Temporal.PlainDate.from({
    year: 2023,
    month: 4,
    day: 1,
}).withCalendar(chineseCalendar);
console.log(date);
debugger;

const yearMonthInfo = [
    [2023, {
        daysInYear: 365, //?
        months: [
            { month: 1, isLeapMonth: false, daysInMonth: 30 },
            { month: 2, isLeapMonth: false, daysInMonth: 29 },
            { month: 2, isLeapMonth: true, daysInMonth: 29 },   // メリット: 一番丁寧, デメリット: isLeapMonth, month: n 等が冗長 -> daysInMonth も冗長 / ほとんどの暦で閏月はない
            { month: 3, isLeapMonth: false, daysInMonth: 30 },
        ]
    }],
    [2023, {
        daysInYear: 365,
        months: [
            { month: 1, daysInMonth: 30 },
            { month: 2, daysInMonth: 29 },
            { month: 2, daysInMonth: 29 }, // メリット: 2回続けばうるう月, デメリット: month は普通1づつ増えていくからほとんどの場合明確で冗長 / 不親切
            { month: 3, daysInMonth: 30 },
        ]
    }],
    [2023, {
        daysInYear: 365,
        daysInMonths: [30, 29, 30, 29, ...[], 30, { leapMonth: 2, daysInMonth: 29 }] // メリット: 単純, デメリット：daysInMonths の型が複数
    }],
    [2023, {
        daysInYear: 365,
        daysInMonths: [30, 29, 30, 29, ...[], 30],
        leapMonths: [2]    // 多分一番シンプル，不親切 (前から見ていく時毎回 leapMonth を気にしないといけない)，閏月で日数が変わるときがあったらどうするのか
    }],
    [2023, {
        daysInYear: 365,
        daysInMonths: [30, 29, 29, 30, 29, ...[], 30], // 多くの暦で普通 (ぱっと見ただの13か月の暦)
        leapMonths: [2]    // 前から見ていって今何月かわからない
    }]

]