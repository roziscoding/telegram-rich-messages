import type { Node } from "../jsx-runtime.js";
import { node, type ChildrenProps } from "./shared.js";

export function Bold(props: ChildrenProps): Node { return node("bold", props); }
export function Italic(props: ChildrenProps): Node { return node("italic", props); }
export function Underline(props: ChildrenProps): Node { return node("underline", props); }
export function Strikethrough(props: ChildrenProps): Node { return node("strikethrough", props); }
export function Spoiler(props: ChildrenProps): Node { return node("spoiler", props); }
export function Subscript(props: ChildrenProps): Node { return node("subscript", props); }
export function Superscript(props: ChildrenProps): Node { return node("superscript", props); }
export function Marked(props: ChildrenProps): Node { return node("marked", props); }
export function Code(props: ChildrenProps): Node { return node("code", props); }
export function DateTime(props: ChildrenProps & { unixTime: number; format: string }): Node { return node("date_time", props); }
export function TextMention(props: ChildrenProps & { user: Record<string, unknown> }): Node { return node("text_mention", props); }
export function CustomEmoji(props: { id: string; alt: string }): Node { return node("custom_emoji", props); }
export function InlineMath(props: { expression: string }): Node { return node("mathematical_expression", props); }
export function Link(props: ChildrenProps & { url: string }): Node { return node("url", props); }
export function Email(props: ChildrenProps & { address: string }): Node { return node("email_address", props); }
export function Phone(props: ChildrenProps & { number: string }): Node { return node("phone_number", props); }
export function BankCard(props: ChildrenProps & { number: string }): Node { return node("bank_card_number", props); }
export function Mention(props: ChildrenProps & { username: string }): Node { return node("mention", props); }
export function Hashtag(props: ChildrenProps & { value: string }): Node { return node("hashtag", props); }
export function Cashtag(props: ChildrenProps & { value: string }): Node { return node("cashtag", props); }
export function BotCommand(props: ChildrenProps & { command: string }): Node { return node("bot_command", props); }
export function TextAnchor(props: { name: string }): Node { return node("anchor", props); }
export function AnchorLink(props: ChildrenProps & { name: string }): Node { return node("anchor_link", props); }
export function Reference(props: ChildrenProps & { name: string }): Node { return node("reference", props); }
export function ReferenceLink(props: ChildrenProps & { name: string }): Node { return node("reference_link", props); }
