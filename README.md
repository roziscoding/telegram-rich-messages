# telegram-rich-messages

Build [Telegram Bot API rich messages](https://core.telegram.org/bots/api#rich-messages) with typed functions, a fluent builder, TSX, or any combination. Every entrypoint produces canonical Telegram objects directly.

- No React or virtual DOM
- No Bot API client or bot framework
- Compile-time hierarchy checks with functional builders
- Runtime validation for JavaScript, casts, and TSX composition
- Covers the Bot API 10.2 rich-text entities and block types

## Usage

The API can be used with functions, a fluent builder, or TSX. All three create the same canonical values and use the same runtime validation.

- **[Functional API](#functional-api):** provides the strongest TypeScript guarantees because each builder preserves its exact value category, allowing invalid nesting to be caught at compile time. Deeply nested messages, however, can be harder to scan.
- **[Fluent API](#fluent-api):** accumulates canonical blocks directly and uses contextual builders for tables.
- **[TSX](#tsx):** mirrors the message structure and works naturally with arrays, conditions, fragments, and custom components. TypeScript widens JSX expressions to `JSX.Element`, so parent-child hierarchy is checked at runtime instead of compile time.

### Functional API

```ts
import {
  bold,
  heading,
  paragraph,
  richMessage,
  table,
  tableCell,
  tableRow,
} from "telegram-rich-messages/core";

const input = richMessage(
  heading({ size: 1 }, "Build report"),
  paragraph("Status: ", bold("green")),
  table(
    { bordered: true, caption: "Benchmark" },
    tableRow(
      tableCell({ header: true }, "Model"),
      tableCell({ header: true, align: "right" }, "Score"),
    ),
    tableRow(
      tableCell("Aster-1"),
      tableCell({ align: "right" }, bold(98.4)),
    ),
  ),
);
```

Builders preserve their value category, so TypeScript checks the hierarchy:

```ts
table(tableRow(tableCell("valid"))); // valid
table(paragraph("not a row"));       // type error
bold(paragraph("not rich text"));    // type error
```

The same checks run at runtime for JavaScript and values coming from `any`, `unknown`, or casts.

### Fluent API

```ts
import { RichMessageBuilder } from "telegram-rich-messages/builder";
import { bold } from "telegram-rich-messages/core";

const results = [
  { model: "Aster-1", score: 98.4 },
  { model: "Hermes-2", score: 97.1 },
];

const input = new RichMessageBuilder({ skipEntityDetection: true })
  .heading("Build report", { size: 1 })
  .paragraph("Status: ", bold("green"))
  .table(
    { bordered: true, caption: "Benchmark" },
    table => table
      .row(row => row
        .cell("Model", { header: true })
        .cell("Score", { header: true, align: "right" }))
      .rows(results, (row, result) => row
        .cell(result.model)
        .cell(bold(result.score), { align: "right" })),
  )
  .build();
```

`build()` and the `blocks` getter return snapshots; later mutations do not change earlier results. Use `.add(block)` to append any block from the functional API.

### TSX

Point TypeScript at the package's JSX runtime:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "telegram-rich-messages/jsx"
  }
}
```

Then use `.tsx` files without installing React:

```tsx
import {
  Bold,
  Heading,
  Paragraph,
  RichMessage,
  Table,
  TableCell,
  TableRow,
  expectRichMessage,
} from "telegram-rich-messages/jsx";

const input = expectRichMessage(
  <RichMessage skipEntityDetection>
    <Heading size={1}>Build report</Heading>
    <Paragraph>Status: <Bold>green</Bold></Paragraph>

    <Table bordered>
      <TableRow>
        <TableCell header>Model</TableCell>
        <TableCell header>Score</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Aster-1</TableCell>
        <TableCell>98.4</TableCell>
      </TableRow>
    </Table>
  </RichMessage>,
);
```

Arrays, fragments, conditional children, and custom components work normally.

## Mixing functions and TSX

Functional values can go directly inside TSX:

```tsx
import { bold, table, tableCell, tableRow } from "telegram-rich-messages/core";
import { Paragraph, RichMessage } from "telegram-rich-messages/jsx";

<RichMessage>
  <Paragraph>Generated with TSX.</Paragraph>
  {table(
    { bordered: true },
    tableRow(tableCell(bold("Generated with functions."))),
  )}
</RichMessage>
```

TypeScript widens JSX expressions to `JSX.Element`. Use a runtime narrowing guard when a JSX value needs to enter a strict functional boundary:

```tsx
import { bold, richMessage, table } from "telegram-rich-messages/core";
import { TableCell, TableRow, expectTableRow } from "telegram-rich-messages/jsx";

const row = (
  <TableRow>
    <TableCell>{bold("hybrid")}</TableCell>
  </TableRow>
);

const message = richMessage(
  table(expectTableRow(row)),
);
```

Available guards:

- `expectRichText`
- `expectBlock`
- `expectListItem`
- `expectTableRow`
- `expectTableCell`
- `expectRichMessage`

## API

The package has three public entrypoints:

- `telegram-rich-messages/core` — functional builders and canonical Telegram types
- `telegram-rich-messages/jsx` — TSX components and narrowing guards
- `telegram-rich-messages/builder` — `RichMessageBuilder`, `TableBuilder`, and `TableRowBuilder`

Every TSX component has a lower-camel-case builder in `core`.

| Category | TSX | Functions |
|---|---|---|
| Root | `RichMessage` | `richMessage` |
| Text blocks | `Paragraph`, `Heading`, `Pre`, `Footer` | `paragraph`, `heading`, `pre`, `footer` |
| Structure | `Divider`, `MathBlock`, `BlockAnchor`, `List`, `ListItem`, `BlockQuote`, `PullQuote`, `Details` | `divider`, `mathBlock`, `blockAnchor`, `list`, `listItem`, `blockQuote`, `pullQuote`, `details` |
| Layout | `Collage`, `Slideshow`, `Table`, `TableRow`, `TableCell`, `Map` | `collage`, `slideshow`, `table`, `tableRow`, `tableCell`, `map` |
| Media | `Animation`, `Audio`, `Photo`, `Video`, `VoiceNote` | `animation`, `audio`, `photo`, `video`, `voiceNote` |
| Styling | `Bold`, `Italic`, `Underline`, `Strikethrough`, `Spoiler`, `Subscript`, `Superscript`, `Marked`, `Code` | `bold`, `italic`, `underline`, `strikethrough`, `spoiler`, `subscript`, `superscript`, `marked`, `code` |
| Entities | `DateTime`, `TextMention`, `CustomEmoji`, `InlineMath`, `Link`, `Email`, `Phone`, `BankCard`, `Mention`, `Hashtag`, `Cashtag`, `BotCommand`, `TextAnchor`, `AnchorLink`, `Reference`, `ReferenceLink` | `dateTime`, `textMention`, `customEmoji`, `inlineMath`, `link`, `email`, `phone`, `bankCard`, `mention`, `hashtag`, `cashtag`, `botCommand`, `textAnchor`, `anchorLink`, `reference`, `referenceLink` |

Props use camelCase. Builders immediately produce the Bot API's snake_case fields.

Public composition types include `RichTextValue`, `BlockValue`, `ListItemValue`, `TableCellValue`, `TableRowValue`, and `RichMessageValue`.

## Development

```sh
bun install
bun run check
```

`bun run check` builds declarations, type-checks the source and tests, then runs the test suite.

## Scope

This package only builds rich-message objects. Authentication, HTTP calls, retries, webhooks, and polling belong to the consuming application.

## License

MIT
