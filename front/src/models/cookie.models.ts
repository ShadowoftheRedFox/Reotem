export enum CookieTime {
    Second = 1,
    Seconde = 1,
    Minute = 60,
    Hour = 3600,
    Heure = 3600,
    Day = 3600 * 24,
    Jour = 3600 * 24,
    Week = 3600 * 24 * 7,
    Semaine = 3600 * 24 * 7,
    Month = 3600 * 24 * 31,
    Mois = 3600 * 24 * 31,
    Year = 3600 * 24 * 365,
    Année = 3600 * 24 * 365,
}

export const CookieConsentName = "meetingCookieConsent";

export function CookieTimeToMs(time: keyof typeof CookieTime) {
    switch (time) {
        case "Second":
        case "Seconde":
            return CookieTime.Second.valueOf();
        case "Minute":
            return CookieTime.Minute.valueOf();
        case "Hour":
        case "Heure":
            return CookieTime.Hour.valueOf();
        case "Day":
        case "Jour":
            return CookieTime.Day.valueOf();
        case "Week":
        case "Semaine":
            return CookieTime.Week.valueOf();
        case "Month":
        case "Mois":
            return CookieTime.Month.valueOf();
        case "Year":
        case "Année":
            return CookieTime.Year.valueOf();
        default:
            return 0
    }
}
