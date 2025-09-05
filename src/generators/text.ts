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
        elapsed: 0,
        shiftFrequency: 5000,
        shiftX: 1,
        shiftSpeed: 100,
        currentShift: 0,
      },
      {
        text: "git",
        x: 368,
        y: 165,
        size: 13,
        elapsed: 0,
        shiftFrequency: 3000,
        shiftX: 1,
        shiftSpeed: 100,
        currentShift: 0,
      },
      {
        text: "hub",
        x: 368,
        y: 177,
        size: 13,
        elapsed: 0,
        shiftFrequency: 3000,
        shiftX: 1,
        shiftSpeed: 100,
        currentShift: 0,
      },
    ];
  }

  for (const serverBoxText of serverBoxTexts) {
    serverBoxText.elapsed += deltaTime;
    if (serverBoxText.elapsed > serverBoxText.shiftFrequency) {
      if (serverBoxText.currentShift >= serverBoxText.shiftX) {
        serverBoxText.currentShift = 0;
        serverBoxText.elapsed = 0;
      } else {
        serverBoxText.currentShift = Math.min(
          serverBoxText.shiftX,
          serverBoxText.currentShift + (serverBoxText.shiftSpeed * deltaTime) / 1000,
        );
      }
    }
  }

  return serverBoxTexts;
}
