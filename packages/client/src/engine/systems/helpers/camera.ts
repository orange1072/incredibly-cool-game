const MAX_SMOOTHING = 1
const DEFAULT_FRAME_RATE = 60

// camera movements helpers

//scaling
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

//screen centering calculation
export function screenFollows(
  start: number,
  end: number,
  interpolation: number
) {
  return start + (end - start) * interpolation
}

//smothing movements
export function computeCameraSmoothing(
  smoothing: number,
  deltaSeconds: number
) {
  if (smoothing <= 0) return MAX_SMOOTHING
  const frames = Math.max(1, deltaSeconds * DEFAULT_FRAME_RATE)
  const factor = 1 - Math.pow(1 - smoothing, frames)
  return Math.min(MAX_SMOOTHING, factor)
}
