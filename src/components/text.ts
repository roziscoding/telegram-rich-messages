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

export function Bold({ children }: ChildrenProps) {
    return bold(...richChildren(children));
}
export function Italic({ children }: ChildrenProps) {
    return italic(...richChildren(children));
}
export function Underline({ children }: ChildrenProps) {
    return underline(...richChildren(children));
}
export function Strikethrough({ children }: ChildrenProps) {
    return strikethrough(...richChildren(children));
}
export function Spoiler({ children }: ChildrenProps) {
    return spoiler(...richChildren(children));
}
export function Subscript({ children }: ChildrenProps) {
    return subscript(...richChildren(children));
}
export function Superscript({ children }: ChildrenProps) {
    return superscript(...richChildren(children));
}
export function Marked({ children }: ChildrenProps) {
    return marked(...richChildren(children));
}
export function Code({ children }: ChildrenProps) {
    return code(...richChildren(children));
}

export function DateTime(
    { children, ...options }: ChildrenProps & DateTimeOptions,
) {
    return dateTime(options, ...richChildren(children));
}
export function TextMention(
    { children, ...options }: ChildrenProps & TextMentionOptions,
) {
    return textMention(options, ...richChildren(children));
}
export function CustomEmoji(
    { children, ...options }: { id: string; alt: string } & NoChildrenProps,
) {
    return customEmoji(options, ...forbiddenChildren(children));
}
export function InlineMath(
    { children, ...options }: { expression: string } & NoChildrenProps,
) {
    return inlineMath(options, ...forbiddenChildren(children));
}
export function Link(
    { children, ...options }: ChildrenProps & { url: string },
) {
    return link(options, ...richChildren(children));
}
export function Email(
    { children, ...options }: ChildrenProps & { address: string },
) {
    return email(options, ...richChildren(children));
}
export function Phone(
    { children, ...options }: ChildrenProps & { number: string },
) {
    return phone(options, ...richChildren(children));
}
export function BankCard(
    { children, ...options }: ChildrenProps & { number: string },
) {
    return bankCard(options, ...richChildren(children));
}
export function Mention(
    { children, ...options }: ChildrenProps & { username: string },
) {
    return mention(options, ...richChildren(children));
}
export function Hashtag(
    { children, ...options }: ChildrenProps & { value: string },
) {
    return hashtag(options, ...richChildren(children));
}
export function Cashtag(
    { children, ...options }: ChildrenProps & { value: string },
) {
    return cashtag(options, ...richChildren(children));
}
export function BotCommand(
    { children, ...options }: ChildrenProps & { command: string },
) {
    return botCommand(options, ...richChildren(children));
}
export function TextAnchor(
    { children, ...options }: { name: string } & NoChildrenProps,
) {
    return textAnchor(options, ...forbiddenChildren(children));
}
export function AnchorLink(
    { children, ...options }: ChildrenProps & { name: string },
) {
    return anchorLink(options, ...richChildren(children));
}
export function Reference(
    { children, ...options }: ChildrenProps & { name: string },
) {
    return reference(options, ...richChildren(children));
}
export function ReferenceLink(
    { children, ...options }: ChildrenProps & { name: string },
) {
    return referenceLink(options, ...richChildren(children));
}
