import { isPointInsideRect } from "./primitives";
import type { DrawingCoordinates, GeneratedEntities, Point } from "./types";

const PC_DISPLAY_AREA: [Point, Point] = [[135, 170], [195, 217]];

function detectCursorPointsOfInterest(cursorVirtualPosition: Point) {
  document.body.style.removeProperty("cursor");
  // Check for collisions between the cursor and PC display
  if (isPointInsideRect(cursorVirtualPosition, PC_DISPLAY_AREA)) {
    document.body.style.cursor = "pointer";
  }
}

function processPointOfInterestClick(generatedEntities: GeneratedEntities) {
  // Check if the click is inside the PC display area
  if (isPointInsideRect(generatedEntities.cursorVirtualPosition, PC_DISPLAY_AREA)) {
    generatedEntities.pcText.stopped = false;
  }
}

function updateVirtualMouseCoordinates(
  event: MouseEvent,
  generatedEntities: GeneratedEntities,
  drawingCoordinates: DrawingCoordinates,
) {
  const kX = drawingCoordinates.virtualWidth / drawingCoordinates.drawingWidth;
  const kY = drawingCoordinates.virtualHeight / drawingCoordinates.drawingHeight;
  generatedEntities.cursorVirtualPosition = [
    (event.clientX - drawingCoordinates.canvasOffsetX) * kX + drawingCoordinates.virtualX,
    (event.clientY - drawingCoordinates.canvasOffsetY) * kY,
  ];
  detectCursorPointsOfInterest(generatedEntities.cursorVirtualPosition);
}

export function setupCursorTracking(
  generatedEntities: GeneratedEntities,
  drawingCoordinates: DrawingCoordinates,
) {
  window.addEventListener("mousemove", (event) => {
    updateVirtualMouseCoordinates(event, generatedEntities, drawingCoordinates);
  });
  window.addEventListener("mousedown", () => {
    processPointOfInterestClick(generatedEntities);
  });
}
