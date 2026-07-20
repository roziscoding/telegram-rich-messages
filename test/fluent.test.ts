import { expect, test } from "bun:test";
import {
  RichMessageBuilder,
  TableBuilder,
} from "../src/builder.js";
import {
  bold,
  paragraph,
  type InputRichBlockParagraph,
  type InputRichMessage,
  type RichBlockTableCell,
} from "../src/core.js";

const results = [
  { model: "Aster-1", score: 98.4 },
  { model: "Hermes-2", score: 97.1 },
];

test("fluent builders accumulate canonical blocks through contextual table builders", () => {
  const builder = new RichMessageBuilder({ skipEntityDetection: true })
    .heading("Build report", { size: 1 })
    .paragraph("Status: ", bold("green"))
    .table(
      { bordered: true, caption: "Benchmark" },
      table => table
        .row(row => row
          .cell("Model", { header: true })
          .cell("Score", { header: true, align: "right" }),
        )
        .rows(results, (row, result) => row
          .cell(result.model)
          .cell(bold(result.score), { align: "right" }),
        ),
    );

  const input: InputRichMessage = builder.build();

  expect(JSON.parse(JSON.stringify(input))).toEqual({
    blocks: [
      { type: "heading", text: "Build report", size: 1 },
      { type: "paragraph", text: ["Status: ", { type: "bold", text: "green" }] },
      {
        type: "table",
        cells: [
          [
            { text: "Model", align: "left", valign: "top", is_header: true },
            { text: "Score", align: "right", valign: "top", is_header: true },
          ],
          [
            { text: "Aster-1", align: "left", valign: "top" },
            { text: { type: "bold", text: "98.4" }, align: "right", valign: "top" },
          ],
          [
            { text: "Hermes-2", align: "left", valign: "top" },
            { text: { type: "bold", text: "97.1" }, align: "right", valign: "top" },
          ],
        ],
        is_bordered: true,
        caption: "Benchmark",
      },
    ],
    skip_entity_detection: true,
  });
});

test("fluent builds and block snapshots do not change retroactively", () => {
  const external = paragraph("first");
  const builder = new RichMessageBuilder().add(external);
  const blocks = builder.blocks;
  const first = builder.build();

  external.text = "external input mutation";
  (blocks[0] as InputRichBlockParagraph).text = "external snapshot mutation";
  (first.blocks[0] as InputRichBlockParagraph).text = "old build mutation";

  builder.paragraph("second");
  const second = builder.build();

  expect(blocks).toHaveLength(1);
  expect(first.blocks).toHaveLength(1);
  expect(second.blocks).toHaveLength(2);
  expect((second.blocks[0] as InputRichBlockParagraph).text).toBe("first");
});

test("table builds and row snapshots do not share mutable cells", () => {
  const builder = new TableBuilder().row(row => row.cell("first"));
  const rows = builder.rowValues;
  const first = builder.build();

  rows[0]!.cells[0]!.text = "row snapshot mutation";
  (first.cells[0]![0] as RichBlockTableCell).text = "old table mutation";

  const second = builder.build();
  expect(second.cells[0]![0]!.text).toBe("first");
});

test("fluent builders preserve runtime hierarchy validation", () => {
  expect(() => new RichMessageBuilder().add(bold("not a block") as never))
    .toThrow("RichMessageBuilder.add() only accepts <block>");
});
