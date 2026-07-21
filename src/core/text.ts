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

/**
 * Creates a bold text span.
 *
 * @param children The rich-text children to render in bold
 * @returns a bold {@link RichTextValue}
 */
export function bold(...children: readonly RichTextInput[]) {
    return nested("bold", "bold()", children);
}
/**
 * Creates an italic text span.
 *
 * @param children The rich-text children to render in italic
 * @returns an italic {@link RichTextValue}
 */
export function italic(...children: readonly RichTextInput[]) {
    return nested("italic", "italic()", children);
}
/**
 * Creates an underlined text span.
 *
 * @param children The rich-text children to underline
 * @returns an underlined {@link RichTextValue}
 */
export function underline(...children: readonly RichTextInput[]) {
    return nested("underline", "underline()", children);
}
/**
 * Creates a strikethrough text span.
 *
 * @param children The rich-text children to strike through
 * @returns a strikethrough {@link RichTextValue}
 */
export function strikethrough(...children: readonly RichTextInput[]) {
    return nested("strikethrough", "strikethrough()", children);
}
/**
 * Marks its children as spoiler text.
 *
 * @param children The rich-text children to hide behind a spoiler
 * @returns a spoiler {@link RichTextValue}
 */
export function spoiler(...children: readonly RichTextInput[]) {
    return nested("spoiler", "spoiler()", children);
}
/**
 * Creates a subscript text span.
 *
 * @param children The rich-text children to render as subscript
 * @returns a subscript {@link RichTextValue}
 */
export function subscript(...children: readonly RichTextInput[]) {
    return nested("subscript", "subscript()", children);
}
/**
 * Creates a superscript text span.
 *
 * @param children The rich-text children to render as superscript
 * @returns a superscript {@link RichTextValue}
 */
export function superscript(...children: readonly RichTextInput[]) {
    return nested("superscript", "superscript()", children);
}
/**
 * Creates a marked (highlighted) text span.
 *
 * @param children The rich-text children to highlight
 * @returns a marked {@link RichTextValue}
 */
export function marked(...children: readonly RichTextInput[]) {
    return nested("marked", "marked()", children);
}
/**
 * Creates an inline monospace code span.
 *
 * @param children The rich-text children to render as inline code
 * @returns a code {@link RichTextValue}
 */
export function code(...children: readonly RichTextInput[]) {
    return nested("code", "code()", children);
}

function entity<T extends Extract<RichText, { type: string }>>(
    value: T,
): RichTextValue<T> {
    return brand(value, "rich-text");
}

/** Options for {@link dateTime}. */
export interface DateTimeOptions {
    /** The instant to display, as a Unix timestamp; becomes `unix_time`. */
    unixTime: number;
    /** How the client should render the timestamp; becomes `date_time_format`. */
    format: RichTextDateTime["date_time_format"];
}
/**
 * Creates a `date_time` entity that renders a timestamp.
 *
 * @param options The timestamp and display format, see {@link DateTimeOptions}
 * @param children The rich-text children shown as the entity's text
 */
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

/** Options for {@link textMention}. */
export interface TextMentionOptions {
    /** The user the text links to; becomes the `user` field. */
    user: User;
}
/**
 * Mentions a user by linking text to their profile.
 *
 * Produces a `text_mention` entity, used to mention users that have no
 * public username.
 *
 * @param options The user to mention, see {@link TextMentionOptions}
 * @param children The rich-text children shown as the mention text
 */
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

/** Options for {@link customEmoji}. */
export interface CustomEmojiOptions {
    /** The unique identifier of the custom emoji; becomes `custom_emoji_id`. */
    id: string;
    /** Fallback text shown when the emoji can't be rendered; becomes `alternative_text`. */
    alt: string;
}
/**
 * Creates a `custom_emoji` entity referencing an animated or static emoji.
 *
 * This entity carries no children; passing any is a runtime error.
 *
 * @param options The emoji id and fallback text, see {@link CustomEmojiOptions}
 */
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

/** Options for {@link inlineMath}. */
export interface InlineMathOptions {
    /** The mathematical expression to render; becomes the `expression` field. */
    expression: string;
}
/**
 * Creates a `mathematical_expression` entity rendering inline math.
 *
 * This entity carries no children; passing any is a runtime error.
 *
 * @param options The expression to render, see {@link InlineMathOptions}
 */
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

