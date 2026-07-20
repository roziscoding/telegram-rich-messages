import type {
  InputRichBlock,
  InputRichMessageBlocks,
  RichBlockListItem,
  RichBlockTableCell,
  RichTextEntity,
} from "./types.js";

const valueKindKey = "__telegramRichMessagesValueKind" as const;
type ValueKind = "rich-text" | "block" | "list-item" | "table-cell" | "table-row" | "rich-message";
export type BrandedValue<T, K extends ValueKind> = T & { readonly __telegramRichMessagesValueKind: K };

export type RichTextValue<T extends RichTextEntity = RichTextEntity> = BrandedValue<T, "rich-text">;
export type BlockValue<T extends InputRichBlock = InputRichBlock> = BrandedValue<T, "block">;
export type ListItemValue = BrandedValue<RichBlockListItem, "list-item">;
export type TableCellValue = BrandedValue<RichBlockTableCell, "table-cell">;
export type RichMessageValue = BrandedValue<InputRichMessageBlocks, "rich-message">;

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
