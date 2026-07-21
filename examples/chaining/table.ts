import { bold } from "../../src/core.ts";
import { RichMessage } from "../../src/chaining.ts";

// The chaining table() method takes a configurator that receives a TableBuilder.
// Each row() gets a TableRowBuilder whose cell() calls accept content and
// per-cell options.
export const withTable = new RichMessage()
    .paragraph("Latest benchmark results:")
    .table({ bordered: true, caption: bold("Q3 leaderboard") }, (t) =>
        t
            .row((r) =>
                r
                    .cell("Model", { header: true })
                    .cell("Score", { header: true, align: "right" })
            )
            .row((r) =>
                r
                    .cell("Aster-1")
                    .cell("98.4", { align: "right" })
            )
            .row((r) =>
                r
                    .cell("Aster-mini")
                    .cell("91.2", { align: "right" })
            ));

export const withTableJson = JSON.stringify(withTable);
