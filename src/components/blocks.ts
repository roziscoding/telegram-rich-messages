import type { Child, Node } from "../jsx-runtime.js";
import type {
  InputMediaAnimation,
  InputMediaAudio,
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaVoiceNote,
  Location,
} from "../types.js";
import { node, type CaptionProps, type ChildrenProps } from "./shared.js";

export function Paragraph(props: ChildrenProps): Node { return node("paragraph", props); }
export function Heading(props: ChildrenProps & { size: 1 | 2 | 3 | 4 | 5 | 6 }): Node { return node("heading", props); }
export function Pre(props: ChildrenProps & { language?: string }): Node { return node("pre", props); }
export function Footer(props: ChildrenProps): Node { return node("footer", props); }
export function Divider(props: Record<string, never>): Node { return node("divider", props); }
export function MathBlock(props: { expression: string }): Node { return node("block-mathematical_expression", props); }
export function BlockAnchor(props: { name: string }): Node { return node("block-anchor", props); }
export function List(props: ChildrenProps): Node { return node("list", props); }
export function ListItem(props: ChildrenProps & { checkbox?: boolean; checked?: boolean; value?: number; labelType?: "a" | "A" | "i" | "I" | "1" }): Node { return node("list-item", props); }
export function BlockQuote(props: ChildrenProps & { credit?: Child }): Node { return node("blockquote", props); }
export function PullQuote(props: ChildrenProps & { credit?: Child }): Node { return node("pullquote", props); }
export function Collage(props: ChildrenProps & CaptionProps): Node { return node("collage", props); }
export function Slideshow(props: ChildrenProps & CaptionProps): Node { return node("slideshow", props); }
export function Table(props: ChildrenProps & { bordered?: boolean; striped?: boolean; caption?: Child }): Node { return node("table", props); }
export function TableRow(props: ChildrenProps): Node { return node("table-row", props); }
export function TableCell(props: ChildrenProps & { header?: boolean; colspan?: number; rowspan?: number; align?: "left" | "center" | "right"; valign?: "top" | "middle" | "bottom" }): Node { return node("table-cell", props); }
export function Details(props: ChildrenProps & { summary: Child; open?: boolean }): Node { return node("details", props); }
export function Map(props: { location: Location; zoom: number; width: number; height: number } & CaptionProps): Node { return node("map", props); }
export function Animation(props: { media: InputMediaAnimation } & CaptionProps): Node { return node("animation", props); }
export function Audio(props: { media: InputMediaAudio } & CaptionProps): Node { return node("audio", props); }
export function Photo(props: { media: InputMediaPhoto } & CaptionProps): Node { return node("photo", props); }
export function Video(props: { media: InputMediaVideo } & CaptionProps): Node { return node("video", props); }
export function VoiceNote(props: { media: InputMediaVoiceNote } & CaptionProps): Node { return node("voice_note", props); }

/**
 * A temporary “Thinking…” block. Telegram only permits this block in
 * sendRichMessageDraft payloads; render() cannot infer the eventual endpoint.
 */
export function Thinking(props: ChildrenProps): Node { return node("thinking", props); }
