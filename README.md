# grammy-rich-messages

Rich message plugin for the [grammY](https://grammy.dev) Telegram bot framework. Compose [Telegram Bot API rich messages](https://core.telegram.org/bots/api#rich-messages) with typed functions, a fluent builder, TSX, or any combination, then send them with a single `ctx.replyRich(...)`.

- Adds `ctx.replyRich` to grammY through a small middleware; the composition API also works standalone with any Bot API client
- Built on grammY's own [`grammy/types`](https://grammy.dev) — builders return those exact objects, ready to send with grammY or any Bot API client
- No React or virtual DOM
- Compile-time hierarchy checks with functional builders
- Runtime validation for JavaScript, casts, and TSX composition
- Covers every rich-message block and rich-text entity in `grammy/types`

## Installation

```sh
npm install grammy-rich-messages
```

Deno consumers import from deno.land/x:

```ts
import { richMessages } from "https://deno.land/x/grammy_rich_messages/mod.ts";
```

`grammy` is a peer dependency; install it alongside the plugin when sending messages through a bot.

## Plugin

Register the `richMessages` middleware, then reply with any composed value — a functional builder, a `RichMessage` fluent instance, or TSX — through `ctx.replyRich`:

```tsx
import { Bot } from "grammy";
import { richMessages, type RichMessagesFlavor } from "grammy-rich-messages";
import { Bold, Paragraph, RichMessage } from "grammy-rich-messages/components";

const bot = new Bot<RichMessagesFlavor>(process.env.TELEGRAM_TOKEN!);

bot.use(richMessages);

bot.command("start", (ctx) =>
    ctx.replyRich(
        <RichMessage>
            <Paragraph>
                Hello, <Bold>{ctx.from?.first_name ?? "there"}!</Bold>
            </Paragraph>
        </RichMessage>,
    )
);

bot.start();
```

`RichMessagesFlavor` extends the context with `replyRich(message)`, which accepts an `InputRichMessage` or a TSX `JSX.Element` and sends it as a rich message. Without the plugin you can still build values and send them yourself with any Bot API client.

See [`examples/bot.tsx`](./examples/bot.tsx) for the same handler written with the functional, fluent, and TSX APIs.

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
} from "grammy-rich-messages/core";

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
table(paragraph("not a row")); // type error
bold(paragraph("not rich text")); // type error
```

The same checks run at runtime for JavaScript and values coming from `any`, `unknown`, or casts.

### Fluent API

```ts
import { RichMessage } from "grammy-rich-messages/fluent";
import { bold } from "grammy-rich-messages/core";

const results = [
    { model: "Aster-1", score: 98.4 },
    { model: "Hermes-2", score: 97.1 },
];

const input = new RichMessage({ skipEntityDetection: true })
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

A `RichMessage` instance `implements InputRichMessage`, so it can be passed straight to grammY (or any Bot API client); its `toJSON()` produces the canonical value on serialization. Every functional block builder has a matching method, including media (`photo`, `video`, …) and containers (`blockQuote`, `collage`, `details`, …). Use `.add(block)` to append any pre-built block value. The `blocks` getter returns a snapshot; later mutations do not change earlier results.

### TSX

Point TypeScript at the package's JSX runtime:

```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "grammy-rich-messages/jsx"
    }
}
```

`jsxImportSource` only tells the compiler where the JSX runtime lives; the components themselves are imported from `grammy-rich-messages/components`. Use `.tsx` files without installing React:

```tsx
import {
    Bold,
    expectRichMessage,
    Heading,
    Paragraph,
    RichMessage,
    Table,
    TableCell,
    TableRow,
} from "grammy-rich-messages/components";

const input = expectRichMessage(
    <RichMessage skipEntityDetection>
        <Heading size={1}>Build report</Heading>
        <Paragraph>
            Status: <Bold>green</Bold>
        </Paragraph>

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
import { bold, table, tableCell, tableRow } from "grammy-rich-messages/core";
import { Paragraph, RichMessage } from "grammy-rich-messages/components";

<RichMessage>
    <Paragraph>Generated with TSX.</Paragraph>
    {table(
        { bordered: true },
        tableRow(tableCell(bold("Generated with functions."))),
    )}
</RichMessage>;
```

