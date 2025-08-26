use wasm_bindgen::prelude::*;

#[wasm_bindgen]
/**
 * Reverses the bits of a 4-bit unsigned integer.
 * It's the fastest implementation with low asm instructions count.
 */
pub fn reverse4bits(bitmask: u8) -> u8 {
    const LOOKUP_TABLE: [u8; 16] = [
        0x0, 0x8, 0x4, 0xc, 0x2, 0xa, 0x6, 0xe, 0x1, 0x9, 0x5, 0xd, 0x3, 0xb, 0x7, 0xf,
    ];
    return LOOKUP_TABLE[(bitmask & 0xf) as usize];
}

#[cfg(test)]
mod tests {
    use super::*;

    fn reverse4_naive(n: u8) -> u8 {
        let n = n & 0x0f;
        ((n & 0b0001) << 3) | ((n & 0b0010) << 1) | ((n & 0b0100) >> 1) | ((n & 0b1000) >> 3)
    }

    #[test]
    fn reverses_all_4bit_values_correctly() {
        for i in 0u8..16 {
            let expected = reverse4_naive(i);
            assert_eq!(reverse4bits(i), expected, "failed for {:04b}", i);
        }
    }

    #[test]
    fn double_reverse_returns_original() {
        for i in 0u8..16 {
            let out = reverse4bits(i);
            let back = reverse4bits(out);
            assert_eq!(back, i, "double reverse failed for {:04b}", i);
        }
    }

    #[test]
    fn ignores_upper_bits_beyond_low_nibble() {
        // Only the lower 4 bits should be considered for the mapping
        assert_eq!(reverse4bits(0b1_0001), 0b1000); // 0x11 -> 0x8
        assert_eq!(reverse4bits(0b1_0010), 0b0100); // 0x12 -> 0x4
        assert_eq!(reverse4bits(0b1111_1111), 0b1111); // 0xFF -> 0xF
        assert_eq!(reverse4bits(0b1_0000), 0b0000); // 0x10 -> 0x0
    }
}
