import type { InputRichMessageBlocks } from "../types.js";
import { brand, type RichMessageValue } from "../values.js";
import { blocks, splitOptions, type BlockInput } from "./shared.js";

export interface RichMessageOptions {
  isRtl?: boolean;
  skipEntityDetection?: boolean;
}

export function richMessage(...children: readonly BlockInput[]): RichMessageValue;
export function richMessage(options: RichMessageOptions, ...children: readonly BlockInput[]): RichMessageValue;
export function richMessage(first?: RichMessageOptions | BlockInput, ...rest: readonly BlockInput[]) {
  const [options = {}, children] = splitOptions<RichMessageOptions, BlockInput>(
    first, rest, "richMessage()", ["isRtl", "skipEntityDetection"], "block",
  );
  const value: InputRichMessageBlocks = {
    blocks: blocks(children, "richMessage()"),
    ...(options.isRtl === true ? { is_rtl: true as const } : {}),
    ...(options.skipEntityDetection === true ? { skip_entity_detection: true as const } : {}),
  };
  return brand(value, "rich-message");
}
