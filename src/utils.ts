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

/**
 * This one is funny :) And generates less asm instructions.
 */
export function reverse4BitsHacky(bitmask: number): number {
  bitmask &= 0b1111;
  /*
    It works by storing lookup table inside a 64-bit int
    0b0000->0b000->0x0,
    0b0001->0b1000->0x8,
    0b0010->0b0100->0x4,
    0b0011->0b1100->0xC,
    0b0100->0b0010->0x2,
    0b0101->0b1010->0xA,
    0b0110->0b0110->0x6,
    0b0111->0b1110->0xE,
    0b1000->0b0001->0x1,
    0b1001->0b1001->0x9,
    0b1010->0b0101->0x5,
    0b1011->0b1101->0xD,
    0b1100->0b0011->0x3,
    0b1101->0b1011->0xB,
    0b1110->0b0111->0x7,
    0b1111->0b1111->0xF,
    So the lookup table compressed into one number is f7b3d591e6a2c480
  */
  return Number((0xf7b3d591e6a2c480n >> BigInt(bitmask * 4)) & 0b1111n);
}
