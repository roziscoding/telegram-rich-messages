import type { InputFile, InputRichMessage } from "../deps";
import { brand, type RichMessageValue } from "../core/values";
import { blocks, splitOptions, type BlockInput } from "./shared";

export interface RichMessageOptions {
  isRtl?: boolean;
  skipEntityDetection?: boolean;
}

export function richMessage<F = InputFile>(...children: readonly BlockInput<F>[]): RichMessageValue<F>;
export function richMessage<F = InputFile>(options: RichMessageOptions, ...children: readonly BlockInput<F>[]): RichMessageValue<F>;
export function richMessage<F = InputFile>(first?: RichMessageOptions | BlockInput<F>, ...rest: readonly BlockInput<F>[]) {
  const [options = {}, children] = splitOptions<RichMessageOptions, BlockInput<F>>(
    first, rest, "richMessage()", ["isRtl", "skipEntityDetection"], "block",
  );
  const value: InputRichMessage<F> = {
    blocks: blocks(children, "richMessage()"),
    ...(options.isRtl === true ? { is_rtl: true as const } : {}),
    ...(options.skipEntityDetection === true ? { skip_entity_detection: true as const } : {}),
  };
  return brand(value, "rich-message");
}
