export const dateUtils = new class DateUtils {

    readonly weekDays = [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    ]

    readonly dateFormats = {
        ymd: 'YYYY-MM-DD',
        m: 'MMMM',
        d: 'ddd',
        ms: 'x',
    }

    readonly dayMillisecond = 86400000;


}