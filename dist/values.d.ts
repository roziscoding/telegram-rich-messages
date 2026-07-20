import type { InputRichBlock, InputRichMessageBlocks, RichBlockListItem, RichBlockTableCell, RichTextEntity } from "./types.js";
type ValueKind = "rich-text" | "block" | "list-item" | "table-cell" | "table-row" | "rich-message";
export type BrandedValue<T, K extends ValueKind> = T & {
    readonly __telegramRichMessagesValueKind: K;
};
export type RichTextValue<T extends RichTextEntity = RichTextEntity> = BrandedValue<T, "rich-text">;
export type BlockValue<T extends InputRichBlock = InputRichBlock> = BrandedValue<T, "block">;
export type ListItemValue = BrandedValue<RichBlockListItem, "list-item">;
export type TableCellValue = BrandedValue<RichBlockTableCell, "table-cell">;
export type RichMessageValue = BrandedValue<InputRichMessageBlocks, "rich-message">;
export interface TableRowValue {
    readonly cells: TableCellValue[];
    readonly __telegramRichMessagesValueKind: "table-row";
}
export declare function brand<T extends object, K extends ValueKind>(value: T, kind: K): BrandedValue<T, K>;
export declare function kindOf(value: unknown): ValueKind | undefined;
export declare function cloneValue<T>(value: T): T;
export {};
//# sourceMappingURL=values.d.ts.map