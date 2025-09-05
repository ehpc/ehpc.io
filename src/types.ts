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

// Star in the virtual world.
export interface Star {
  x: number;
  y: number;
  color: string;
  // Star opacity (0-50-100), two phases, 50 fully visible, 0 and 100 - invisible
  opacity: number;
  // How fast it lights up from 0 to 50 in ms
  glowingSpeed: number;
}

// Signaling light on a server box
export interface Indicator {
  tl: Point;
  br: Point;
  color: string;
  litUpTime: number;
  maxLitUpTime: number;
}

// Server box display
export interface ServerBoxDisplay {
  tl: Point;
  br: Point;
}

// Server box entity
export interface ServerBox {
  tl: Point;
  br: Point;
  depth: number;
  display?: ServerBoxDisplay;
  indicators?: Indicator[];
}

// Display rolling scanline
export interface RollingScanline {
  tl: Point;
  boxWidth: number;
  boxHeight: number;
  thickness: number;
  speed: number;
  currentPosition: number;
}

// Text displayed on a server box
export interface ServerBoxText {
  text: string;
  x: number;
  y: number;
  size: number;
  elapsed: number;
  shiftFrequency: number;
  shiftX: number;
  shiftSpeed: number;
  currentShift: number;
}

// Generated entities in the virtual world.
export interface GeneratedEntities {
  backgroundBuildings: Building[];
  foregroundBuildings: Building[];
  stars: Star[];
  serverBoxes: ServerBox[];
  rollingScanlines: RollingScanline[];
  serverBoxTextes: ServerBoxText[];
  cursorPosition: Point;
}

// Simple point on 2D space.
export type Point = [number, number];

// Rectangle defined by its corner points.
export type Rect = [Point, Point, Point, Point]; // [TL, TR, BR, BL]
