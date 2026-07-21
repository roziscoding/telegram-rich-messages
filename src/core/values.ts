import type {
    InputRichBlock,
    InputRichBlockListItem,
    InputRichMessage,
    RichBlockTableCell,
    RichText,
} from "../deps.deno.ts";

const valueKindKey = "__telegramRichMessagesValueKind" as const;
type ValueKind =
    | "rich-text"
    | "block"
    | "list-item"
    | "table-cell"
    | "table-row"
    | "rich-message";
/**
 * A grammY `types` value carrying a non-enumerable value-kind tag. The brand
 * records which builder category produced the value so it can be checked at
 * runtime, disappears under `JSON.stringify`, and stays structurally
 * assignable to the bare grammY type `T`.
 */
export type BrandedValue<T, K extends ValueKind> = T & {
    readonly __telegramRichMessagesValueKind: K;
};

/**
 * A branded `RichText` returned by the rich-text builders, tagged so it can
 * be recognised as rich-text at runtime.
 */
export type RichTextValue<T extends RichText = RichText> = BrandedValue<
    T,
    "rich-text"
>;
/**
 * A branded `InputRichBlock` returned by the block builders, tagged so it can
 * be recognised as a block at runtime.
 */
export type BlockValue<T extends InputRichBlock = InputRichBlock> =
    BrandedValue<T, "block">;
/**
 * A {@link BlockValue} narrowed to the `InputRichBlock` variant selected by
 * its `type` discriminant.
 */
export type BlockValueOf<K extends InputRichBlock["type"]> = BlockValue<
    Extract<InputRichBlock, { type: K }>
>;
/**
 * A branded `InputRichBlockListItem` returned by the list-item builder,
 * tagged so it can be recognised as a list item at runtime.
 */
export type ListItemValue = BrandedValue<InputRichBlockListItem, "list-item">;
/**
 * A branded `RichBlockTableCell` returned by the table-cell builder, tagged
 * so it can be recognised as a table cell at runtime.
 */
export type TableCellValue = BrandedValue<RichBlockTableCell, "table-cell">;
/**
 * A branded `InputRichMessage` returned by {@link richMessage}, tagged so it
 * can be recognised as a message root at runtime.
 */
export type RichMessageValue = BrandedValue<InputRichMessage, "rich-message">;

/**
 * A table row returned by the table-row builder. Unlike the other values it
 * is a plain wrapper around its {@link TableCellValue} cells rather than a
 * bare grammY type, carrying the same non-enumerable value-kind tag used for
 * runtime category checks.
 */
export interface TableRowValue {
    /** The cells that make up the row, in column order. */
    readonly cells: TableCellValue[];
    /** The value-kind tag identifying this value as a table row. */
    readonly __telegramRichMessagesValueKind: "table-row";
}

/** Attaches the non-enumerable value-kind tag to a value in place. */
export function brand<T extends object, K extends ValueKind>(
    value: T,
    kind: K,
): BrandedValue<T, K> {
    Object.defineProperty(value, valueKindKey, {
        value: kind,
        enumerable: false,
    });
    return value as BrandedValue<T, K>;
}

/** Reads the value-kind tag from a value, or `undefined` if unbranded. */
export function kindOf(value: unknown): ValueKind | undefined {
    return typeof value === "object" && value !== null
        ? (value as { __telegramRichMessagesValueKind?: ValueKind })[
            valueKindKey
        ]
        : undefined;
}

/** Deep-clones a value while preserving its value-kind brand. */
export function cloneValue<T>(value: T): T {
    return clone(value, new WeakMap<object, object>());
}

function clone<T>(value: T, seen: WeakMap<object, object>): T {
    if (typeof value !== "object" || value === null) return value;

    const existing = seen.get(value);
    if (existing !== undefined) return existing as T;

    if (Array.isArray(value)) {
        const result: unknown[] = [];
        seen.set(value, result);
        for (const item of value) result.push(clone(item, seen));
        return result as T;
    }

    const prototype = Object.getPrototypeOf(value) as object | null;
    if (prototype !== Object.prototype && prototype !== null) {
        return structuredClone(value);
    }

    const result: Record<string, unknown> = {};
    seen.set(value, result);
    for (const [key, item] of Object.entries(value)) {
        result[key] = clone(item, seen);
    }

    const kind = kindOf(value);
    return (kind === undefined ? result : brand(result, kind)) as T;
}
