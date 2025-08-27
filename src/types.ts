// Virtual canvas element.
export type VirtualCanvas = OffscreenCanvas | HTMLCanvasElement;
// Virtual canvas context element.
export type VirtualCanvasContext = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

// Options for customizing building appearance.
export interface BuildingOptions {
  windowsBitmask?: number;
  antennaLength?: number;
}

// Building in the virtual world.
export interface Building {
  x: number;
  y: number;
  width: number;
  color: string;
  options: BuildingOptions;
}

// Interval for generating buildings with specific constraints.
export interface BuildingGenerationInterval {
  x0: number;
  x1: number;
  minWidth: number;
  maxWidth: number;
  minY: number;
  maxY: number;
  options?: BuildingOptions;
}

// Generated entities in the virtual world.
export interface GeneratedEntities {
  backgroundBuildings: Building[];
  foregroundBuildings: Building[];
}

// Simple point on 2D space.
export type Point = [number, number];

// Rectangle defined by its corner points.
export type Rect = [Point, Point, Point, Point]; // [TL, TR, BR, BL]

// Rectangle defined by its top-left corner, width, and height.
export type RectWH = [Point, number, number]; // [TL, width, height]
