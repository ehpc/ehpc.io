import { reverse4bits } from "../../wasm/pkg/";
import { MAX_WINDOW_BITMASK } from "../constants";
import { circle, rect } from "../primitives";
import colors from "../styles/colors.module.css";
import type { Building, BuildingOptions, GeneratedEntities, Star, VirtualCanvasContext } from "../types";

function drawSky(ctx: VirtualCanvasContext) {
  rect(ctx, 0, 0, ctx.canvas.width, 74, colors.skyGradient1);
  rect(ctx, 0, 74, ctx.canvas.width, 92, colors.skyGradient2);
  rect(ctx, 0, 92, ctx.canvas.width, 110, colors.skyGradient3);
  rect(ctx, 0, 110, ctx.canvas.width, 126, colors.skyGradient4);
  rect(ctx, 0, 126, ctx.canvas.width, ctx.canvas.height, colors.skyGradient5);
}

function drawStars(ctx: VirtualCanvasContext, stars: Star[]) {
  stars.forEach((star) => {
    const realOpacity = (star.opacity <= 50 ? star.opacity * 2 : (100 - star.opacity) * 2) * 0.01;
    rect(ctx, star.x, star.y, star.x + 1, star.y + 1, star.color.replace(")", `, ${realOpacity})`));
  });
}

function drawSun(ctx: VirtualCanvasContext) {
  circle(ctx, 220, 114, 30, colors.sunColor);
}

function drawBuilding(
  ctx: VirtualCanvasContext,
  x: number,
  y: number,
  width: number,
  color: string,
  options?: BuildingOptions,
) {
  options = {
    windowsBitmask: 0,
    antennaLength: 0,
    ...options,
  };
  rect(ctx, x, y, x + width, ctx.canvas.height, color);
  if (options.antennaLength) {
    const left = x + width / 2;
    rect(ctx, left, y - (options.antennaLength | 0), left + 1, y, color);
  }
  if (options.windowsBitmask) {
    const windowWidth = 3;
    const windowHeight = 4;
    let windowY = y + width / 2;
    let windowBitmask = options.windowsBitmask;
    if ((windowBitmask & 0b11) === 0) {
      // Flip bitmask so that there are no big gaps at the top
      windowBitmask = reverse4bits(windowBitmask);
    }
    if (width <= 14) {
      const windowX = Math.floor(x + width / 2 - 1.5);
      for (let i = 0; i < MAX_WINDOW_BITMASK; i++) {
        const hasWindowInPosition = (windowBitmask & 1) === 1;
        windowBitmask >>= 1;
        if (hasWindowInPosition) {
          rect(ctx, windowX, windowY, windowX + windowWidth, windowY + windowHeight, colors.windowColor);
        }
        windowY += windowHeight * 3;
      }
    } else {
      for (let i = 0; i < MAX_WINDOW_BITMASK; i++) {
        const hasWindowInPosition = (windowBitmask & 1) === 1;
        windowBitmask >>= 1;
        if (hasWindowInPosition) {
          const windowX = Math.floor(x + (width / 3) * (i % 2 === 0 ? 1 : 2) - 1.5);
          rect(ctx, windowX, windowY, windowX + windowWidth, windowY + windowHeight, colors.windowColor);
        }
        windowY += windowHeight * 3;
      }
    }
  }
}

function drawBuildings(ctx: VirtualCanvasContext, buildings: Building[]) {
  for (const building of buildings) {
    drawBuilding(ctx, building.x, building.y, building.width, building.color, building.options);
  }
}

export function drawWindowScene(ctx: VirtualCanvasContext, generatedEntities: GeneratedEntities) {
  drawSky(ctx);
  drawStars(ctx, generatedEntities.stars);
  drawSun(ctx);
  drawBuildings(ctx, generatedEntities.backgroundBuildings);
  drawBuildings(ctx, generatedEntities.foregroundBuildings);
}
