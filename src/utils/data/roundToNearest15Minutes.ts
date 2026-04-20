/**
 * Rounds a timestamp to the nearest 15-minute interval
 * @param timestamp - ISO 8601 timestamp string
 * @returns Rounded timestamp string
 */
export const roundToNearest15Minutes = (timestamp: string): string => {
    const date = new Date(timestamp);
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;

    date.setMinutes(roundedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
};
