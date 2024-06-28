/**
 * Remove current timezone offset of a localized date.
 *
 * @param date
 */
export default (date: Date) => new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000));
