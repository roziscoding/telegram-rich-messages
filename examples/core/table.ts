import {
    bold,
    paragraph,
    richMessage,
    table,
    tableCell,
    tableRow,
} from "../../src/core.ts";

// A table block is a grid of rows, each row a list of cells. Header cells,
// alignment, and table-level options (bordered/striped/caption) are all
// expressed through the builder options.
export const withTable = richMessage(
    paragraph("Latest benchmark results:"),
    table(
        { bordered: true, caption: bold("Q3 leaderboard") },
        tableRow(
            tableCell({ header: true }, "Model"),
            tableCell({ header: true, align: "right" }, "Score"),
        ),
        tableRow(
            tableCell("Aster-1"),
            tableCell({ align: "right" }, "98.4"),
        ),
        tableRow(
            tableCell("Aster-mini"),
            tableCell({ align: "right" }, "91.2"),
        ),
    ),
);

export const withTableJson = JSON.stringify(withTable);
