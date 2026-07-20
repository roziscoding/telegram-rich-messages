import { richMessage, type RichMessageOptions } from "../core/message";
import type { BlockInput } from "../core/blocks";
import type { InputFile } from "../deps";
import type { ElementChildrenProps } from "./shared";

export function RichMessage({ children, ...options }: ElementChildrenProps & { isRtl?: boolean; skipEntityDetection?: boolean }) {
  const blocks = children === undefined ? [] : [children as BlockInput<InputFile>];
  return richMessage(options as RichMessageOptions, ...blocks);
}