/** Options for {@link link}. */
export interface LinkOptions {
    /** The destination URL; becomes the `url` field. */
    url: string;
}
/**
 * Links text to a URL.
 *
 * Produces a `url` entity whose text is clickable and opens the given link.
 *
 * @param options The destination URL, see {@link LinkOptions}
 * @param children The rich-text children shown as the link text
 */
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
/** Options for {@link email}. */
export interface EmailOptions {
    /** The email address to link to; becomes `email_address`. */
    address: string;
}
/**
 * Links text to an email address.
 *
 * Produces an `email_address` entity that opens a mail composer.
 *
 * @param options The email address, see {@link EmailOptions}
 * @param children The rich-text children shown as the link text
 */
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
/** Options for {@link phone}. */
export interface PhoneOptions {
    /** The phone number to link to; becomes `phone_number`. */
    number: string;
}
/**
 * Links text to a phone number.
 *
 * Produces a `phone_number` entity that offers to dial the number.
 *
 * @param options The phone number, see {@link PhoneOptions}
 * @param children The rich-text children shown as the link text
 */
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
/** Options for {@link bankCard}. */
export interface BankCardOptions {
    /** The bank card number; becomes `bank_card_number`. */
    number: string;
}
/**
 * Marks text as a bank card number.
 *
 * Produces a `bank_card_number` entity that clients recognize as a payment
 * card.
 *
 * @param options The card number, see {@link BankCardOptions}
 * @param children The rich-text children shown as the entity's text
 */
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
/** Options for {@link mention}. */
export interface MentionOptions {
    /** The `@username` to mention, without the leading `@`; becomes `username`. */
    username: string;
}
/**
 * Mentions a user or chat by their public username.
 *
 * Produces a `mention` entity (the familiar `@username` link).
 *
 * @param options The username to mention, see {@link MentionOptions}
 * @param children The rich-text children shown as the mention text
 */
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
/** Options for {@link hashtag}. */
export interface HashtagOptions {
    /** The hashtag text, without the leading `#`; becomes `hashtag`. */
    value: string;
}
/**
 * Marks text as a hashtag.
 *
 * Produces a `hashtag` entity (the familiar `#tag` link).
 *
 * @param options The hashtag value, see {@link HashtagOptions}
 * @param children The rich-text children shown as the hashtag text
 */
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
/** Options for {@link cashtag}. */
export interface CashtagOptions {
    /** The cashtag text, without the leading `$`; becomes `cashtag`. */
    value: string;
}
/**
 * Marks text as a cashtag.
 *
 * Produces a `cashtag` entity (the familiar `$CODE` link).
 *
 * @param options The cashtag value, see {@link CashtagOptions}
 * @param children The rich-text children shown as the cashtag text
 */
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
/** Options for {@link botCommand}. */
export interface BotCommandOptions {
    /** The command text, including the leading `/`; becomes `bot_command`. */
    command: string;
}
/**
 * Marks text as a bot command.
 *
 * Produces a `bot_command` entity (the familiar `/command` link).
 *
 * @param options The command value, see {@link BotCommandOptions}
 * @param children The rich-text children shown as the command text
 */
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

/** Options for {@link textAnchor}. */
export interface TextAnchorOptions {
    /** The anchor's identifier that links can target; becomes the `name` field. */
    name: string;
}
/**
 * Defines a named anchor point within the message.
 *
 * Produces an `anchor` entity that {@link anchorLink} entities can target.
 * This entity carries no children; passing any is a runtime error.
 *
 * @param options The anchor name, see {@link TextAnchorOptions}
 */
export function textAnchor(
    options: TextAnchorOptions,
    ...children: readonly never[]
) {
    assertNoChildren(children, "textAnchor()");
    return entity({ type: "anchor", name: options.name });
}

/**
 * Options for the name-based entities {@link anchorLink}, {@link reference},
 * and {@link referenceLink}.
 */
export interface NamedTextOptions {
    /** The target name the entity points to; mapped to the entity's name field. */
    name: string;
}
/**
 * Links text to a named anchor within the message.
 *
 * Produces an `anchor_link` entity that jumps to the {@link textAnchor} with
 * the given name; the name becomes `anchor_name`.
 *
 * @param options The anchor name to target, see {@link NamedTextOptions}
 * @param children The rich-text children shown as the link text
 */
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
/**
 * Defines a named reference target within the message.
 *
 * Produces a `reference` entity that {@link referenceLink} entities can point
 * to; the name becomes the `name` field.
 *
 * @param options The reference name, see {@link NamedTextOptions}
 * @param children The rich-text children shown as the reference text
 */
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
/**
 * Links text to a named reference within the message.
 *
 * Produces a `reference_link` entity that points at the {@link reference} with
 * the given name; the name becomes `reference_name`.
 *
 * @param options The reference name to target, see {@link NamedTextOptions}
 * @param children The rich-text children shown as the link text
 */
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
