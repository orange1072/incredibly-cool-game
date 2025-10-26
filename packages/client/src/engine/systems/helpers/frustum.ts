export interface RenderFrustum {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

//calculates visible camera view

export function createFrustum(
  cameraX: number,
  cameraY: number,
  visibleWidth: number,
  visibleHeight: number,
  padding: number
): RenderFrustum {
  return {
    minX: cameraX - padding,
    maxX: cameraX + visibleWidth + padding,
    minY: cameraY - padding,
    maxY: cameraY + visibleHeight + padding,
  };
}

export function pointInFrustum(frustum: RenderFrustum, x: number, y: number) {
  return (
    x >= frustum.minX &&
    x <= frustum.maxX &&
    y >= frustum.minY &&
    y <= frustum.maxY
  );
}
