/**
 * Remove current timezone offset of a localized date.
 *
 * @param date
 */
export default function removeTimezoneOffset(date: Date) {
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - (offset * 60 * 1000));
}
