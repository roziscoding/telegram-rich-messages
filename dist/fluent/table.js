import { table, tableCell, tableRow, } from "../functions/blocks.js";
import { cloneValue } from "../values.js";
export class TableRowBuilder {
    #cells = [];
    get cells() {
        return cloneValue(this.#cells);
    }
    cell(content, options = {}) {
        const value = content === undefined ? tableCell(options) : tableCell(options, content);
        this.#cells.push(cloneValue(value));
        return this;
    }
    build() {
        return tableRow(...cloneValue(this.#cells));
    }
}
export class TableBuilder {
    #options;
    #rows = [];
    constructor(options = {}) {
        this.#options = cloneValue(options);
    }
    get rowValues() {
        return cloneValue(this.#rows);
    }
    row(configure) {
        const row = new TableRowBuilder();
        configure(row);
        this.#rows.push(row.build());
        return this;
    }
    rows(items, configure) {
        let index = 0;
        for (const item of items) {
            const row = new TableRowBuilder();
            configure(row, item, index++);
            this.#rows.push(row.build());
        }
        return this;
    }
    build() {
        return table(cloneValue(this.#options), ...cloneValue(this.#rows));
    }
}
//# sourceMappingURL=table.js.map