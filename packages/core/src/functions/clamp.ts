/**
 * Limits the number between minimum and maximum.
 *
 * @param value The number to limit.
 * @param lower The minimum number.
 * @param upper Maximum number.
 *
 * @returns Limited number
 */
export const clamp = (value: number, lower: number, upper: number) =>
  Math.max(Math.min(value, upper), lower)
