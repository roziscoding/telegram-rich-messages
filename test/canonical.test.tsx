import { describe, expect, test } from "bun:test";
import {
  AnchorLink,
  BankCard,
  Bold,
  BotCommand,
  Cashtag,
  Code,
  CustomEmoji,
  DateTime,
  Email,
  Hashtag,
  InlineMath,
  Italic,
  Link,
  Marked,
  Mention,
  Paragraph,
  Phone,
  Reference,
  ReferenceLink,
  RichMessage,
  Spoiler,
  Strikethrough,
  Subscript,
  Superscript,
  TextAnchor,
  TextMention,
  Underline,
  expectRichMessage,
} from "../src/jsx.js";

describe("expectRichMessage", () => {
  test("composes text blocks and nested rich text from TSX", () => {
    const output = expectRichMessage(
      <RichMessage skipEntityDetection>
        <Paragraph>Hello, <Bold>Telegram</Bold>!</Paragraph>
      </RichMessage>,
    );

    expect(JSON.parse(JSON.stringify(output))).toEqual({
      blocks: [
        {
          type: "paragraph",
          text: ["Hello, ", { type: "bold", text: "Telegram" }, "!"],
        },
      ],
      skip_entity_detection: true,
    });
  });

  test("builds every rich-text entity with Bot API field names", () => {
    const user = { id: 42, is_bot: false, first_name: "Ada" };
    const output = expectRichMessage(
      <RichMessage>
        <Paragraph>
          <Italic>i</Italic><Underline>u</Underline><Strikethrough>s</Strikethrough>
          <Spoiler>secret</Spoiler><DateTime unixTime={0} format="dd MMM yyyy">epoch</DateTime>
          <TextMention user={user}>Ada</TextMention><Subscript>2</Subscript><Superscript>3</Superscript>
          <Marked>mark</Marked><Code>code</Code><CustomEmoji id="emoji-id" alt="✨" />
          <InlineMath expression="x^2" /><Link url="https://telegram.org">link</Link>
          <Email address="a@example.com">mail</Email><Phone number="+1555">call</Phone>
          <BankCard number="4242">card</BankCard><Mention username="telegram">@telegram</Mention>
          <Hashtag value="bots">#bots</Hashtag><Cashtag value="TON">$TON</Cashtag>
          <BotCommand command="start">/start</BotCommand><TextAnchor name="intro" />
          <AnchorLink name="intro">back</AnchorLink><Reference name="note">note body</Reference>
          <ReferenceLink name="note">[1]</ReferenceLink>
        </Paragraph>
      </RichMessage>,
    );

    const first = output.blocks[0];
    expect(first?.type).toBe("paragraph");
    if (!first || first.type !== "paragraph") throw new Error("expected paragraph output");

    expect(first.text).toEqual([
      { type: "italic", text: "i" }, { type: "underline", text: "u" },
      { type: "strikethrough", text: "s" }, { type: "spoiler", text: "secret" },
      { type: "date_time", text: "epoch", unix_time: 0, date_time_format: "dd MMM yyyy" },
      { type: "text_mention", text: "Ada", user }, { type: "subscript", text: "2" },
      { type: "superscript", text: "3" }, { type: "marked", text: "mark" },
      { type: "code", text: "code" },
      { type: "custom_emoji", custom_emoji_id: "emoji-id", alternative_text: "✨" },
      { type: "mathematical_expression", expression: "x^2" },
      { type: "url", text: "link", url: "https://telegram.org" },
      { type: "email_address", text: "mail", email_address: "a@example.com" },
      { type: "phone_number", text: "call", phone_number: "+1555" },
      { type: "bank_card_number", text: "card", bank_card_number: "4242" },
      { type: "mention", text: "@telegram", username: "telegram" },
      { type: "hashtag", text: "#bots", hashtag: "bots" },
      { type: "cashtag", text: "$TON", cashtag: "TON" },
      { type: "bot_command", text: "/start", bot_command: "start" },
      { type: "anchor", name: "intro" }, { type: "anchor_link", text: "back", anchor_name: "intro" },
      { type: "reference", text: "note body", name: "note" },
      { type: "reference_link", text: "[1]", reference_name: "note" },
    ]);
  });
});
