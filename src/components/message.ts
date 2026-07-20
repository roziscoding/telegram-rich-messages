import { richMessage, type RichMessageOptions } from "../core/message.ts";
import type { BlockInput } from "../core/blocks.ts";
import type { ElementChildrenProps } from "./shared.ts";

export function RichMessage(
    { children, ...options }: ElementChildrenProps & {
        isRtl?: boolean;
        skipEntityDetection?: boolean;
    },
) {
    const blocks = children === undefined ? [] : [children as BlockInput];
    return richMessage(options as RichMessageOptions, ...blocks);
}
