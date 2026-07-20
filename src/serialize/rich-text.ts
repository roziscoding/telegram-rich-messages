import type { Child, Node } from "../jsx-runtime.js";
import type { RichText } from "../types.js";
import { flatten } from "./common.js";

type RichTextSerializer = (value: Node) => RichText;

function serializeNestedText(value: Node): RichText {
  return { type: value.kind, text: richText(value.props.children as Child) };
}

const richTextSerializers = new Map<string, RichTextSerializer>([
  ...["bold", "italic", "underline", "strikethrough", "spoiler", "subscript", "superscript", "marked", "code"]
    .map((kind): [string, RichTextSerializer] => [kind, serializeNestedText]),
  ["date_time", (value) => ({ type: value.kind, text: richText(value.props.children as Child), unix_time: value.props.unixTime, date_time_format: value.props.format })],
  ["text_mention", (value) => ({ type: value.kind, text: richText(value.props.children as Child), user: value.props.user })],
  ["custom_emoji", (value) => ({ type: value.kind, custom_emoji_id: value.props.id, alternative_text: value.props.alt })],
  ["mathematical_expression", (value) => ({ type: value.kind, expression: value.props.expression })],
  ["url", (value) => ({ type: value.kind, text: richText(value.props.children as Child), url: value.props.url })],
  ["email_address", (value) => ({ type: value.kind, text: richText(value.props.children as Child), email_address: value.props.address })],
  ["phone_number", (value) => ({ type: value.kind, text: richText(value.props.children as Child), phone_number: value.props.number })],
  ["bank_card_number", (value) => ({ type: value.kind, text: richText(value.props.children as Child), bank_card_number: value.props.number })],
  ["mention", (value) => ({ type: value.kind, text: richText(value.props.children as Child), username: value.props.username })],
  ["hashtag", (value) => ({ type: value.kind, text: richText(value.props.children as Child), hashtag: value.props.value })],
  ["cashtag", (value) => ({ type: value.kind, text: richText(value.props.children as Child), cashtag: value.props.value })],
  ["bot_command", (value) => ({ type: value.kind, text: richText(value.props.children as Child), bot_command: value.props.command })],
  ["anchor", (value) => ({ type: value.kind, name: value.props.name })],
  ["anchor_link", (value) => ({ type: value.kind, text: richText(value.props.children as Child), anchor_name: value.props.name })],
  ["reference", (value) => ({ type: value.kind, text: richText(value.props.children as Child), name: value.props.name })],
  ["reference_link", (value) => ({ type: value.kind, text: richText(value.props.children as Child), reference_name: value.props.name })],
]);

export function richText(child: Child): RichText {
  const parts: RichText[] = [];
  for (const item of flatten(child)) {
    if (item == null || typeof item === "boolean") continue;
    if (typeof item === "string" || typeof item === "number") {
      const value = String(item);
      const last = parts.at(-1);
      if (typeof last === "string") parts[parts.length - 1] = last + value;
      else parts.push(value);
      continue;
    }
    const serializer = richTextSerializers.get(item.kind);
    if (!serializer) throw new TypeError(`Expected rich text, received <${item.kind}>`);
    parts.push(serializer(item));
  }
  return parts.length === 1 ? parts[0]! : parts;
}
