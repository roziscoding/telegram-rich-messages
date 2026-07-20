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

export function expectRichText(value: unknown): RichTextValue {
    if (kindOf(value) !== "rich-text") {
        throw new TypeError("expectRichText() expects a rich-text element");
    }
    return value as RichTextValue;
}
export function expectBlock(value: unknown): BlockValue {
    expectKind(value, "block", "expectBlock()");
    return value as BlockValue;
}
export function expectListItem(value: unknown): ListItemValue {
    expectKind(value, "list-item", "expectListItem()");
    return value as ListItemValue;
}
export function expectTableRow(value: unknown): TableRowValue {
    if (kindOf(value) !== "table-row") {
        throw new TypeError("expectTableRow() only accepts <table-row>");
    }
    return value as TableRowValue;
}
export function expectTableCell(value: unknown): TableCellValue {
    expectKind(value, "table-cell", "expectTableCell()");
    return value as TableCellValue;
}
export function expectRichMessage(value: unknown): RichMessageValue {
    if (kindOf(value) !== "rich-message") {
        throw new TypeError("expectRichMessage() expects a <RichMessage> root");
    }
    return value as RichMessageValue;
}
