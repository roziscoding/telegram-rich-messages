import type { Child, Node } from "../jsx-runtime.js";
import type { InputMediaAnimation, InputMediaAudio, InputMediaPhoto, InputMediaVideo, InputMediaVoiceNote, Location } from "../types.js";
import { type CaptionProps, type ChildrenProps } from "./shared.js";
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
//# sourceMappingURL=blocks.d.ts.map