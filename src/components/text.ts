import { node, type ChildrenProps, type NoChildrenProps } from "./shared.js";

export function Bold(props: ChildrenProps) { return node("bold", props); }
export function Italic(props: ChildrenProps) { return node("italic", props); }
export function Underline(props: ChildrenProps) { return node("underline", props); }
export function Strikethrough(props: ChildrenProps) { return node("strikethrough", props); }
export function Spoiler(props: ChildrenProps) { return node("spoiler", props); }
export function Subscript(props: ChildrenProps) { return node("subscript", props); }
export function Superscript(props: ChildrenProps) { return node("superscript", props); }
export function Marked(props: ChildrenProps) { return node("marked", props); }
export function Code(props: ChildrenProps) { return node("code", props); }
export function DateTime(props: ChildrenProps & { unixTime: number; format: string }) { return node("date_time", props); }
export function TextMention(props: ChildrenProps & { user: Record<string, unknown> }) { return node("text_mention", props); }
export function CustomEmoji(props: { id: string; alt: string } & NoChildrenProps) { return node("custom_emoji", props); }
export function InlineMath(props: { expression: string } & NoChildrenProps) { return node("mathematical_expression", props); }
export function Link(props: ChildrenProps & { url: string }) { return node("url", props); }
export function Email(props: ChildrenProps & { address: string }) { return node("email_address", props); }
export function Phone(props: ChildrenProps & { number: string }) { return node("phone_number", props); }
export function BankCard(props: ChildrenProps & { number: string }) { return node("bank_card_number", props); }
export function Mention(props: ChildrenProps & { username: string }) { return node("mention", props); }
export function Hashtag(props: ChildrenProps & { value: string }) { return node("hashtag", props); }
export function Cashtag(props: ChildrenProps & { value: string }) { return node("cashtag", props); }
export function BotCommand(props: ChildrenProps & { command: string }) { return node("bot_command", props); }
export function TextAnchor(props: { name: string } & NoChildrenProps) { return node("anchor", props); }
export function AnchorLink(props: ChildrenProps & { name: string }) { return node("anchor_link", props); }
export function Reference(props: ChildrenProps & { name: string }) { return node("reference", props); }
export function ReferenceLink(props: ChildrenProps & { name: string }) { return node("reference_link", props); }
