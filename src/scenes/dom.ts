import { SERVER_BOXES_OFFSET_X_THRESHOLD } from "../constants";
import type { DrawingCoordinates, Point } from "../types";

function relocateDomElement(
  element: HTMLElement,
  tl: Point,
  width: number,
  height: number,
  drawingCoordinates: DrawingCoordinates,
  additionalVirtualOffsetX: number,
) {
  const kX = drawingCoordinates.drawingWidth / drawingCoordinates.virtualWidth;
  const kY = drawingCoordinates.drawingHeight / drawingCoordinates.virtualHeight;
  const offsetX = tl[0] * kX + drawingCoordinates.canvasOffsetX - drawingCoordinates.virtualX * kX
    + additionalVirtualOffsetX * kX;
  const offsetY = tl[1] * kY + drawingCoordinates.canvasOffsetY;

  element.style.setProperty("transform", `translate(${offsetX}px, ${offsetY}px)`);
  element.style.setProperty("width", `${width * kX}px`);
  element.style.setProperty("height", `${height * kY}px`);
}

export function drawDomElements(
  drawingCoordinates: DrawingCoordinates,
) {
  const serverBoxesOffset = -Math.max(0, drawingCoordinates.virtualX - SERVER_BOXES_OFFSET_X_THRESHOLD);

  // Github link
  const githubLink = document.getElementById("github-link");
  if (githubLink) {
    relocateDomElement(githubLink, [363, 154], 27, 27, drawingCoordinates, serverBoxesOffset);
  }

  // CV link
  const cvLink = document.getElementById("cv-link");
  if (cvLink) {
    relocateDomElement(cvLink, [363, 234], 45, 42, drawingCoordinates, serverBoxesOffset);
  }

  // Email link
  const emailLink = document.getElementById("email-link");
  if (emailLink) {
    relocateDomElement(emailLink, [308, 215], 33, 15, drawingCoordinates, serverBoxesOffset);
  }

  // Portrait mode disclaimer
  const portraitDisclaimer = document.getElementById("portrait-disclaimer");
  if (portraitDisclaimer && window.innerHeight / window.innerWidth > 1.2) {
    portraitDisclaimer.style.setProperty("display", "block");
    const disclaimerHeight = portraitDisclaimer.getBoundingClientRect().height;
    const top = (drawingCoordinates.canvasOffsetY - disclaimerHeight) / 2;
    if (top > 0) {
      portraitDisclaimer.style.setProperty("top", `${top}px`);
    } else {
      portraitDisclaimer.style.removeProperty("top");
    }
  } else if (portraitDisclaimer) {
    portraitDisclaimer.style.setProperty("display", "none");
  }
}
