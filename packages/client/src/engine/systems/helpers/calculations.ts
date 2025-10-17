//вычисляет сближение

function getProximity(subjectCoordinate: number, targetCoordinate: number) {
  return subjectCoordinate - targetCoordinate
}

//вычисляет направление
function calculateUnitDirection(proximity: number, totalDistance: number) {
  return proximity / totalDistance
}

// вычисляет смещение
function displaceAlongNormal(
  coord: number,
  normalComponent: number,
  overlap: number
) {
  return coord + normalComponent * overlap
}

export { getProximity, calculateUnitDirection, displaceAlongNormal }
