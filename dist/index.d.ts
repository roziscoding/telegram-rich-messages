import type { Child, Node } from "./jsx-runtime.js";
export interface InputRichMessage {
    blocks: InputRichBlock[];
    is_rtl?: boolean;
    skip_entity_detection?: boolean;
}
export type RichText = string | RichText[] | {
    type: string;
    [key: string]: unknown;
};
export type InputRichBlock = {
    type: string;
    [key: string]: unknown;
};
export interface Location {
    latitude: number;
    longitude: number;
    horizontal_accuracy?: number;
    live_period?: number;
    heading?: number;
    proximity_alert_radius?: number;
}
interface InputMediaBase {
    media: string;
    [key: string]: unknown;
}
export interface InputMediaAnimation extends InputMediaBase {
    type: "animation";
}
export interface InputMediaAudio extends InputMediaBase {
    type: "audio";
}
export interface InputMediaPhoto extends InputMediaBase {
    type: "photo";
}
export interface InputMediaVideo extends InputMediaBase {
    type: "video";
}
export interface InputMediaVoiceNote extends InputMediaBase {
    type: "voice_note";
}
type CaptionProps = {
    caption: Child;
    credit?: Child;
} | {
    caption?: undefined;
    credit?: never;
};
interface ChildrenProps {
    children?: Child;
}
export declare function RichMessage(props: ChildrenProps & {
    isRtl?: boolean;
    skipEntityDetection?: boolean;
}): Node;
export declare function Paragraph(props: ChildrenProps): Node;
export declare function Heading(props: ChildrenProps & {
    size: 1 | 2 | 3 | 4 | 5 | 6;
}): Node;
export declare function Pre(props: ChildrenProps & {
    language?: string;
}): Node;
export declare function Footer(props: ChildrenProps): Node;
export declare function Divider(props: Record<string, never>): Node;
export declare function MathBlock(props: {
    expression: string;
}): Node;
export declare function BlockAnchor(props: {
    name: string;
}): Node;
export declare function List(props: ChildrenProps): Node;
export declare function ListItem(props: ChildrenProps & {
    checkbox?: boolean;
    checked?: boolean;
    value?: number;
    labelType?: "a" | "A" | "i" | "I" | "1";
}): Node;
export declare function BlockQuote(props: ChildrenProps & {
    credit?: Child;
}): Node;
export declare function PullQuote(props: ChildrenProps & {
    credit?: Child;
}): Node;
export declare function Collage(props: ChildrenProps & CaptionProps): Node;
export declare function Slideshow(props: ChildrenProps & CaptionProps): Node;
export declare function Table(props: ChildrenProps & {
    bordered?: boolean;
    striped?: boolean;
    caption?: Child;
}): Node;
export declare function TableRow(props: ChildrenProps): Node;
export declare function TableCell(props: ChildrenProps & {
    header?: boolean;
    colspan?: number;
    rowspan?: number;
    align?: "left" | "center" | "right";
    valign?: "top" | "middle" | "bottom";
}): Node;
export declare function Details(props: ChildrenProps & {
    summary: Child;
    open?: boolean;
}): Node;
export declare function Map(props: {
    location: Location;
    zoom: number;
    width: number;
    height: number;
} & CaptionProps): Node;
export declare function Animation(props: {
    media: InputMediaAnimation;
} & CaptionProps): Node;
export declare function Audio(props: {
    media: InputMediaAudio;
} & CaptionProps): Node;
export declare function Photo(props: {
    media: InputMediaPhoto;
} & CaptionProps): Node;
export declare function Video(props: {
    media: InputMediaVideo;
} & CaptionProps): Node;
export declare function VoiceNote(props: {
    media: InputMediaVoiceNote;
} & CaptionProps): Node;
/**
 * A temporary “Thinking…” block. Telegram only permits this block in
 * sendRichMessageDraft payloads; render() cannot infer the eventual endpoint.
 */
export declare function Thinking(props: ChildrenProps): Node;
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
export declare function render(element: Node): InputRichMessage;
export type { Child } from "./jsx-runtime.js";
//# sourceMappingURL=index.d.ts.map