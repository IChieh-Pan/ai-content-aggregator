import type { ContentProcessor, ProcessedContent, RawContent } from "./types";

export class ProcessorRegistry {
  private processors = new Map<string, ContentProcessor>();
  private activeProcessorName: string | null = null;

  register(processor: ContentProcessor): void {
    this.processors.set(processor.name, processor);
    if (!this.activeProcessorName) {
      this.activeProcessorName = processor.name;
    }
  }

  unregister(name: string): void {
    this.processors.delete(name);
    if (this.activeProcessorName === name) {
      const first = this.processors.keys().next();
      this.activeProcessorName = first.done ? null : first.value;
    }
  }

  setActive(name: string): void {
    if (!this.processors.has(name)) {
      throw new Error(`Processor "${name}" is not registered`);
    }
    this.activeProcessorName = name;
  }

  getActive(): ContentProcessor {
    if (!this.activeProcessorName) {
      throw new Error("No processor is registered");
    }
    return this.processors.get(this.activeProcessorName)!;
  }

  get(name: string): ContentProcessor | undefined {
    return this.processors.get(name);
  }

  list(): { name: string; version: string; active: boolean }[] {
    return Array.from(this.processors.values()).map((p) => ({
      name: p.name,
      version: p.version,
      active: p.name === this.activeProcessorName,
    }));
  }

  async process(content: RawContent): Promise<ProcessedContent> {
    return this.getActive().process(content);
  }

  async processBatch(contents: RawContent[]): Promise<ProcessedContent[]> {
    const processor = this.getActive();
    return Promise.all(contents.map((c) => processor.process(c)));
  }
}