TypeScript widens JSX expressions to `JSX.Element`. Use a runtime narrowing guard when a JSX value needs to enter a strict functional boundary:

```tsx
import { bold, richMessage, table } from "grammy-rich-messages/core";
import {
    expectTableRow,
    TableCell,
    TableRow,
} from "grammy-rich-messages/components";

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

The package has four public entrypoints:

- `grammy-rich-messages` — the grammY plugin: the `richMessages` middleware and `RichMessagesFlavor`
- `grammy-rich-messages/core` — functional builders and the Telegram types (re-exported from `grammy/types`)
- `grammy-rich-messages/components` — TSX components and narrowing guards
- `grammy-rich-messages/fluent` — `RichMessage`, `TableBuilder`, and `TableRowBuilder`

Every TSX component has a lower-camel-case builder in `core`.

| Category    | TSX                                                                                                                                                                                                   | Functions                                                                                                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root        | `RichMessage`                                                                                                                                                                                         | `richMessage`                                                                                                                                                                                         |
| Text blocks | `Paragraph`, `Heading`, `Pre`, `Footer`                                                                                                                                                               | `paragraph`, `heading`, `pre`, `footer`                                                                                                                                                               |
| Structure   | `Divider`, `MathBlock`, `BlockAnchor`, `List`, `ListItem`, `BlockQuote`, `PullQuote`, `Details`                                                                                                       | `divider`, `mathBlock`, `blockAnchor`, `list`, `listItem`, `blockQuote`, `pullQuote`, `details`                                                                                                       |
| Layout      | `Collage`, `Slideshow`, `Table`, `TableRow`, `TableCell`, `Map`                                                                                                                                       | `collage`, `slideshow`, `table`, `tableRow`, `tableCell`, `map`                                                                                                                                       |
| Media       | `Animation`, `Audio`, `Photo`, `Video`, `VoiceNote`                                                                                                                                                   | `animation`, `audio`, `photo`, `video`, `voiceNote`                                                                                                                                                   |
| Styling     | `Bold`, `Italic`, `Underline`, `Strikethrough`, `Spoiler`, `Subscript`, `Superscript`, `Marked`, `Code`                                                                                               | `bold`, `italic`, `underline`, `strikethrough`, `spoiler`, `subscript`, `superscript`, `marked`, `code`                                                                                               |
| Entities    | `DateTime`, `TextMention`, `CustomEmoji`, `InlineMath`, `Link`, `Email`, `Phone`, `BankCard`, `Mention`, `Hashtag`, `Cashtag`, `BotCommand`, `TextAnchor`, `AnchorLink`, `Reference`, `ReferenceLink` | `dateTime`, `textMention`, `customEmoji`, `inlineMath`, `link`, `email`, `phone`, `bankCard`, `mention`, `hashtag`, `cashtag`, `botCommand`, `textAnchor`, `anchorLink`, `reference`, `referenceLink` |

Props use camelCase. Builders immediately produce the Bot API's snake_case fields.

### Types

Builders return `grammy/types` values — `InputRichMessage`, `InputRichBlock`, `RichText`, and friends — carrying a non-enumerable brand used for runtime category checks. The brand disappears in `JSON.stringify` and is structurally assignable to the bare grammY type, so a result passes straight to grammY (or any Bot API client) unchanged. These Telegram types are re-exported from `grammy-rich-messages/core`.

Media builders take a Telegram `InputMedia` payload; its `media` field accepts an upload (grammY's `InputFile`) or a file_id/URL string.

Public composition types include `RichTextValue`, `BlockValue`, `ListItemValue`, `TableCellValue`, `TableRowValue`, and `RichMessageValue`.

## Development

```sh
deno task check
deno task test
```

`deno task check` type-checks the source, tests, and examples; `deno task test` runs the test suite.

## Scope

This package builds rich-message objects and adds a thin grammY plugin to send them. Authentication, HTTP calls, retries, webhooks, and polling remain grammY's responsibility.

## License

MIT
