import { describe, expect, it } from "vitest";
import { random, reverse4BitsCompressedTable, reverse4BitsSimple, shuffle } from "./utils";

describe("utils", () => {
  describe("shuffle", () => {
    it("should return an array with the same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(result).toHaveLength(input.length);
    });

    it("should not modify the original array", () => {
      const input = [1, 2, 3, 4, 5];
      const original = [...input];
      shuffle(input);
      expect(input).toEqual(original);
    });

    it("should contain all the same elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);
      expect(result.sort()).toEqual(input.sort());
    });

    it("should handle empty array", () => {
      const result = shuffle([]);
      expect(result).toEqual([]);
    });

    it("should handle single element array", () => {
      const input = [42];
      const result = shuffle(input);
      expect(result).toEqual([42]);
    });

    it("should work with different types", () => {
      const input = ["a", "b", "c"];
      const result = shuffle(input);
      expect(result).toHaveLength(3);
      expect(result.sort()).toEqual(["a", "b", "c"]);
    });

    it("should produce different results on multiple calls (statistically)", () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result1 = shuffle(input);
      const result2 = shuffle(input);
      // Very unlikely to be identical for a 10-element array
      expect(result1).not.toEqual(result2);
    });
  });

  describe("random", () => {
    it("should return a number within the specified range (inclusive)", () => {
      for (let i = 0; i < 100; i++) {
        const result = random(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it("should return the same number when min equals max", () => {
      expect(random(5, 5)).toBe(5);
    });

    it("should work with negative numbers", () => {
      for (let i = 0; i < 100; i++) {
        const result = random(-10, -5);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-5);
      }
    });

    it("should work with mixed negative and positive", () => {
      for (let i = 0; i < 100; i++) {
        const result = random(-5, 5);
        expect(result).toBeGreaterThanOrEqual(-5);
        expect(result).toBeLessThanOrEqual(5);
      }
    });

    it("should produce different values over multiple calls", () => {
      const results = new Set();
      for (let i = 0; i < 50; i++) {
        results.add(random(1, 100));
      }
      // Should have some variety (at least 10 different values in 50 calls)
      expect(results.size).toBeGreaterThan(10);
    });
  });

  describe("reverse4BitsSimple", () => {
    it("should reverse 4-bit patterns correctly", () => {
      // 0b0000 -> 0b0000
      expect(reverse4BitsSimple(0b0000)).toBe(0b0000);

      // 0b0001 -> 0b1000
      expect(reverse4BitsSimple(0b0001)).toBe(0b1000);

      // 0b0010 -> 0b0100
      expect(reverse4BitsSimple(0b0010)).toBe(0b0100);

      // 0b0011 -> 0b1100
      expect(reverse4BitsSimple(0b0011)).toBe(0b1100);

      // 0b0100 -> 0b0010
      expect(reverse4BitsSimple(0b0100)).toBe(0b0010);

      // 0b0101 -> 0b1010
      expect(reverse4BitsSimple(0b0101)).toBe(0b1010);

      // 0b0110 -> 0b0110 (palindrome)
      expect(reverse4BitsSimple(0b0110)).toBe(0b0110);

      // 0b0111 -> 0b1110
      expect(reverse4BitsSimple(0b0111)).toBe(0b1110);

      // 0b1000 -> 0b0001
      expect(reverse4BitsSimple(0b1000)).toBe(0b0001);

      // 0b1001 -> 0b1001 (palindrome)
      expect(reverse4BitsSimple(0b1001)).toBe(0b1001);

      // 0b1010 -> 0b0101
      expect(reverse4BitsSimple(0b1010)).toBe(0b0101);

      // 0b1011 -> 0b1101
      expect(reverse4BitsSimple(0b1011)).toBe(0b1101);

      // 0b1100 -> 0b0011
      expect(reverse4BitsSimple(0b1100)).toBe(0b0011);

      // 0b1101 -> 0b1011
      expect(reverse4BitsSimple(0b1101)).toBe(0b1011);

      // 0b1110 -> 0b0111
      expect(reverse4BitsSimple(0b1110)).toBe(0b0111);

      // 0b1111 -> 0b1111 (palindrome)
      expect(reverse4BitsSimple(0b1111)).toBe(0b1111);
    });

    it("should only consider the lower 4 bits", () => {
      // Testing with numbers that have bits set beyond the 4th bit
      expect(reverse4BitsSimple(0b10001)).toBe(0b1000); // Should ignore the 5th bit
      expect(reverse4BitsSimple(0b11110)).toBe(0b0111); // Should only reverse lower 4 bits
    });

    it("should be its own inverse for all 4-bit values", () => {
      for (let i = 0; i < 16; i++) {
        const reversed = reverse4BitsSimple(i);
        const doubleReversed = reverse4BitsSimple(reversed);
        expect(doubleReversed).toBe(i);
      }
    });
  });

  describe("reverse4BitsCompressedTable", () => {
    it("should reverse 4-bit patterns correctly", () => {
      // 0b0000 -> 0b0000
      expect(reverse4BitsCompressedTable(0b0000)).toBe(0b0000);

      // 0b0001 -> 0b1000
      expect(reverse4BitsCompressedTable(0b0001)).toBe(0b1000);

      // 0b0010 -> 0b0100
      expect(reverse4BitsCompressedTable(0b0010)).toBe(0b0100);

      // 0b0011 -> 0b1100
      expect(reverse4BitsCompressedTable(0b0011)).toBe(0b1100);

      // 0b0100 -> 0b0010
      expect(reverse4BitsCompressedTable(0b0100)).toBe(0b0010);

      // 0b0101 -> 0b1010
      expect(reverse4BitsCompressedTable(0b0101)).toBe(0b1010);

      // 0b0110 -> 0b0110 (palindrome)
      expect(reverse4BitsCompressedTable(0b0110)).toBe(0b0110);

      // 0b0111 -> 0b1110
      expect(reverse4BitsCompressedTable(0b0111)).toBe(0b1110);

      // 0b1000 -> 0b0001
      expect(reverse4BitsCompressedTable(0b1000)).toBe(0b0001);

      // 0b1001 -> 0b1001 (palindrome)
      expect(reverse4BitsCompressedTable(0b1001)).toBe(0b1001);

      // 0b1010 -> 0b0101
      expect(reverse4BitsCompressedTable(0b1010)).toBe(0b0101);

      // 0b1011 -> 0b1101
      expect(reverse4BitsCompressedTable(0b1011)).toBe(0b1101);

      // 0b1100 -> 0b0011
      expect(reverse4BitsCompressedTable(0b1100)).toBe(0b0011);

      // 0b1101 -> 0b1011
      expect(reverse4BitsCompressedTable(0b1101)).toBe(0b1011);

      // 0b1110 -> 0b0111
      expect(reverse4BitsCompressedTable(0b1110)).toBe(0b0111);

      // 0b1111 -> 0b1111 (palindrome)
      expect(reverse4BitsCompressedTable(0b1111)).toBe(0b1111);
    });

    it("should only consider the lower 4 bits", () => {
      // Testing with numbers that have bits set beyond the 4th bit
      expect(reverse4BitsCompressedTable(0b10001)).toBe(0b1000); // Should ignore the 5th bit
      expect(reverse4BitsCompressedTable(0b11110)).toBe(0b0111); // Should only reverse lower 4 bits
    });

    it("should be its own inverse for all 4-bit values", () => {
      for (let i = 0; i < 16; i++) {
        const reversed = reverse4BitsCompressedTable(i);
        const doubleReversed = reverse4BitsCompressedTable(reversed);
        expect(doubleReversed).toBe(i);
      }
    });

    it("should produce the same results as reverse4BitsSimple", () => {
      // Both functions should be equivalent
      for (let i = 0; i < 16; i++) {
        expect(reverse4BitsCompressedTable(i)).toBe(reverse4BitsSimple(i));
      }
    });
  });
});
