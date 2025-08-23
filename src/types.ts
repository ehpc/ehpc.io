export type VirtualCanvas = OffscreenCanvas | HTMLCanvasElement;
export type VirtualCanvasContext = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

export interface BuildingOptions {
  windowsBitmask?: number;
  antennaLength?: number;
}

export interface Building {
  x: number;
  y: number;
  width: number;
  color: string;
  options: BuildingOptions;
}

export interface BuildingGenerationInterval {
  x0: number;
  x1: number;
  minWidth: number;
  maxWidth: number;
  minY: number;
  maxY: number;
  options?: BuildingOptions;
}

export interface GeneratedEntities {
  backgroundBuildings: Building[];
  foregroundBuildings: Building[];
}
