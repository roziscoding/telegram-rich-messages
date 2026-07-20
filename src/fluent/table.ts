import {
    table,
    tableCell,
    type TableCellOptions,
    type TableOptions,
    tableRow,
} from "../core/blocks.ts";
import type { RichTextInput } from "../core/text.ts";
import {
    type BlockValue,
    cloneValue,
    type TableCellValue,
    type TableRowValue,
} from "../core/values.ts";
import type { InputRichBlockTable } from "../deps.deno.ts";

export type TableRowConfigurator = (row: TableRowBuilder) => unknown;
export type TableConfigurator = (table: TableBuilder) => unknown;

export class TableRowBuilder {
    readonly #cells: TableCellValue[] = [];

    get cells(): readonly TableCellValue[] {
        return cloneValue(this.#cells);
    }

    cell(content?: RichTextInput, options: TableCellOptions = {}): this {
        const value = content === undefined
            ? tableCell(options)
            : tableCell(options, content);
        this.#cells.push(cloneValue(value));
        return this;
    }

    build(): TableRowValue {
        return tableRow(...cloneValue(this.#cells));
    }
}

export class TableBuilder {
    readonly #options: TableOptions;
    readonly #rows: TableRowValue[] = [];

    constructor(options: TableOptions = {}) {
        this.#options = cloneValue(options);
    }

    get rowValues(): readonly TableRowValue[] {
        return cloneValue(this.#rows);
    }

    row(configure: TableRowConfigurator): this {
        const row = new TableRowBuilder();
        configure(row);
        this.#rows.push(row.build());
        return this;
    }

    rows<T>(
        items: Iterable<T>,
        configure: (row: TableRowBuilder, item: T, index: number) => unknown,
    ): this {
        let index = 0;
        for (const item of items) {
            const row = new TableRowBuilder();
            configure(row, item, index++);
            this.#rows.push(row.build());
        }
        return this;
    }

    build(): BlockValue<InputRichBlockTable> {
        return table(cloneValue(this.#options), ...cloneValue(this.#rows));
    }
}
