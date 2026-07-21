import type { Child } from "./jsx-runtime.ts";
import {
    anchorLink,
    bankCard,
    bold,
    botCommand,
    cashtag,
    code,
    customEmoji,
    dateTime,
    type DateTimeOptions,
    email,
    hashtag,
    inlineMath,
    italic,
    link,
    marked,
    mention,
    phone,
    reference,
    referenceLink,
    type RichTextInput,
    spoiler,
    strikethrough,
    subscript,
    superscript,
    textAnchor,
    textMention,
    type TextMentionOptions,
    underline,
} from "../core/text.ts";
import type { ChildrenProps, NoChildrenProps } from "./shared.ts";

function richChildren(children: Child): RichTextInput[] {
    return children === undefined ? [] : [children as RichTextInput];
}

function forbiddenChildren(children: unknown): never[] {
    return children === undefined ? [] : [children as never];
}

/**
 * TSX component for a bold text span. The TSX form of {@link bold}.
 */
export function Bold({ children }: ChildrenProps) {
    return bold(...richChildren(children));
}
/**
 * TSX component for an italic text span. The TSX form of {@link italic}.
 */
export function Italic({ children }: ChildrenProps) {
    return italic(...richChildren(children));
}
/**
 * TSX component for an underlined text span. The TSX form of
 * {@link underline}.
 */
export function Underline({ children }: ChildrenProps) {
    return underline(...richChildren(children));
}
/**
 * TSX component for a strikethrough text span. The TSX form of
 * {@link strikethrough}.
 */
export function Strikethrough({ children }: ChildrenProps) {
    return strikethrough(...richChildren(children));
}
/**
 * TSX component for a spoiler text span. The TSX form of {@link spoiler}.
 */
export function Spoiler({ children }: ChildrenProps) {
    return spoiler(...richChildren(children));
}
/**
 * TSX component for a subscript text span. The TSX form of
 * {@link subscript}.
 */
export function Subscript({ children }: ChildrenProps) {
    return subscript(...richChildren(children));
}
/**
 * TSX component for a superscript text span. The TSX form of
 * {@link superscript}.
 */
export function Superscript({ children }: ChildrenProps) {
    return superscript(...richChildren(children));
}
/**
 * TSX component for a marked text span. The TSX form of {@link marked}.
 */
export function Marked({ children }: ChildrenProps) {
    return marked(...richChildren(children));
}
/**
 * TSX component for an inline code span. The TSX form of {@link code}.
 */
export function Code({ children }: ChildrenProps) {
    return code(...richChildren(children));
}

/**
 * TSX component for a date-time entity. The TSX form of {@link dateTime}.
 *
 * @param props Component props, see {@link DateTimeOptions}
 */
export function DateTime(
    { children, ...options }: ChildrenProps & DateTimeOptions,
) {
    return dateTime(options, ...richChildren(children));
}
/**
 * TSX component for a text-mention entity. The TSX form of
 * {@link textMention}.
 *
 * @param props Component props, see {@link TextMentionOptions}
 */
export function TextMention(
    { children, ...options }: ChildrenProps & TextMentionOptions,
) {
    return textMention(options, ...richChildren(children));
}
/**
 * TSX component for a custom-emoji entity. The TSX form of
 * {@link customEmoji}.
 *
 * @param props Component props, see {@link CustomEmojiOptions}
 */
export function CustomEmoji(
    { children, ...options }: { id: string; alt: string } & NoChildrenProps,
) {
    return customEmoji(options, ...forbiddenChildren(children));
}
/**
 * TSX component for an inline-math entity. The TSX form of
 * {@link inlineMath}.
 *
 * @param props Component props, see {@link InlineMathOptions}
 */
export function InlineMath(
    { children, ...options }: { expression: string } & NoChildrenProps,
) {
    return inlineMath(options, ...forbiddenChildren(children));
}
/**
 * TSX component for a link entity. The TSX form of {@link link}.
 *
 * @param props Component props, see {@link LinkOptions}
 */
export function Link(
    { children, ...options }: ChildrenProps & { url: string },
) {
    return link(options, ...richChildren(children));
}
/**
 * TSX component for an email entity. The TSX form of {@link email}.
 *
 * @param props Component props, see {@link EmailOptions}
 */
export function Email(
    { children, ...options }: ChildrenProps & { address: string },
) {
    return email(options, ...richChildren(children));
}
/**
 * TSX component for a phone-number entity. The TSX form of {@link phone}.
 *
 * @param props Component props, see {@link PhoneOptions}
 */
export function Phone(
    { children, ...options }: ChildrenProps & { number: string },
) {
    return phone(options, ...richChildren(children));
}
/**
 * TSX component for a bank-card entity. The TSX form of {@link bankCard}.
 *
 * @param props Component props, see {@link BankCardOptions}
 */
export function BankCard(
    { children, ...options }: ChildrenProps & { number: string },
) {
    return bankCard(options, ...richChildren(children));
}
/**
 * TSX component for a mention entity. The TSX form of {@link mention}.
 *
 * @param props Component props, see {@link MentionOptions}
 */
export function Mention(
    { children, ...options }: ChildrenProps & { username: string },
) {
    return mention(options, ...richChildren(children));
}
/**
 * TSX component for a hashtag entity. The TSX form of {@link hashtag}.
 *
 * @param props Component props, see {@link HashtagOptions}
 */
export function Hashtag(
    { children, ...options }: ChildrenProps & { value: string },
) {
    return hashtag(options, ...richChildren(children));
}
/**
 * TSX component for a cashtag entity. The TSX form of {@link cashtag}.
 *
 * @param props Component props, see {@link CashtagOptions}
 */
export function Cashtag(
    { children, ...options }: ChildrenProps & { value: string },
) {
    return cashtag(options, ...richChildren(children));
}
/**
 * TSX component for a bot-command entity. The TSX form of
 * {@link botCommand}.
 *
 * @param props Component props, see {@link BotCommandOptions}
 */
export function BotCommand(
    { children, ...options }: ChildrenProps & { command: string },
) {
    return botCommand(options, ...richChildren(children));
}
/**
 * TSX component for a text-anchor entity. The TSX form of
 * {@link textAnchor}.
 *
 * @param props Component props, see {@link TextAnchorOptions}
 */
export function TextAnchor(
    { children, ...options }: { name: string } & NoChildrenProps,
) {
    return textAnchor(options, ...forbiddenChildren(children));
}
/**
 * TSX component for an anchor-link entity. The TSX form of
 * {@link anchorLink}.
 *
 * @param props Component props, see {@link NamedTextOptions}
 */
export function AnchorLink(
    { children, ...options }: ChildrenProps & { name: string },
) {
    return anchorLink(options, ...richChildren(children));
}
/**
 * TSX component for a reference entity. The TSX form of {@link reference}.
 *
 * @param props Component props, see {@link NamedTextOptions}
 */
export function Reference(
    { children, ...options }: ChildrenProps & { name: string },
) {
    return reference(options, ...richChildren(children));
}
/**
 * TSX component for a reference-link entity. The TSX form of
 * {@link referenceLink}.
 *
 * @param props Component props, see {@link NamedTextOptions}
 */
export function ReferenceLink(
    { children, ...options }: ChildrenProps & { name: string },
) {
    return referenceLink(options, ...richChildren(children));
}
