import { ISystem, SYSTEM_TYPES, SystemType } from '../../types/engine.types'

class SpriteLoaderSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.spriteLoader as SystemType
  private imageCache = new Map<string, HTMLImageElement>()

  update() {
    return
  }

  getImage(source: string) {
    let image = this.imageCache.get(source)
    if (!image) {
      image = new Image()
      image.src = source
      this.imageCache.set(source, image)
    }
    return image
  }

  preload(sources: string[]) {
    for (const source of sources) {
      this.getImage(source)
    }
  }

  clearCache() {
    this.imageCache.clear()
  }
}

export default SpriteLoaderSystem
