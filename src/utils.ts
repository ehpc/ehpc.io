export function shuffle<T = any>(arr: T[]): T[] {
  const arrCopy = [...arr];
  for (let i = arrCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
  }
  return arrCopy;
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function reverse4Bits(bitmask: number): number {
  bitmask &= 0b1111;
  return ((bitmask & 0b0001) << 3)
    | ((bitmask & 0b0010) << 1)
    | ((bitmask & 0b0100) >> 1)
    | ((bitmask & 0b1000) >> 3);
}
