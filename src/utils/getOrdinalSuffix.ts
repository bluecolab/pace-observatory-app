export function getOrdinalSuffix(num: number): string {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if ([11, 12, 13].includes(lastTwoDigits)) {
        return `${num}th`; // Special case for 11th, 12th, and 13th
    }

    const suffixMap: Record<number, string> = {
        1: 'st',
        2: 'nd',
        3: 'rd',
    };

    return `${num}${suffixMap[lastDigit] || 'th'}`;
}
