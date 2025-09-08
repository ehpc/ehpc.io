import type { CatTail, Point } from "../types";

export function generateCatTail(
  tail?: CatTail,
  deltaTime: number = 0,
): CatTail {
  const tailFrames: Point[][] = [
    [[0, 2], [2, 3], [3, 2], [7, 0], [2, -1]],
    [[0, 2], [2, 3], [3, 2], [5, 2], [2, -1]],
    [[0, 2], [2, 3], [2, 3], [5, 2], [2, -1]],
    [[0, 2], [2, 3], [2, 3], [4, 3], [3, 0]],
    [[0, 2], [2, 3], [2, 3], [3, 3], [3, 1]],
    [[0, 2], [1, 3], [1, 4], [3, 3], [2, 1]],
    [[0, 2], [1, 3], [1, 4], [1, 4], [1, 1]],
    [[0, 2], [0, 3], [0, 4], [1, 4], [1, 1]],
    [[0, 2], [0, 3], [0, 4], [0, 5], [0, 1]],

  ];

  if (!tail) {
    return {
      currentFrame: 0,
      points: tailFrames[0],
      elapsed: 0,
      frameDuration: 42,
    };
  }

  tail.elapsed += deltaTime;
  if (tail.elapsed >= tail.frameDuration) {
    tail.elapsed = 0;
    tail.currentFrame++;
    if (tail.currentFrame >= tailFrames.length) {
      tail.currentFrame = 0;
    }
    tail.points = tailFrames[tail.currentFrame];
  }

  return tail;
}
