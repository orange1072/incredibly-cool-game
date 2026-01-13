import type { WorldSettings } from '../../../types/settings/world-settings.types';

const worldSettings: WorldSettings = {
  zoom: 1,
  smoothing: 0.12,
  tileGrid: {
    gridSize: 32,
    lineColor: 'rgba(28, 28, 28, 0.5)',
    bg: 'rgba(34, 183, 153, 1)',
  },
  bounds: {
    width: 6000,
    height: 3000,
  },
};

export default worldSettings;
