function getProximity(subjectCoordinate: number, targetCoordinate: number) {
  return subjectCoordinate - targetCoordinate
}

function calculateUnitDirection(proximity: number, totalDistance: number) {
  return proximity / totalDistance
}

function displaceAlongNormal(
  coord: number,
  normalComponent: number,
  overlap: number
) {
  return coord + normalComponent * overlap
}

export { getProximity, calculateUnitDirection, displaceAlongNormal }
