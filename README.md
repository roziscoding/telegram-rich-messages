# Rich messages for grammY

This library builds [Telegram Bot API rich messages](https://core.telegram.org/bots/api#rich-messages) for [grammY](https://grammy.dev). It lets you compose the full rich-message tree — headings, tables, media, quotes, and every rich-text entity — with a declarative, type-safe API, then send it through grammY's `ctx.replyWithRichMessage`.

With this library, you can:

- Compose rich messages with typed **functions**, a **chaining** builder, **TSX**, or any mix of the three
- Get compile-time hierarchy checks — invalid nesting (a paragraph where a table row belongs) is a type error
- Rely on runtime validation for JavaScript, casts, and TSX composition, where the compiler can't help
- Cover every rich-message block and rich-text entity in `grammy/types`

It is built directly on grammY's own [`grammy/types`](https://grammy.dev), so builders return those exact objects — no React, no virtual DOM, nothing to unwrap before sending. The library is compatible with both Deno and Node.js.

## Installation

```sh
npm i grammy-rich-messages
```

On Deno, import from `deno.land/x`:

```ts
import { richMessage } from "https://deno.land/x/grammy_rich_messages/core.ts";
```

`grammy` is a peer dependency; install it alongside this library when sending messages through a bot.

## Quickstart

This library only builds the message object. grammY already exposes the Bot API's `ctx.replyWithRichMessage`, so composing and sending stay separate — compose with any of the APIs below, then hand the result to grammY:

```tsx
import { Bot } from "grammy";
import { Bold, Paragraph, richMessage } from "grammy-rich-messages/components";

const bot = new Bot(process.env.TELEGRAM_TOKEN!);

bot.command("start", (ctx) =>
    ctx.replyWithRichMessage(
        richMessage(
            <Paragraph>
                Hello, <Bold>{ctx.from?.first_name ?? "there"}!</Bold>
            </Paragraph>,
        ),
    ));

bot.start();
```

`richMessage` is the message root. Give it blocks — from functions, TSX, or a mix — and it returns an `InputRichMessage` ready to send; hand it an already-composed rich message and it validates and returns it unchanged. A `RichMessage` chaining instance can be passed to `ctx.replyWithRichMessage` directly. The result is a plain `grammy/types` value, so it also works with any other Bot API client.

See [`examples/bot.tsx`](./examples/bot.tsx) for the same handler written with all three APIs.

## The three APIs

Functions, chaining, and TSX all produce the same canonical values and run the same runtime validation. Pick whichever reads best for the message at hand — or combine them.

- **[Functional](#functional):** strongest TypeScript guarantees. Each builder preserves its exact value category, so invalid nesting is caught at compile time. Deeply nested messages can be harder to scan.
- **[Chaining](#chaining):** accumulates canonical blocks method by method, with contextual builders for tables and rows.
- **[TSX](#tsx):** mirrors the message structure and works naturally with arrays, conditions, fragments, and custom components. TypeScript widens JSX to `JSX.Element`, so hierarchy is checked at runtime instead of compile time.

### Functional

```ts
import {
    bold,
    heading,
    paragraph,
    richMessage,
    table,
    tableCell,
    tableRow,
} from "grammy-rich-messages/core";

const message = richMessage(
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

Because each builder keeps its value category, the compiler checks the hierarchy for you:

```ts
table(tableRow(tableCell("valid"))); // ok
table(paragraph("not a row")); // type error
bold(paragraph("not rich text")); // type error
```

The same checks run at runtime for plain JavaScript and for values coming from `any`, `unknown`, or casts.

### Chaining

```ts
import { RichMessage } from "grammy-rich-messages/chaining";
import { bold } from "grammy-rich-messages/core";

const results = [
    { model: "Aster-1", score: 98.4 },
    { model: "Hermes-2", score: 97.1 },
];

const message = new RichMessage({ skipEntityDetection: true })
    .heading("Build report", { size: 1 })
    .paragraph("Status: ", bold("green"))
    .table(
        { bordered: true, caption: "Benchmark" },
        (table) =>
            table
                .row((row) =>
                    row
                        .cell("Model", { header: true })
                        .cell("Score", { header: true, align: "right" })
                )
                .rows(results, (row, result) =>
                    row
                        .cell(result.model)
                        .cell(bold(result.score), { align: "right" })),
    );
```

A `RichMessage` instance `implements InputRichMessage`, so it goes straight to grammY (or any Bot API client) and serializes to the canonical value via `toJSON()`. Every functional block builder has a matching method, including media (`photo`, `video`, …) and containers (`blockQuote`, `collage`, `details`, …). Use `.add(block)` to append any pre-built block, and read the `blocks` getter for a snapshot that later mutations don't change.

### TSX

Point TypeScript at the library's JSX runtime — no React required:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "grammy-rich-messages/jsx"
    }
}
```

`jsxImportSource` only tells the compiler where the JSX runtime lives; the components themselves come from `grammy-rich-messages/components`:

```tsx
import {
    Bold,
    Heading,
    Paragraph,
    richMessage,
    Table,
    TableCell,
    TableRow,
} from "grammy-rich-messages/components";

const message = richMessage(
    { skipEntityDetection: true },
    <Heading size={1}>Build report</Heading>,
    <Paragraph>
        Status: <Bold>green</Bold>
    </Paragraph>,
    <Table bordered>
        <TableRow>
            <TableCell header>Model</TableCell>
            <TableCell header>Score</TableCell>
        </TableRow>
        <TableRow>
            <TableCell>Aster-1</TableCell>
            <TableCell>98.4</TableCell>
        </TableRow>
    </Table>,
);
```

`richMessage` is the root here too: pass block elements as arguments, optionally preceded by an options object. Arrays, fragments, conditional children, and custom components all work as you'd expect.

## Mixing functions and TSX

Functional values can go straight into TSX, and vice versa:

```tsx
import { bold, table, tableCell, tableRow } from "grammy-rich-messages/core";
import { Paragraph, richMessage } from "grammy-rich-messages/components";

richMessage(
    <Paragraph>Generated with TSX.</Paragraph>,
    table(
        { bordered: true },
        tableRow(tableCell(bold("Generated with functions."))),
    ),
);
```

TypeScript widens JSX expressions to `JSX.Element`, so a JSX value entering a strict functional boundary needs a runtime narrowing guard:

```tsx
import { table } from "grammy-rich-messages/core";
import { expectTableRow, TableCell, TableRow } from "grammy-rich-messages/components";

const row = (
    <TableRow>
        <TableCell>hybrid</TableCell>
    </TableRow>
);

table(expectTableRow(row));
```

The guards — `expectRichText`, `expectBlock`, `expectListItem`, `expectTableRow`, `expectTableCell`, and `expectRichMessage` — validate at runtime and narrow the type.

## Entrypoints

| Entrypoint                       | Exports                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `grammy-rich-messages/core`      | Functional builders, the `richMessage` root, and the Telegram types           |
| `grammy-rich-messages/components`| TSX components, the `richMessage` root, and narrowing guards                   |
| `grammy-rich-messages/chaining`  | `RichMessage`, `TableBuilder`, and `TableRowBuilder`                          |

Every TSX component has a lower-camel-case builder in `core`. `core` exports a strict `richMessage` that only accepts block values, so invalid children fail at compile time; `components` exports one that also accepts `JSX.Element` children and validates at runtime. Both return the same value.

| Category    | Components / functions                                                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root        | `richMessage`                                                                                                                                                          |
| Text blocks | `Paragraph`, `Heading`, `Pre`, `Footer`                                                                                                                                |
| Structure   | `Divider`, `MathBlock`, `BlockAnchor`, `List`, `ListItem`, `BlockQuote`, `PullQuote`, `Details`                                                                        |
| Layout      | `Collage`, `Slideshow`, `Table`, `TableRow`, `TableCell`, `Map`                                                                                                        |
| Media       | `Animation`, `Audio`, `Photo`, `Video`, `VoiceNote`                                                                                                                    |
| Styling     | `Bold`, `Italic`, `Underline`, `Strikethrough`, `Spoiler`, `Subscript`, `Superscript`, `Marked`, `Code`                                                                |
| Entities    | `DateTime`, `TextMention`, `CustomEmoji`, `InlineMath`, `Link`, `Email`, `Phone`, `BankCard`, `Mention`, `Hashtag`, `Cashtag`, `BotCommand`, `TextAnchor`, `AnchorLink`, `Reference`, `ReferenceLink` |

Props use camelCase; builders emit the Bot API's snake_case fields immediately. Media builders take a Telegram `InputMedia` payload whose `media` field accepts a `file_id`/URL string or an upload (grammY's `InputFile`).

Builders return `grammy/types` values (`InputRichMessage`, `InputRichBlock`, `RichText`, …) carrying a non-enumerable brand used for the runtime category checks. The brand disappears under `JSON.stringify` and is structurally assignable to the bare grammY type, so results pass straight through. The composition types `RichTextValue`, `BlockValue`, `ListItemValue`, `TableCellValue`, `TableRowValue`, and `RichMessageValue` are exported too.

## Development

```sh
deno task check
deno task test
```

`deno task check` type-checks the source, tests, and examples; `deno task test` runs the suite.

## Scope

This library builds rich-message objects. Sending them — authentication, HTTP calls, retries, webhooks, and polling — is grammY's (or your Bot API client's) job.

## License

MIT
