export function getHealthBarRect(
  centerX: number,
  topY: number,
  barWidth: number,
  barHeight: number
): [number, number, number, number] {
  return [centerX - barWidth / 2, topY - barHeight, barWidth, barHeight];
}

export function getDamageRect(barWidth: number, ratio: number) {
  return barWidth * ratio;
}
