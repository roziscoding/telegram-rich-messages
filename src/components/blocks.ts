import type { Child } from "../jsx-runtime.js";
import type {
  InputMediaAnimation,
  InputMediaAudio,
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaVoiceNote,
  Location,
} from "../types.js";
import { node, type CaptionProps, type ChildrenProps, type ElementChildrenProps, type NoChildrenProps } from "./shared.js";

type ListItemSelectionProps =
  | { checkbox: true; checked?: boolean }
  | { checkbox?: false; checked?: never };

export function Paragraph(props: ChildrenProps) { return node("paragraph", props); }
export function Heading(props: ChildrenProps & { size: 1 | 2 | 3 | 4 | 5 | 6 }) { return node("heading", props); }
export function Pre(props: ChildrenProps & { language?: string }) { return node("pre", props); }
export function Footer(props: ChildrenProps) { return node("footer", props); }
export function Divider(props: NoChildrenProps) { return node("divider", props); }
export function MathBlock(props: { expression: string } & NoChildrenProps) { return node("block-mathematical_expression", props); }
export function BlockAnchor(props: { name: string } & NoChildrenProps) { return node("block-anchor", props); }
export function List(props: ElementChildrenProps) { return node("list", props); }
export function ListItem(props: ElementChildrenProps & ListItemSelectionProps & { value?: number; labelType?: "a" | "A" | "i" | "I" | "1" }) { return node("list-item", props); }
export function BlockQuote(props: ElementChildrenProps & { credit?: Child }) { return node("blockquote", props); }
export function PullQuote(props: ChildrenProps & { credit?: Child }) { return node("pullquote", props); }
export function Collage(props: ElementChildrenProps & CaptionProps) { return node("collage", props); }
export function Slideshow(props: ElementChildrenProps & CaptionProps) { return node("slideshow", props); }
export function Table(props: ElementChildrenProps & { bordered?: boolean; striped?: boolean; caption?: Child }) { return node("table", props); }
export function TableRow(props: ElementChildrenProps) { return node("table-row", props); }
export function TableCell(props: ChildrenProps & { header?: boolean; colspan?: number; rowspan?: number; align?: "left" | "center" | "right"; valign?: "top" | "middle" | "bottom" }) { return node("table-cell", props); }
export function Details(props: ElementChildrenProps & { summary: Child; open?: boolean }) { return node("details", props); }
export function Map(props: { location: Location; zoom: number; width: number; height: number } & CaptionProps & NoChildrenProps) { return node("map", props); }
export function Animation(props: { media: InputMediaAnimation } & CaptionProps & NoChildrenProps) { return node("animation", props); }
export function Audio(props: { media: InputMediaAudio } & CaptionProps & NoChildrenProps) { return node("audio", props); }
export function Photo(props: { media: InputMediaPhoto } & CaptionProps & NoChildrenProps) { return node("photo", props); }
export function Video(props: { media: InputMediaVideo } & CaptionProps & NoChildrenProps) { return node("video", props); }
export function VoiceNote(props: { media: InputMediaVoiceNote } & CaptionProps & NoChildrenProps) { return node("voice_note", props); }

/**
 * A temporary “Thinking…” block. Telegram only permits this block in
 * sendRichMessageDraft payloads; render() cannot infer the eventual endpoint.
 */
export function Thinking(props: ChildrenProps) { return node("thinking", props); }
