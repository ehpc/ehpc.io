import type { CatTail, Point } from "../types";
import { mapMatrixElements, random } from "../utils";

export function generateCatTail(
  tail?: CatTail,
  deltaTime: number = 0,
): CatTail {
  let tailFrames: Point[][] = [
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
  const baseFramesCount = tailFrames.length;
  const negatedFrames = mapMatrixElements<Point>(tailFrames.slice(0, -1), ([x, y]) => [-x, y]);
  tailFrames = tailFrames.concat(negatedFrames.reverse());

  if (!tail) {
    return {
      currentFrame: 0,
      points: tailFrames[0],
      elapsed: 0,
      fullSwingDuration: 1500,
      animationDirection: 1,
    };
  }

  tail.elapsed += deltaTime;
  const frameDuration = tail.fullSwingDuration / (tailFrames.length * 2 - 1);

  if (tail.elapsed >= frameDuration) {
    tail.elapsed = 0;
    tail.currentFrame = Math.min(tailFrames.length - 1, Math.max(0, tail.currentFrame + tail.animationDirection));
    if (tail.currentFrame === tailFrames.length - 1) {
      tail.animationDirection = -1;
    } else if (tail.currentFrame === 0) {
      tail.animationDirection = 1;
    }

    if (Math.random() < 0.05) {
      const { currentFrame, animationDirection } = tail;
      if (
        (animationDirection === 1 && currentFrame > baseFramesCount + 3)
        || (animationDirection === -1 && currentFrame < baseFramesCount - 4)
      ) {
        tail.animationDirection *= -1;
      }
    }

    if (Math.random() < 0.1) {
      tail.fullSwingDuration = random(1000, 2000);
    }
  }

  tail.points = tailFrames[tail.currentFrame];

  return tail;
}
