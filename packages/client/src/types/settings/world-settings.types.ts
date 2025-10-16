export type WorldBounds = {
  width: number
  height: number
}

export type TileGridSettings = {
  gridSize: number
  lineColor: string
  bg: string
}

export interface WorldSettings {
  zoom: number
  smoothing: number
  tileGrid: TileGridSettings
  bounds: WorldBounds
}
