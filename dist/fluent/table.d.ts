import { type TableCellOptions, type TableOptions } from "../functions/blocks.js";
import type { RichTextInput } from "../functions/text.js";
import { type BlockValue, type TableCellValue, type TableRowValue } from "../values.js";
import type { InputRichBlockTable } from "../types.js";
export type TableRowConfigurator = (row: TableRowBuilder) => unknown;
export type TableConfigurator = (table: TableBuilder) => unknown;
export declare class TableRowBuilder {
    #private;
    get cells(): readonly TableCellValue[];
    cell(content?: RichTextInput, options?: TableCellOptions): this;
    build(): TableRowValue;
}
export declare class TableBuilder {
    #private;
    constructor(options?: TableOptions);
    get rowValues(): readonly TableRowValue[];
    row(configure: TableRowConfigurator): this;
    rows<T>(items: Iterable<T>, configure: (row: TableRowBuilder, item: T, index: number) => unknown): this;
    build(): BlockValue<InputRichBlockTable>;
}
//# sourceMappingURL=table.d.ts.map