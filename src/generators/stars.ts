import type { Star } from "../types";
import { random } from "../utils";

export function generateStars(
  oldStars: Star[],
  maxStars: number,
  deltaTime: number = 0,
): Star[] {
  const stars = oldStars.slice();
  // Advance star glow
  for (const star of stars) {
    star.opacity += (deltaTime / star.glowingSpeed) * 50;
  }
  // Remove old stars
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].opacity >= 100) {
      stars.splice(i, 1);
      i--;
    }
  }
  // Add new stars
  while (stars.length < maxStars) {
    stars.push({
      x: random(133, 370),
      y: random(60, 88),
      color: `hsl(11, 84%, ${random(45, 60)}%)`,
      opacity: deltaTime === 0 ? random(0, 75) : 0,
      glowingSpeed: random(1000, 2000),
    });
  }
  return stars;
}
