import { BOTTOM_SERVER_BOX_TEXT, PC_TEXT, PC_TEXT_TYPING_SPEED, TOP_SERVER_BOX_TEXT } from "../constants";
import type { PCText, ServerBoxText } from "../types";

export function generatePCText(pcText?: PCText, deltaTime: number = 0): PCText {
  if (!pcText) {
    return {
      text: PC_TEXT,
      currentSymbolIndex: 0,
      currentRow: 0,
      typingSpeed: PC_TEXT_TYPING_SPEED,
      elapsed: 0,
      stopped: false,
    };
  }

  const symbolInterval = 1000 / pcText.typingSpeed;
  pcText.elapsed += deltaTime;
  if (pcText.stopped) return pcText;
  if (pcText.elapsed > symbolInterval) {
    // If we are at the end of the text
    if (pcText.currentSymbolIndex >= pcText.text.length) {
      pcText.currentSymbolIndex = 0;
      return pcText;
    }
    pcText.currentSymbolIndex++;

    if (pcText.text[pcText.currentSymbolIndex] === "\n") {
      // Two new lines in a row means we stop typing
      if (pcText.text[pcText.currentSymbolIndex + 1] === "\n") {
        pcText.stopped = true;
      } else {
        pcText.currentRow++;
        pcText.currentSymbolIndex++;
      }
    }
    pcText.elapsed = 0;
  }

  return pcText;
}

export function generateServerBoxTexts(
  serverBoxTexts?: ServerBoxText[],
  deltaTime: number = 0,
): ServerBoxText[] {
  if (!serverBoxTexts) {
    return [
      {
        text: BOTTOM_SERVER_BOX_TEXT,
        x: 369,
        y: 263,
        size: 36,
      },
      {
        text: TOP_SERVER_BOX_TEXT[0],
        x: 368,
        y: 165,
        size: 13,
      },
      {
        text: TOP_SERVER_BOX_TEXT[1],
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
