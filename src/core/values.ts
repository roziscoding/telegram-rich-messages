import type {
  InputFile,
  InputRichBlock,
  InputRichBlockListItem,
  InputRichMessage,
  RichBlockTableCell,
  RichText,
} from "../deps";

const valueKindKey = "__telegramRichMessagesValueKind" as const;
type ValueKind = "rich-text" | "block" | "list-item" | "table-cell" | "table-row" | "rich-message";
export type BrandedValue<T, K extends ValueKind> = T & { readonly __telegramRichMessagesValueKind: K };

/**
 * The file type carried by media-bearing values. It defaults to grammY's
 * `InputFile`, so media blocks accept either an upload (`InputFile`) or a
 * file_id/URL string (media fields resolve to `F | string`). It flows outward
 * through containers up to the message, matching grammY's `replyWithRichMessage`,
 * which consumes `InputRichMessage<InputFile>`.
 */
export type RichTextValue<T extends RichText = RichText> = BrandedValue<T, "rich-text">;
export type BlockValue<F = InputFile, T extends InputRichBlock<F> = InputRichBlock<F>> = BrandedValue<T, "block">;
/**
 * A `BlockValue` selected by its `type` discriminant. `F` defaults to `never`
 * for blocks that carry no file, and is supplied only by media-bearing blocks
 * and the containers that thread it through.
 */
export type BlockValueOf<K extends InputRichBlock<never>["type"], F = never> = BlockValue<F, Extract<InputRichBlock<F>, { type: K }>>;
export type ListItemValue<F = InputFile> = BrandedValue<InputRichBlockListItem<F>, "list-item">;
export type TableCellValue = BrandedValue<RichBlockTableCell, "table-cell">;
export type RichMessageValue<F = InputFile> = BrandedValue<InputRichMessage<F>, "rich-message">;

export interface TableRowValue {
  readonly cells: TableCellValue[];
  readonly __telegramRichMessagesValueKind: "table-row";
}

export function brand<T extends object, K extends ValueKind>(value: T, kind: K): BrandedValue<T, K> {
  Object.defineProperty(value, valueKindKey, { value: kind, enumerable: false });
  return value as BrandedValue<T, K>;
}

export function kindOf(value: unknown): ValueKind | undefined {
  return typeof value === "object" && value !== null
    ? (value as { __telegramRichMessagesValueKind?: ValueKind })[valueKindKey]
    : undefined;
}

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
  for (const [key, item] of Object.entries(value)) result[key] = clone(item, seen);

  const kind = kindOf(value);
  return (kind === undefined ? result : brand(result, kind)) as T;
}
