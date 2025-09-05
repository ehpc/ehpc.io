import type { ServerBoxText } from "../types";

export function generateServerBoxTexts(
  serverBoxTexts?: ServerBoxText[],
  deltaTime: number = 0,
): ServerBoxText[] {
  if (!serverBoxTexts) {
    return [
      {
        text: "CV",
        x: 369,
        y: 263,
        size: 36,
      },
      {
        text: "git",
        x: 368,
        y: 165,
        size: 13,
      },
      {
        text: "hub",
        x: 368,
        y: 177,
        size: 13,
      },
    ];
  }

  for (const serverBoxText of serverBoxTexts) {
    if (!serverBoxText.shift) continue;
    serverBoxText.shift.elapsed += deltaTime;
    if (serverBoxText.shift.elapsed > serverBoxText.shift.frequency) {
      if (serverBoxText.shift.currentShift >= serverBoxText.shift.x) {
        serverBoxText.shift.currentShift = 0;
        serverBoxText.shift.elapsed = 0;
      } else {
        serverBoxText.shift.currentShift = Math.min(
          serverBoxText.x,
          serverBoxText.shift.currentShift + (serverBoxText.shift.speed * deltaTime) / 1000,
        );
      }
    }
  }

  return serverBoxTexts;
}
