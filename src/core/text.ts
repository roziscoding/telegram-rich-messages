import type {
    RichText,
    RichTextAnchorLink,
    RichTextBankCardNumber,
    RichTextBotCommand,
    RichTextCashtag,
    RichTextDateTime,
    RichTextEmailAddress,
    RichTextHashtag,
    RichTextMention,
    RichTextPhoneNumber,
    RichTextReference,
    RichTextReferenceLink,
    RichTextTextMention,
    RichTextUrl,
    User,
} from "../deps.deno.ts";
import { brand, type RichTextValue } from "../core/values.ts";
import { assertNoChildren, richText, type RichTextInput } from "./shared.ts";

export type { RichTextInput } from "./shared.ts";

type NestedKind =
    | "bold"
    | "italic"
    | "underline"
    | "strikethrough"
    | "spoiler"
    | "subscript"
    | "superscript"
    | "marked"
    | "code";

function nested<K extends NestedKind>(
    type: K,
    context: string,
    children: readonly RichTextInput[],
): RichTextValue<Extract<RichText, { type: K }>> {
    return brand(
        { type, text: richText(children, context) },
        "rich-text",
    ) as RichTextValue<Extract<RichText, { type: K }>>;
}

export function bold(...children: readonly RichTextInput[]) {
    return nested("bold", "bold()", children);
}
export function italic(...children: readonly RichTextInput[]) {
    return nested("italic", "italic()", children);
}
export function underline(...children: readonly RichTextInput[]) {
    return nested("underline", "underline()", children);
}
export function strikethrough(...children: readonly RichTextInput[]) {
    return nested("strikethrough", "strikethrough()", children);
}
export function spoiler(...children: readonly RichTextInput[]) {
    return nested("spoiler", "spoiler()", children);
}
export function subscript(...children: readonly RichTextInput[]) {
    return nested("subscript", "subscript()", children);
}
export function superscript(...children: readonly RichTextInput[]) {
    return nested("superscript", "superscript()", children);
}
export function marked(...children: readonly RichTextInput[]) {
    return nested("marked", "marked()", children);
}
export function code(...children: readonly RichTextInput[]) {
    return nested("code", "code()", children);
}

function entity<T extends Extract<RichText, { type: string }>>(
    value: T,
): RichTextValue<T> {
    return brand(value, "rich-text");
}

export interface DateTimeOptions {
    unixTime: number;
    format: RichTextDateTime["date_time_format"];
}
export function dateTime(
    options: DateTimeOptions,
    ...children: readonly RichTextInput[]
): RichTextValue<RichTextDateTime> {
    return entity({
        type: "date_time",
        text: richText(children, "dateTime()"),
        unix_time: options.unixTime,
        date_time_format: options.format,
    });
}

export interface TextMentionOptions {
    user: User;
}
export function textMention(
    options: TextMentionOptions,
    ...children: readonly RichTextInput[]
): RichTextValue<RichTextTextMention> {
    return entity({
        type: "text_mention",
        text: richText(children, "textMention()"),
        user: options.user,
    });
}

export interface CustomEmojiOptions {
    id: string;
    alt: string;
}
export function customEmoji(
    options: CustomEmojiOptions,
    ...children: readonly never[]
) {
    assertNoChildren(children, "customEmoji()");
    return entity({
        type: "custom_emoji",
        custom_emoji_id: options.id,
        alternative_text: options.alt,
    });
}

export interface InlineMathOptions {
    expression: string;
}
export function inlineMath(
    options: InlineMathOptions,
    ...children: readonly never[]
) {
    assertNoChildren(children, "inlineMath()");
    return entity({
        type: "mathematical_expression",
        expression: options.expression,
    });
}

function textEntity<T extends Extract<RichText, { type: string }>>(
    value: object,
    context: string,
    children: readonly RichTextInput[],
): RichTextValue<T> {
    return entity({ ...value, text: richText(children, context) } as T);
}

export interface LinkOptions {
    url: string;
}
export function link(
    options: LinkOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextUrl>(
        { type: "url", url: options.url },
        "link()",
        children,
    );
}
export interface EmailOptions {
    address: string;
}
export function email(
    options: EmailOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextEmailAddress>(
        { type: "email_address", email_address: options.address },
        "email()",
        children,
    );
}
export interface PhoneOptions {
    number: string;
}
export function phone(
    options: PhoneOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextPhoneNumber>(
        { type: "phone_number", phone_number: options.number },
        "phone()",
        children,
    );
}
export interface BankCardOptions {
    number: string;
}
export function bankCard(
    options: BankCardOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextBankCardNumber>(
        { type: "bank_card_number", bank_card_number: options.number },
        "bankCard()",
        children,
    );
}
export interface MentionOptions {
    username: string;
}
export function mention(
    options: MentionOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextMention>(
        { type: "mention", username: options.username },
        "mention()",
        children,
    );
}
export interface HashtagOptions {
    value: string;
}
export function hashtag(
    options: HashtagOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextHashtag>(
        { type: "hashtag", hashtag: options.value },
        "hashtag()",
        children,
    );
}
export interface CashtagOptions {
    value: string;
}
export function cashtag(
    options: CashtagOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextCashtag>(
        { type: "cashtag", cashtag: options.value },
        "cashtag()",
        children,
    );
}
export interface BotCommandOptions {
    command: string;
}
export function botCommand(
    options: BotCommandOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextBotCommand>(
        { type: "bot_command", bot_command: options.command },
        "botCommand()",
        children,
    );
}

export interface TextAnchorOptions {
    name: string;
}
export function textAnchor(
    options: TextAnchorOptions,
    ...children: readonly never[]
) {
    assertNoChildren(children, "textAnchor()");
    return entity({ type: "anchor", name: options.name });
}

export interface NamedTextOptions {
    name: string;
}
export function anchorLink(
    options: NamedTextOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextAnchorLink>(
        { type: "anchor_link", anchor_name: options.name },
        "anchorLink()",
        children,
    );
}
export function reference(
    options: NamedTextOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextReference>(
        { type: "reference", name: options.name },
        "reference()",
        children,
    );
}
export function referenceLink(
    options: NamedTextOptions,
    ...children: readonly RichTextInput[]
) {
    return textEntity<RichTextReferenceLink>(
        { type: "reference_link", reference_name: options.name },
        "referenceLink()",
        children,
    );
}
