import type { Airplane } from "../types";
import { random } from "../utils";

export function generateAirplanes(
  airplanes?: Airplane[],
  deltaTime: number = 0,
): Airplane[] {
  if (!airplanes || !airplanes.length) {
    airplanes = [{
      x: 100,
      y: random(67, 130),
      size: random(1, 3),
      speed: 15 + random(0, 20),
    }];
    return airplanes;
  }

  for (let i = airplanes.length - 1; i >= 0; i--) {
    airplanes[i].x += airplanes[i].speed * (deltaTime / 1000);

    if (airplanes[i].x > 500) {
      airplanes.splice(i, 1);
    }
  }

  return airplanes;
}
