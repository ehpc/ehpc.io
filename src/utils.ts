import type { Point } from "./types";

/**
 * Shuffles the elements of an array randomly.
 * @param arr The array to shuffle.
 * @returns A new array with the elements shuffled.
 */
export function shuffle<T = any>(arr: T[]): T[] {
  const arrCopy = [...arr];
  for (let i = arrCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
  }
  return arrCopy;
}

/**
 * Returns a random element from an array.
 * @param arr The array to sample from.
 * @returns A random element from the array or undefined if the array is empty.
 */
export function sampleOne<T = any, F extends readonly [T, ...T[]] = [T]>(arr: F): F[number];
export function sampleOne<T>(arr: readonly T[]): T | undefined;
export function sampleOne<T = any>(arr: readonly T[]): T | undefined {
  if (!arr || arr.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

/**
 * Returns a random integer between min and max (inclusive).
 * @param min The minimum value (inclusive).
 * @param max The maximum value (inclusive).
 * @returns A random integer between min and max.
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Reverses the bits of a 4-bit unsigned integer.
 * @param bitmask The 4-bit unsigned integer to reverse.
 * @returns The reversed 4-bit unsigned integer.
 */
export function reverse4BitsSimple(bitmask: number): number {
  bitmask &= 0b1111;
  return ((bitmask & 0b0001) << 3)
    | ((bitmask & 0b0010) << 1)
    | ((bitmask & 0b0100) >> 1)
    | ((bitmask & 0b1000) >> 3);
}

/**
 * Reverses the bits of a 4-bit unsigned integer using a compressed lookup table.
 * It works by storing lookup table inside a 64-bit int
 *  0b0000->0b000->0x0,
 *  0b0001->0b1000->0x8,
 *  0b0010->0b0100->0x4,
 *  0b0011->0b1100->0xC,
 *  0b0100->0b0010->0x2,
 *  0b0101->0b1010->0xA,
 *  0b0110->0b0110->0x6,
 *  0b0111->0b1110->0xE,
 *  0b1000->0b0001->0x1,
 *  0b1001->0b1001->0x9,
 *  0b1010->0b0101->0x5,
 *  0b1011->0b1101->0xD,
 *  0b1100->0b0011->0x3,
 *  0b1101->0b1011->0xB,
 *  0b1110->0b0111->0x7,
 *  0b1111->0b1111->0xF,
 * So the lookup table compressed into one number is f7b3d591e6a2c480
 * @param bitmask The 4-bit unsigned integer to reverse.
 * @returns The reversed 4-bit unsigned integer.
 * @example
 */
export function reverse4BitsCompressedTable(bitmask: number): number {
  bitmask &= 0b1111;
  /*

  */
  return Number((0xf7b3d591e6a2c480n >> BigInt(bitmask * 4)) & 0b1111n);
}

/**
 * Throttles a function by limiting the rate at which it can be called.
 * @param func The function to throttle.
 * @param delay The delay in milliseconds.
 * @returns A throttled version of the function.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  return function(...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      func(...args);
    }
  };
}

/**
 * Debounces a function by delaying its execution.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Flips one random bit in a 4-bit unsigned integer.
 * @param nibble The 4-bit unsigned integer to modify.
 * @returns The modified 4-bit unsigned integer with one bit flipped.
 */
export function flipOneRandomBitInsideNibble(nibble: number): number {
  const bitToFlip = Math.floor(Math.random() * 4);
  return nibble ^ (1 << bitToFlip);
}

/**
 * Maps the elements of a 2D matrix using a mapping function.
 * @param matrix The 2D matrix to map.
 * @param mapFunc The function to apply to each element.
 * @returns A new 2D matrix with mapped values.
 */
export function mapMatrixElements<T = any>(matrix: T[][], mapFunc: (value: T) => T): T[][] {
  return matrix.map(row => row.map(mapFunc));
}
