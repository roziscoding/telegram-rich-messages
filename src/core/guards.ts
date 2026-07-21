import {
    type BlockValue,
    kindOf,
    type ListItemValue,
    type RichMessageValue,
    type RichTextValue,
    type TableCellValue,
    type TableRowValue,
} from "../core/values.ts";

function expectKind<K extends ReturnType<typeof kindOf>>(
    value: unknown,
    kind: K,
    context: string,
): asserts value is object {
    if (kindOf(value) !== kind) {
        throw new TypeError(`${context} expects <${kind}>`);
    }
}

/**
 * Asserts that `value` is a {@link RichTextValue}, narrowing its type. The
 * category is validated at runtime and a `TypeError` is thrown if the value
 * is not rich-text. Used to bring loosely-typed TSX / `JSX.Element` values
 * into strict functional boundaries.
 *
 * @param value The value to check
 * @returns the same value typed as a {@link RichTextValue}
 */
export function expectRichText(value: unknown): RichTextValue {
    if (kindOf(value) !== "rich-text") {
        throw new TypeError("expectRichText() expects a rich-text element");
    }
    return value as RichTextValue;
}
/**
 * Asserts that `value` is a {@link BlockValue}, narrowing its type. The
 * category is validated at runtime and a `TypeError` is thrown if the value
 * is not a block. Used to bring loosely-typed TSX / `JSX.Element` values into
 * strict functional boundaries.
 *
 * @param value The value to check
 * @returns the same value typed as a {@link BlockValue}
 */
export function expectBlock(value: unknown): BlockValue {
    expectKind(value, "block", "expectBlock()");
    return value as BlockValue;
}
/**
 * Asserts that `value` is a {@link ListItemValue}, narrowing its type. The
 * category is validated at runtime and a `TypeError` is thrown if the value
 * is not a list item. Used to bring loosely-typed TSX / `JSX.Element` values
 * into strict functional boundaries.
 *
 * @param value The value to check
 * @returns the same value typed as a {@link ListItemValue}
 */
export function expectListItem(value: unknown): ListItemValue {
    expectKind(value, "list-item", "expectListItem()");
    return value as ListItemValue;
}
/**
 * Asserts that `value` is a {@link TableRowValue}, narrowing its type. The
 * category is validated at runtime and a `TypeError` is thrown if the value
 * is not a table row. Used to bring loosely-typed TSX / `JSX.Element` values
 * into strict functional boundaries.
 *
 * @param value The value to check
 * @returns the same value typed as a {@link TableRowValue}
 */
export function expectTableRow(value: unknown): TableRowValue {
    if (kindOf(value) !== "table-row") {
        throw new TypeError("expectTableRow() only accepts <table-row>");
    }
    return value as TableRowValue;
}
/**
 * Asserts that `value` is a {@link TableCellValue}, narrowing its type. The
 * category is validated at runtime and a `TypeError` is thrown if the value
 * is not a table cell. Used to bring loosely-typed TSX / `JSX.Element` values
 * into strict functional boundaries.
 *
 * @param value The value to check
 * @returns the same value typed as a {@link TableCellValue}
 */
export function expectTableCell(value: unknown): TableCellValue {
    expectKind(value, "table-cell", "expectTableCell()");
    return value as TableCellValue;
}
/**
 * Asserts that `value` is a {@link RichMessageValue}, narrowing its type. The
 * category is validated at runtime and a `TypeError` is thrown if the value
 * is not a {@link richMessage} root. Used to bring loosely-typed TSX /
 * `JSX.Element` values into strict functional boundaries.
 *
 * @param value The value to check
 * @returns the same value typed as a {@link RichMessageValue}
 */
export function expectRichMessage(value: unknown): RichMessageValue {
    if (kindOf(value) !== "rich-message") {
        throw new TypeError("expectRichMessage() expects a richMessage() root");
    }
    return value as RichMessageValue;
}
