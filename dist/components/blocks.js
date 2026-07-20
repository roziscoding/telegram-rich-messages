import { node } from "./shared.js";
export function Paragraph(props) { return node("paragraph", props); }
export function Heading(props) { return node("heading", props); }
export function Pre(props) { return node("pre", props); }
export function Footer(props) { return node("footer", props); }
export function Divider(props) { return node("divider", props); }
export function MathBlock(props) { return node("block-mathematical_expression", props); }
export function BlockAnchor(props) { return node("block-anchor", props); }
export function List(props) { return node("list", props); }
export function ListItem(props) { return node("list-item", props); }
export function BlockQuote(props) { return node("blockquote", props); }
export function PullQuote(props) { return node("pullquote", props); }
export function Collage(props) { return node("collage", props); }
export function Slideshow(props) { return node("slideshow", props); }
export function Table(props) { return node("table", props); }
export function TableRow(props) { return node("table-row", props); }
export function TableCell(props) { return node("table-cell", props); }
export function Details(props) { return node("details", props); }
export function Map(props) { return node("map", props); }
export function Animation(props) { return node("animation", props); }
export function Audio(props) { return node("audio", props); }
export function Photo(props) { return node("photo", props); }
export function Video(props) { return node("video", props); }
export function VoiceNote(props) { return node("voice_note", props); }
/**
 * A temporary “Thinking…” block. Telegram only permits this block in
 * sendRichMessageDraft payloads; render() cannot infer the eventual endpoint.
 */
export function Thinking(props) { return node("thinking", props); }
//# sourceMappingURL=blocks.js.map