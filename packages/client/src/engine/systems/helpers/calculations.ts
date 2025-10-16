function getProximity(subjectCoordinate: number, targetCoordinate: number) {
  return subjectCoordinate - targetCoordinate
}

function calculateUnitDirection(proximity: number, totalDistance: number) {
  return proximity / totalDistance
}

function displaceAlongNormal(
  coordinate: number,
  normalComponent: number,
  overlap: number
) {
  return coordinate + normalComponent * overlap
}

export { getProximity, calculateUnitDirection, displaceAlongNormal }
