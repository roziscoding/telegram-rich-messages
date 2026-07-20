import type { InputFile, RichBlockCaption, RichText } from "../deps";
import { kindOf, type BlockValue, type ListItemValue, type RichTextValue, type TableCellValue, type TableRowValue } from "../core/values";

export type OptionalNested<T> = T | boolean | null | undefined | readonly OptionalNested<T>[];
export type RichTextInput = OptionalNested<string | number | RichTextValue>;
export type BlockInput<F = InputFile> = OptionalNested<BlockValue<F>>;
export type ListItemInput<F = InputFile> = OptionalNested<ListItemValue<F>>;
export type TableCellInput = OptionalNested<TableCellValue>;
export type TableRowInput = OptionalNested<TableRowValue>;

export function flattenInputs(values: readonly unknown[]): unknown[] {
  return values.flatMap((value): unknown[] => Array.isArray(value) ? flattenInputs(value) : [value]);
}

function describe(value: unknown): string {
  const kind = kindOf(value);
  if (kind !== undefined) return `<${kind}>`;
  if (typeof value === "object" && value !== null && "type" in value) return `<${String((value as { type: unknown }).type)}>`;
  if (typeof value === "string") return JSON.stringify(value);
  if (value === undefined) return "undefined";
  try { return JSON.stringify(value); } catch { return String(value); }
}

export function richText(values: readonly unknown[], context: string): RichText {
  const parts: RichText[] = [];
  for (const item of flattenInputs(values)) {
    if (item == null || typeof item === "boolean") continue;
    if (typeof item === "string" || typeof item === "number") {
      const text = String(item);
      const last = parts.at(-1);
      if (typeof last === "string") parts[parts.length - 1] = last + text;
      else parts.push(text);
      continue;
    }
    if (kindOf(item) !== "rich-text") {
      throw new TypeError(`${context} only accepts rich-text children, received ${describe(item)}`);
    }
    parts.push(item as RichTextValue);
  }
  return parts.length === 1 ? parts[0]! : parts;
}

function collectBranded<T>(values: readonly unknown[], kind: string, context: string): T[] {
  const result: T[] = [];
  for (const item of flattenInputs(values)) {
    if (item == null || typeof item === "boolean") continue;
    if (typeof item === "string" && item.trim() === "") continue;
    if (kindOf(item) !== kind) throw new TypeError(`${context} only accepts <${kind}> children, received ${describe(item)}`);
    result.push(item as T);
  }
  return result;
}

export function blocks<F = InputFile>(values: readonly unknown[], context: string): BlockValue<F>[] {
  if (context === "richMessage()") {
    const result: BlockValue<F>[] = [];
    for (const item of flattenInputs(values)) {
      if (item == null || typeof item === "boolean") continue;
      if (kindOf(item) !== "block") throw new TypeError("richMessage() only accepts rich-message blocks");
      result.push(item as BlockValue<F>);
    }
    return result;
  }
  return collectBranded<BlockValue<F>>(values, "block", context);
}
export function listItems<F = InputFile>(values: readonly unknown[], context: string): ListItemValue<F>[] {
  return collectBranded<ListItemValue<F>>(values, "list-item", context);
}
export function tableRows(values: readonly unknown[], context: string): TableRowValue[] {
  return collectBranded<TableRowValue>(values, "table-row", context);
}
export function tableCells(values: readonly unknown[], context: string): TableCellValue[] {
  return collectBranded<TableCellValue>(values, "table-cell", context);
}

export function assertNoChildren(children: readonly unknown[], context: string): void {
  const meaningful = flattenInputs(children).filter((child) => child != null && typeof child !== "boolean");
  if (meaningful.length > 0) throw new TypeError(`${context} does not accept children`);
}

function isPossibleInput(value: unknown, category: string, allowPrimitive: boolean): boolean {
  if (value == null || typeof value === "boolean" || Array.isArray(value)) return true;
  if (allowPrimitive && (typeof value === "string" || typeof value === "number")) return true;
  return kindOf(value) !== undefined;
}

export function splitOptions<P extends object, C>(
  first: P | C | undefined,
  rest: readonly C[],
  context: string,
  allowedKeys: readonly string[],
  childCategory: "rich-text" | "block" | "list-item" | "table-cell" | "table-row",
  allowPrimitive = false,
): readonly [P | undefined, readonly C[]] {
  if (first === undefined) return [undefined, rest];
  if (isPossibleInput(first, childCategory, allowPrimitive)) return [undefined, [first as C, ...rest]];
  if (typeof first !== "object" || first === null) return [undefined, [first as C, ...rest]];
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(first)) {
    if (!allowed.has(key)) throw new TypeError(`${context} received unknown option ${JSON.stringify(key)}`);
  }
  return [first as P, rest];
}

export function caption(options: { caption?: unknown; credit?: unknown }, context: string): RichBlockCaption | undefined {
  if (options.caption === undefined) {
    if (options.credit !== undefined) throw new TypeError(`${context} credit requires caption text`);
    return undefined;
  }
  return {
    text: richText([options.caption], `${context} caption`),
    ...(options.credit === undefined ? {} : { credit: richText([options.credit], `${context} credit`) }),
  };
}
