/**
 * Limits a number to either it's minimum or maximum if it goes beyond it.
 */
export const limitRange = (min: number, max: number, value: number) => {
    if (value < min) return max;
    if (value > max) return min;
    return value;
}