import { DESK_OFFSET_X_THRESHOLD, PC_TEXT_FONT, PC_TEXT_LINE_HEIGHT, PC_TEXT_SIZE } from "../constants";
import colors from "../styles/colors.module.css";
import type { DrawingCoordinates, GeneratedEntities } from "../types";
import type { PCText, Point } from "../types";

interface TransformFactors {
  kX: number;
  kY: number;
  tX: number;
  tY: number;
}

function virtualXtoRealX(virtualX: number, { kX, tX }: TransformFactors): number {
  return virtualX * kX + tX;
}

function virtualYtoRealY(virtualY: number, { kY, tY }: TransformFactors): number {
  return virtualY * kY + tY;
}

function virtualPointToRealPoint(virtualPoint: Point, transformFactors: TransformFactors): Point {
  const [virtualX, virtualY] = virtualPoint;
  return [virtualXtoRealX(virtualX, transformFactors), virtualYtoRealY(virtualY, transformFactors)];
}

function setNormalFont(ctx: CanvasRenderingContext2D, transformFactors: TransformFactors) {
  const textSize = PC_TEXT_SIZE * (transformFactors.kY);
  ctx.font = `${textSize}px ${PC_TEXT_FONT}`;
}

function setSmallFont(ctx: CanvasRenderingContext2D, transformFactors: TransformFactors) {
  const textSize = (PC_TEXT_SIZE - 2) * (transformFactors.kY);
  ctx.font = `${textSize}px ${PC_TEXT_FONT}`;
}

function setSmallerFont(ctx: CanvasRenderingContext2D, transformFactors: TransformFactors) {
  const textSize = (PC_TEXT_SIZE - 3) * (transformFactors.kY);
  ctx.font = `${textSize}px ${PC_TEXT_FONT}`;
}

function writeText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  transformFactors: TransformFactors,
) {
  const isSmallText = text.startsWith("[SMALL]");
  const isSmallerText = text.startsWith("[SMALLER]");
  if (isSmallText) {
    setSmallFont(ctx, transformFactors);
    text = text.slice(7);
  } else if (isSmallerText) {
    setSmallerFont(ctx, transformFactors);
    text = text.slice(9);
  }
  ctx.fillText(text, x, y);
  if (isSmallText) {
    setNormalFont(ctx, transformFactors);
  }
}

function drawPCText(ctx: CanvasRenderingContext2D, pcText: PCText, transformFactors: TransformFactors) {
  const [x, y] = virtualPointToRealPoint([139, 211], transformFactors);
  const textSize = PC_TEXT_SIZE * (transformFactors.kY);
  const lineHeight = PC_TEXT_LINE_HEIGHT * (transformFactors.kY);

  const { text, currentSymbolIndex } = pcText;
  ctx.fillStyle = colors.textColor;
  setNormalFont(ctx, transformFactors);

  // Draw previous rows
  let index = 0;
  let lastNewLineIndex = 0;
  let str = "";
  const rows: string[] = [];
  while (index < currentSymbolIndex) {
    str += text[index];
    if (text[index] === "\n") {
      rows.unshift(str);
      str = "";
      lastNewLineIndex = index + 1;
    }
    index++;
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(...virtualPointToRealPoint([135, 170], transformFactors));
  ctx.lineTo(...virtualPointToRealPoint([164, 170], transformFactors));
  ctx.lineTo(...virtualPointToRealPoint([164, 171], transformFactors));
  ctx.lineTo(...virtualPointToRealPoint([195, 171], transformFactors));
  ctx.lineTo(...virtualPointToRealPoint([195, 215], transformFactors));
  ctx.lineTo(...virtualPointToRealPoint([164, 215], transformFactors));
  ctx.lineTo(...virtualPointToRealPoint([164, 217], transformFactors));
  ctx.lineTo(...virtualPointToRealPoint([135, 217], transformFactors));
  ctx.closePath();
  ctx.clip();

  const noMoreText = currentSymbolIndex >= text.length;
  for (let i = 0; i < rows.length; i++) {
    writeText(ctx, rows[i], x, y - ((noMoreText ? i : i + 1) * (textSize + lineHeight)), transformFactors);
  }
  if (!noMoreText) {
    const partialText = text.slice(lastNewLineIndex, currentSymbolIndex);
    // Draw current row
    writeText(ctx, partialText, x, y, transformFactors);
  }

  ctx.restore();
}

export function drawUnscaledScene(
  ctx: CanvasRenderingContext2D,
  generatedEntities: GeneratedEntities,
  drawingCoordinates: DrawingCoordinates,
) {
  const kX = drawingCoordinates.drawingWidth / drawingCoordinates.virtualWidth;
  const transformFactors: TransformFactors = {
    kX,
    kY: drawingCoordinates.drawingHeight / drawingCoordinates.virtualHeight,
    tX: drawingCoordinates.canvasOffsetX
      - drawingCoordinates.virtualX * kX,
    tY: drawingCoordinates.canvasOffsetY,
  };

  const deskOffset = Math.max(0, drawingCoordinates.virtualX - DESK_OFFSET_X_THRESHOLD) * kX;
  ctx.translate(deskOffset, 0);
  drawPCText(ctx, generatedEntities.pcText, transformFactors);
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
