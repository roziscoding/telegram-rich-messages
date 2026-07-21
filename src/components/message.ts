import {
    richMessage as buildRichMessage,
    type RichMessageOptions,
} from "../core/message.ts";
import { expectRichMessage } from "../core/guards.ts";
import type { RichMessageValue } from "../core/values.ts";
import type { ElementChild } from "./jsx-runtime.ts";

/**
 * Assembles block elements and `JSX.Element` children into an
 * `InputRichMessage` ready to send. This is the components entrypoint's
 * root, which also accepts `JSX.Element` children and validates the
 * composition at runtime, unlike the strict functional root in
 * `grammy-rich-messages/core`.
 *
 * @param children Block elements and JSX children to compose into the message
 */
export function richMessage(
    ...children: readonly ElementChild[]
): RichMessageValue;
/**
 * Assembles block elements and `JSX.Element` children into an
 * `InputRichMessage` ready to send, applying the given message options.
 * This is the components entrypoint's root, which also accepts
 * `JSX.Element` children and validates the composition at runtime, unlike
 * the strict functional root in `grammy-rich-messages/core`.
 *
 * @param options Message-level options applied to the composed message
 * @param children Block elements and JSX children to compose into the message
 */
export function richMessage(
    options: RichMessageOptions,
    ...children: readonly ElementChild[]
): RichMessageValue;
export function richMessage(
    first?: RichMessageOptions | ElementChild,
    ...rest: readonly ElementChild[]
): RichMessageValue {
    return expectRichMessage(
        buildRichMessage(...([first, ...rest] as never[])),
    );
}
