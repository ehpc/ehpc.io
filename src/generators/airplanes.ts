import type { Airplane } from "../types";
import { random } from "../utils";

const AIRPLANE_LEFT_SPAWN_X = 70;
const AIRPLANE_RIGHT_SPAWN_X = 450;

export function generateAirplanes(
  airplanes?: Airplane[],
  deltaTime: number = 0,
): Airplane[] {
  if (!airplanes || !airplanes.length) {
    const direction = Math.random() < 0.5 ? 1 : -1;
    airplanes = [{
      x: direction === 1 ? AIRPLANE_LEFT_SPAWN_X : AIRPLANE_RIGHT_SPAWN_X,
      y: random(67, 130),
      size: random(1, 3),
      speed: 15 + random(0, 20),
      direction,
    }];
    return airplanes;
  }

  for (let i = airplanes.length - 1; i >= 0; i--) {
    airplanes[i].x += airplanes[i].speed * (deltaTime / 1000) * airplanes[i].direction;

    if (
      (airplanes[i].direction === 1 && airplanes[i].x > AIRPLANE_RIGHT_SPAWN_X)
      || (airplanes[i].direction === -1 && airplanes[i].x < AIRPLANE_LEFT_SPAWN_X)
    ) {
      airplanes.splice(i, 1);
    }
  }

  return airplanes;
}
