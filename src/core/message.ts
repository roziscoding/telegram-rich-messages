import type { InputRichMessage } from "../deps.deno.ts";
import { brand, type RichMessageValue } from "../core/values.ts";
import { type BlockInput, blocks, splitOptions } from "./shared.ts";

/**
 * Options accepted by the {@link richMessage} root when supplied as the
 * first argument.
 */
export interface RichMessageOptions {
    /**
     * Lays the message out right-to-left, becoming `is_rtl` on the Bot API
     * payload. Defaults to left-to-right when omitted.
     */
    isRtl?: boolean;
    /**
     * Disables Telegram's automatic entity detection, becoming
     * `skip_entity_detection` on the Bot API payload. Defaults to leaving
     * detection enabled when omitted.
     */
    skipEntityDetection?: boolean;
}

/**
 * Assembles block values into an `InputRichMessage` ready to send. This is
 * the message root that composes the supplied block children into a single
 * payload.
 *
 * @param children Block values to place in the message, in order
 * @returns the composed {@link RichMessageValue}
 */
export function richMessage(
    ...children: readonly BlockInput[]
): RichMessageValue;
/**
 * Assembles block values into an `InputRichMessage` ready to send, honouring
 * the leading {@link RichMessageOptions}. Passed an already-composed message
 * it validates and returns it.
 *
 * @param options Message-level options such as `is_rtl`
 * @param children Block values to place in the message, in order
 * @returns the composed {@link RichMessageValue}
 */
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
