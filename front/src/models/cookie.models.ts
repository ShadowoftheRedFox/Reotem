export enum CookieTime {
    Second = 1,
    Minute = 60,
    Hour = 3600,
    Day = 3600 * 24,
    Week = 3600 * 24 * 7,
    Month = 3600 * 24 * 31,
    Year = 3600 * 24 * 365,
}

export const CookieConsentName = "meetingCookieConsent";

export function CookieTimeToMs(time: keyof typeof CookieTime) {
    switch (time) {
        case "Second":
            return CookieTime.Second.valueOf();
        case "Minute":
            return CookieTime.Minute.valueOf();
        case "Hour":
            return CookieTime.Hour.valueOf();
        case "Day":
            return CookieTime.Day.valueOf();
        case "Week":
            return CookieTime.Week.valueOf();
        case "Month":
            return CookieTime.Month.valueOf();
        case "Year":
            return CookieTime.Year.valueOf();
        default:
            return 0
    }
}
