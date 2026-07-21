import {
    richMessage as buildRichMessage,
    type RichMessageOptions,
} from "../core/message.ts";
import { expectRichMessage } from "../core/guards.ts";
import type { RichMessageValue } from "../core/values.ts";
import type { ElementChild } from "./jsx-runtime.ts";

/**
 * TSX-facing message root. Accepts `JSX.Element` children — which TypeScript
 * widens away from `BlockValue` — delegates construction to the strict core
 * `richMessage`, then validates the composed value with {@link expectRichMessage}.
 * Core's `richMessage` keeps its compile-time block-only guarantees for
 * functional callers; this entry trades them for runtime validation so TSX
 * elements can be passed directly.
 */
export function richMessage(
    ...children: readonly ElementChild[]
): RichMessageValue;
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
