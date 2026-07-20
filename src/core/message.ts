import type { InputRichMessage } from "../deps.deno.ts";
import { brand, type RichMessageValue } from "../core/values.ts";
import { type BlockInput, blocks, splitOptions } from "./shared.ts";

export interface RichMessageOptions {
    isRtl?: boolean;
    skipEntityDetection?: boolean;
}

export function richMessage(
    ...children: readonly BlockInput[]
): RichMessageValue;
export function richMessage(
    options: RichMessageOptions,
    ...children: readonly BlockInput[]
): RichMessageValue;
export function richMessage(
    first?: RichMessageOptions | BlockInput,
    ...rest: readonly BlockInput[]
) {
    const [options = {}, children] = splitOptions<
        RichMessageOptions,
        BlockInput
    >(
        first,
        rest,
        "richMessage()",
        ["isRtl", "skipEntityDetection"],
    );
    const value: InputRichMessage = {
        blocks: blocks(children, "richMessage()"),
        ...(options.isRtl === true ? { is_rtl: true as const } : {}),
        ...(options.skipEntityDetection === true
            ? { skip_entity_detection: true as const }
            : {}),
    };
    return brand(value, "rich-message");
}
