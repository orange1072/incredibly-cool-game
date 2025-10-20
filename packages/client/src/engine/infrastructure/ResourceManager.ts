type ResourceType = 'image' | 'audio' | 'json';

interface ResourceItem {
  key: string;
  url: string;
  type: ResourceType;
}

export default class ResourceManager {
  private images = new Map<string, HTMLImageElement>();
  private audios = new Map<string, HTMLAudioElement>();
  private jsons = new Map<string, unknown>();

  async load(item: ResourceItem): Promise<void> {
    if (item.type === 'image') {
      const img = await this.loadImage(item.url);
      this.images.set(item.key, img);
    }

    if (item.type === 'audio') {
      const audio = await this.loadAudio(item.url);
      this.audios.set(item.key, audio);
    }

    if (item.type === 'json') {
      const data = await this.loadJson(item.url);
      this.jsons.set(item.key, data);
    }
  }

  async loadAll(
    resources: ResourceItem[],
    onProgress?: (ratio: number) => void
  ) {
    let loaded = 0;
    const total = resources.length;

    await Promise.all(
      resources.map(async (item) => {
        await this.load(item);
        loaded++;
        if (onProgress) onProgress(loaded / total);
      })
    );
  }

  getImage(key: string): HTMLImageElement | undefined {
    return this.images.get(key);
  }

  getAudio(key: string): HTMLAudioElement | undefined {
    return this.audios.get(key);
  }

  getJson<T = unknown>(key: string): T | undefined {
    return this.jsons.get(key) as T | undefined;
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = reject;
      audio.load();
    });
  }

  private async loadJson(url: string): Promise<unknown> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load JSON: ${url}`);
    return res.json();
  }
}
