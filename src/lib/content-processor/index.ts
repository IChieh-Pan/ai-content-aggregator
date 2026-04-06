export { BasicContentProcessor } from "./basic-processor";
export { extractKeywords, generateTags } from "./keywords";
export { ProcessorRegistry } from "./registry";
export type {
  ContentCategory,
  ContentProcessor,
  ProcessedContent,
  ProcessorConfig,
  RawContent,
} from "./types";

import { BasicContentProcessor } from "./basic-processor";
import { ProcessorRegistry } from "./registry";
import type { ProcessorConfig } from "./types";

let defaultRegistry: ProcessorRegistry | null = null;

export function createProcessorRegistry(
  config?: Partial<ProcessorConfig>,
): ProcessorRegistry {
  const registry = new ProcessorRegistry();
  registry.register(new BasicContentProcessor(config));
  return registry;
}

export function getDefaultRegistry(): ProcessorRegistry {
  if (!defaultRegistry) {
    defaultRegistry = createProcessorRegistry();
  }
  return defaultRegistry;
}
