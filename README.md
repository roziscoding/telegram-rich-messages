# telegram-rich-messages

Compose [Telegram Bot API rich messages](https://core.telegram.org/bots/api#rich-messages) with type-safe TSX, then render them to an `InputRichMessage` object.

- **No React** and no virtual DOM
- **No bot framework** and no Bot API client
- Covers all Bot API 10.2 input rich-text entities and block types
- Produces plain JSON-ready objects for `sendRichMessage`, `sendRichMessageDraft`, `editMessageText`, or `InputRichMessageContent`

> This repository is currently private and the package is not published to npm. Install it from GitHub with an account that has access:
>
> ```sh
> npm install github:roziscoding/telegram-rich-messages
> ```

## TypeScript setup

The library provides its own tiny JSX runtime. Point TypeScript at it:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "telegram-rich-messages"
  }
}
```

Use `.tsx` files. There is no React dependency to install.

## Proof of concept

### Text and structure

```tsx
import {
  Bold,
  Details,
  Heading,
  Link,
  List,
  ListItem,
  Paragraph,
  RichMessage,
  render,
} from "telegram-rich-messages";

const richMessage = render(
  <RichMessage skipEntityDetection>
    <Heading size={1}>Build report</Heading>

    <Paragraph>
      Status: <Bold>green</Bold>. See the
      {" "}<Link url="https://example.com/build/42">full report</Link>.
    </Paragraph>

    <List>
      <ListItem checkbox checked>
        <Paragraph>Type-check</Paragraph>
      </ListItem>
      <ListItem checkbox checked>
        <Paragraph>Run tests</Paragraph>
      </ListItem>
    </List>

    <Details summary={<Bold>Artifacts</Bold>}>
      <Paragraph>dist/index.js</Paragraph>
      <Paragraph>dist/index.d.ts</Paragraph>
    </Details>
  </RichMessage>,
);
```

`richMessage` is a plain object ready to use as the Bot API's `rich_message` value:

```json
{
  "blocks": [
    { "type": "heading", "text": "Build report", "size": 1 },
    {
      "type": "paragraph",
      "text": [
        "Status: ",
        { "type": "bold", "text": "green" },
        ". See the ",
        { "type": "url", "text": "full report", "url": "https://example.com/build/42" },
        "."
      ]
    },
    {
      "type": "list",
      "items": [
        {
          "blocks": [{ "type": "paragraph", "text": "Type-check" }],
          "has_checkbox": true,
          "is_checked": true
        },
        {
          "blocks": [{ "type": "paragraph", "text": "Run tests" }],
          "has_checkbox": true,
          "is_checked": true
        }
      ]
    },
    {
      "type": "details",
      "summary": { "type": "bold", "text": "Artifacts" },
      "blocks": [
        { "type": "paragraph", "text": "dist/index.js" },
        { "type": "paragraph", "text": "dist/index.d.ts" }
      ]
    }
  ],
  "skip_entity_detection": true
}
```

### Tables and media blocks

```tsx
import {
  Bold,
  Photo,
  RichMessage,
  Table,
  TableCell,
  TableRow,
  render,
} from "telegram-rich-messages";

const richMessage = render(
  <RichMessage>
    <Table bordered striped caption="Benchmark">
      <TableRow>
        <TableCell header>Model</TableCell>
        <TableCell header align="right">Score</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Aster-1</TableCell>
        <TableCell align="right"><Bold>98.4</Bold></TableCell>
      </TableRow>
    </Table>

    <Photo
      media={{
        type: "photo",
        media: "AgACAgQAAxkBAAIB...",
        has_spoiler: false,
      }}
      caption="Confusion matrix"
      credit="Evaluation suite"
    />
  </RichMessage>,
);

const json = JSON.stringify(richMessage);
```

This example stops at composition and conversion deliberately. Transport, authentication, retries, and Bot API calls belong to the consuming application.

### Dynamic composition

TSX expressions, fragments, arrays, and conditional children work without React:

```tsx
import { Bold, Paragraph, RichMessage, render } from "telegram-rich-messages";

const checks = ["types", "tests", "bundle"];
const includeFooter = true;

const richMessage = render(
  <RichMessage>
    {checks.map((check) => (
      <Paragraph><Bold>{check}</Bold>: passed</Paragraph>
    ))}
    {includeFooter && <Paragraph>Generated automatically.</Paragraph>}
  </RichMessage>,
);
```

## Component map

| Bot API concept | TSX components |
|---|---|
| Root | `RichMessage` |
| Text blocks | `Paragraph`, `Heading`, `Pre`, `Footer`, `Thinking` |
| Structure | `Divider`, `MathBlock`, `BlockAnchor`, `List`, `ListItem`, `BlockQuote`, `PullQuote`, `Details` |
| Layout | `Collage`, `Slideshow`, `Table`, `TableRow`, `TableCell`, `Map` |
| Media | `Animation`, `Audio`, `Photo`, `Video`, `VoiceNote` |
| Text styling | `Bold`, `Italic`, `Underline`, `Strikethrough`, `Spoiler`, `Subscript`, `Superscript`, `Marked`, `Code` |
| Text entities | `DateTime`, `TextMention`, `CustomEmoji`, `InlineMath`, `Link`, `Email`, `Phone`, `BankCard`, `Mention`, `Hashtag`, `Cashtag`, `BotCommand`, `TextAnchor`, `AnchorLink`, `Reference`, `ReferenceLink` |

Component props use idiomatic camelCase; `render()` converts them to the Bot API's snake_case fields. Invalid block nesting and invalid map dimensions are rejected before an object is returned.

> **Draft-only block:** Telegram permits `Thinking` only in `sendRichMessageDraft` payloads. The renderer cannot infer which endpoint will eventually consume the object, so endpoint selection remains the caller's responsibility.

## Development

The source is organized by responsibility:

```text
src/
├── components/   # Public TSX component factories
├── serialize/    # Rich-text and block serializer registries
├── render.ts     # RichMessage root conversion
├── types.ts      # Public Bot API output and media types
├── jsx-runtime.ts
└── index.ts      # Public package exports only
```

```sh
bun install
bun run check
```

`bun run check` builds declarations, type-checks the source/examples/tests, and runs the test suite.

## Scope

This library only composes and converts rich messages. It intentionally contains no HTTP client, token handling, update consumption, webhook code, polling, or dependency on a Telegram bot library.

The implementation follows the official [Bot API rich messages documentation](https://core.telegram.org/bots/api#rich-messages), including the input block entities added in Bot API 10.2.

## License

MIT
