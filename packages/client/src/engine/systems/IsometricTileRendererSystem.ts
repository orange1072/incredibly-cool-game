import { type RenderFrustum } from './helpers/frustum';
import SpriteLoaderSystem from './SpriteLoaderSystem';

import groundA1E from '../../assets/tiles/ground_a1_e.png';
import groundA1N from '../../assets/tiles/ground_a1_n.png';
import groundA1S from '../../assets/tiles/ground_a1_s.png';
import groundA1W from '../../assets/tiles/ground_a1_w.png';
import groundA2E from '../../assets/tiles/ground_a2_e.png';
import groundA2N from '../../assets/tiles/ground_a2_n.png';
import groundA2S from '../../assets/tiles/ground_a2_s.png';
import groundA2W from '../../assets/tiles/ground_a2_w.png';
import groundA3E from '../../assets/tiles/ground_a3_e.png';
import groundA3N from '../../assets/tiles/ground_a3_n.png';

type TileDefinition = {
  id: string;
  source: string;
};

interface IsoTileRendererOptions {
  baseWidth?: number;
  baseHeight?: number;
  tileWidth?: number;
  tileHeight?: number;
}

export class IsometricTileRenderer {
  private readonly tiles: TileDefinition[] = [
    { id: 'ground_a1_e', source: groundA1E },
    { id: 'ground_a1_n', source: groundA1N },
    { id: 'ground_a1_s', source: groundA1S },
    { id: 'ground_a1_w', source: groundA1W },
    { id: 'ground_a2_e', source: groundA2E },
    { id: 'ground_a2_n', source: groundA2N },
    { id: 'ground_a2_s', source: groundA2S },
    { id: 'ground_a2_w', source: groundA2W },
    { id: 'ground_a3_e', source: groundA3E },
    { id: 'ground_a3_n', source: groundA3N },
  ];

  private readonly baseWidth: number;
  private readonly baseHeight: number;
  private readonly tileWidth: number;
  private readonly tileHeight: number;
  private readonly spriteLoader: SpriteLoaderSystem;
  private grid: string[][] | null = null;
  private gridCols = 0;
  private gridRows = 0;
  private originX = 0;
  private originY = 0;

  constructor(
    spriteLoader: SpriteLoaderSystem,
    options: IsoTileRendererOptions = {}
  ) {
    this.spriteLoader = spriteLoader;
    this.baseWidth = options.baseWidth ?? 128;
    this.baseHeight = options.baseHeight ?? this.baseWidth / 2;
    this.tileWidth = options.tileWidth ?? this.baseWidth;
    this.tileHeight = options.tileHeight ?? 256;

    this.spriteLoader.preload(this.tiles.map((t) => t.source));
  }

  ensureGrid(bounds?: { width: number; height: number }) {
    const targetWidth = bounds?.width;
    const targetHeight = bounds?.height;
    if (!targetWidth || !targetHeight) {
      return;
    }

    const cols = Math.ceil(targetWidth / this.baseWidth) + 45;
    const rows = Math.ceil(targetHeight / this.baseHeight) + 45;

    if (this.grid && cols === this.gridCols && rows === this.gridRows) {
      return;
    }

    this.gridCols = cols;
    this.gridRows = rows;
    this.originX = targetWidth / 2;
    this.originY = -targetHeight / 2;

    const variants = this.tiles.map((t) => t.id);
    this.grid = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => {
        const idx = (row + col * 3) % variants.length;
        return variants[idx];
      })
    );
  }

  render(ctx: CanvasRenderingContext2D, frustum: RenderFrustum) {
    if (!this.grid) return;

    const halfW = this.baseWidth / 2;
    const halfH = this.baseHeight / 2;
    const padding = 25 * this.tileHeight;

    const start = this.screenToGrid(
      frustum.minX - padding,
      frustum.minY - padding,
      halfW,
      halfH
    );

    const end = this.screenToGrid(
      frustum.maxX + padding,
      frustum.maxY + padding,
      halfW,
      halfH
    );

    const minCol = Math.max(0, Math.floor(Math.min(start.col, end.col)));
    const maxCol = Math.min(
      this.gridCols - 1,
      Math.ceil(Math.max(start.col, end.col))
    );
    const minRow = Math.max(0, Math.floor(Math.min(start.row, end.row)));
    const maxRow = Math.min(
      this.gridRows - 1,
      Math.ceil(Math.max(start.row, end.row))
    );

    for (let row = minRow; row <= maxRow; row += 1) {
      for (let col = minCol; col <= maxCol; col += 1) {
        const tileId = this.grid[row]?.[col];
        if (!tileId) continue;
        const tile = this.tiles.find((t) => t.id === tileId);
        if (!tile) continue;
        const image = this.spriteLoader.getImage(tile.source);
        if (!image || !image.complete || image.naturalWidth === 0) continue;

        const { x, y } = this.gridToScreen(col, row, halfW, halfH);
        const drawX = x - this.tileWidth / 2;
        const drawY = y - (this.tileHeight - this.baseHeight);

        ctx.drawImage(image, drawX, drawY, this.tileWidth, this.tileHeight);
      }
    }
  }

  private gridToScreen(col: number, row: number, halfW: number, halfH: number) {
    const x = (col - row) * halfW + this.originX;
    const y = (col + row) * halfH + this.originY;
    return { x, y };
  }

  private screenToGrid(
    screenX: number,
    screenY: number,
    halfW: number,
    halfH: number
  ) {
    const nx = (screenX - this.originX) / halfW;
    const ny = (screenY - this.originY) / halfH;
    const col = (ny + nx) / 2;
    const row = (ny - nx) / 2;
    return { col, row };
  }
}

export default IsometricTileRenderer;
