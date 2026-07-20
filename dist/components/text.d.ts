import type { Node } from "../jsx-runtime.js";
import { type ChildrenProps } from "./shared.js";
export declare function Bold(props: ChildrenProps): Node;
export declare function Italic(props: ChildrenProps): Node;
export declare function Underline(props: ChildrenProps): Node;
export declare function Strikethrough(props: ChildrenProps): Node;
export declare function Spoiler(props: ChildrenProps): Node;
export declare function Subscript(props: ChildrenProps): Node;
export declare function Superscript(props: ChildrenProps): Node;
export declare function Marked(props: ChildrenProps): Node;
export declare function Code(props: ChildrenProps): Node;
export declare function DateTime(props: ChildrenProps & {
    unixTime: number;
    format: string;
}): Node;
export declare function TextMention(props: ChildrenProps & {
    user: Record<string, unknown>;
}): Node;
export declare function CustomEmoji(props: {
    id: string;
    alt: string;
}): Node;
export declare function InlineMath(props: {
    expression: string;
}): Node;
export declare function Link(props: ChildrenProps & {
    url: string;
}): Node;
export declare function Email(props: ChildrenProps & {
    address: string;
}): Node;
export declare function Phone(props: ChildrenProps & {
    number: string;
}): Node;
export declare function BankCard(props: ChildrenProps & {
    number: string;
}): Node;
export declare function Mention(props: ChildrenProps & {
    username: string;
}): Node;
export declare function Hashtag(props: ChildrenProps & {
    value: string;
}): Node;
export declare function Cashtag(props: ChildrenProps & {
    value: string;
}): Node;
export declare function BotCommand(props: ChildrenProps & {
    command: string;
}): Node;
export declare function TextAnchor(props: {
    name: string;
}): Node;
export declare function AnchorLink(props: ChildrenProps & {
    name: string;
}): Node;
export declare function Reference(props: ChildrenProps & {
    name: string;
}): Node;
export declare function ReferenceLink(props: ChildrenProps & {
    name: string;
}): Node;
//# sourceMappingURL=text.d.ts.map