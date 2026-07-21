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

/**
 * Callback that populates a {@link TableRowBuilder}. Receives the row builder
 * so cells can be appended via chained {@link TableRowBuilder.cell} calls; the
 * return value is ignored.
 */
export type TableRowConfigurator = (row: TableRowBuilder) => unknown;

/**
 * Callback that populates a {@link TableBuilder}. Receives the table builder so
 * rows can be appended via {@link TableBuilder.row} or {@link TableBuilder.rows};
 * the return value is ignored.
 */
export type TableConfigurator = (table: TableBuilder) => unknown;

/**
 * Builds a single table row by accumulating cell values through chainable
 * method calls, then materializes them into a canonical `TableRowValue`.
 */
export class TableRowBuilder {
    readonly #cells: TableCellValue[] = [];

    /**
     * A snapshot of the cell values appended so far. The returned array is a
     * clone, so later {@link cell} calls do not affect earlier snapshots.
     */
    get cells(): readonly TableCellValue[] {
        return cloneValue(this.#cells);
    }

    /**
     * Appends a cell to the row.
     *
     * @param content Rich text for the cell; omit for an empty cell
     * @param options Cell options such as alignment or header flag
     * @returns this for chaining
     */
    cell(content?: RichTextInput, options: TableCellOptions = {}): this {
        const value = content === undefined
            ? tableCell(options)
            : tableCell(options, content);
        this.#cells.push(cloneValue(value));
        return this;
    }

    /**
     * Materializes the accumulated cells into a canonical `TableRowValue`.
     *
     * @returns the row value built from the appended cells
     */
    build(): TableRowValue {
        return tableRow(...cloneValue(this.#cells));
    }
}

/**
 * Builds a table by accumulating row values through chainable method calls,
 * then materializes them into a canonical table block value.
 */
export class TableBuilder {
    readonly #options: TableOptions;
    readonly #rows: TableRowValue[] = [];

    /**
     * Creates a table builder.
     *
     * @param options Table options applied when the block is built
     */
    constructor(options: TableOptions = {}) {
        this.#options = cloneValue(options);
    }

    /**
     * A snapshot of the row values appended so far. The returned array is a
     * clone, so later {@link row} or {@link rows} calls do not affect earlier
     * snapshots.
     */
    get rowValues(): readonly TableRowValue[] {
        return cloneValue(this.#rows);
    }

    /**
     * Appends a row built by the given configurator. The callback receives a
     * fresh {@link TableRowBuilder} to populate with cells.
     *
     * @param configure Callback that populates the row builder
     * @returns this for chaining
     */
    row(configure: TableRowConfigurator): this {
        const row = new TableRowBuilder();
        configure(row);
        this.#rows.push(row.build());
        return this;
    }

    /**
     * Maps an iterable of items to rows, appending one row per item. For each
     * item the callback receives a fresh {@link TableRowBuilder}, the item, and
     * its zero-based index.
     *
     * @param items Items to turn into rows
     * @param configure Callback invoked once per item to populate its row
     * @returns this for chaining
     */
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

    /**
     * Materializes the accumulated rows and options into a canonical table
     * block value.
     *
     * @returns the table block value
     */
    build(): BlockValue<InputRichBlockTable> {
        return table(cloneValue(this.#options), ...cloneValue(this.#rows));
    }
}
