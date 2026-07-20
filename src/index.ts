import type { Child, Node } from "./jsx-runtime.js";

export interface InputRichMessage {
  blocks: InputRichBlock[];
  is_rtl?: boolean;
  skip_entity_detection?: boolean;
}

export type RichText = string | RichText[] | { type: string; [key: string]: unknown };
export type InputRichBlock = { type: string; [key: string]: unknown };

export interface Location {
  latitude: number;
  longitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

interface InputMediaBase { media: string; [key: string]: unknown; }
export interface InputMediaAnimation extends InputMediaBase { type: "animation"; }
export interface InputMediaAudio extends InputMediaBase { type: "audio"; }
export interface InputMediaPhoto extends InputMediaBase { type: "photo"; }
export interface InputMediaVideo extends InputMediaBase { type: "video"; }
export interface InputMediaVoiceNote extends InputMediaBase { type: "voice_note"; }

type CaptionProps =
  | { caption: Child; credit?: Child }
  | { caption?: undefined; credit?: never };

interface ChildrenProps { children?: Child; }

function node(kind: string, props: object): Node {
  return { kind, props: props as Record<string, unknown> };
}

export function RichMessage(props: ChildrenProps & { isRtl?: boolean; skipEntityDetection?: boolean }): Node {
  return node("rich-message", props);
}

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

export function Bold(props: ChildrenProps): Node { return node("bold", props); }
export function Italic(props: ChildrenProps): Node { return node("italic", props); }
export function Underline(props: ChildrenProps): Node { return node("underline", props); }
export function Strikethrough(props: ChildrenProps): Node { return node("strikethrough", props); }
export function Spoiler(props: ChildrenProps): Node { return node("spoiler", props); }
export function Subscript(props: ChildrenProps): Node { return node("subscript", props); }
export function Superscript(props: ChildrenProps): Node { return node("superscript", props); }
export function Marked(props: ChildrenProps): Node { return node("marked", props); }
export function Code(props: ChildrenProps): Node { return node("code", props); }
export function DateTime(props: ChildrenProps & { unixTime: number; format: string }): Node { return node("date_time", props); }
export function TextMention(props: ChildrenProps & { user: Record<string, unknown> }): Node { return node("text_mention", props); }
export function CustomEmoji(props: { id: string; alt: string }): Node { return node("custom_emoji", props); }
export function InlineMath(props: { expression: string }): Node { return node("mathematical_expression", props); }
export function Link(props: ChildrenProps & { url: string }): Node { return node("url", props); }
export function Email(props: ChildrenProps & { address: string }): Node { return node("email_address", props); }
export function Phone(props: ChildrenProps & { number: string }): Node { return node("phone_number", props); }
export function BankCard(props: ChildrenProps & { number: string }): Node { return node("bank_card_number", props); }
export function Mention(props: ChildrenProps & { username: string }): Node { return node("mention", props); }
export function Hashtag(props: ChildrenProps & { value: string }): Node { return node("hashtag", props); }
export function Cashtag(props: ChildrenProps & { value: string }): Node { return node("cashtag", props); }
export function BotCommand(props: ChildrenProps & { command: string }): Node { return node("bot_command", props); }
export function TextAnchor(props: { name: string }): Node { return node("anchor", props); }
export function AnchorLink(props: ChildrenProps & { name: string }): Node { return node("anchor_link", props); }
export function Reference(props: ChildrenProps & { name: string }): Node { return node("reference", props); }
export function ReferenceLink(props: ChildrenProps & { name: string }): Node { return node("reference_link", props); }

function flatten(child: Child): Exclude<Child, readonly Child[]>[] {
  if (Array.isArray(child)) return child.flatMap(flatten);
  return [child as Exclude<Child, readonly Child[]>];
}

function richText(child: Child): RichText {
  const parts: RichText[] = [];
  for (const item of flatten(child)) {
    if (item == null || typeof item === "boolean") continue;
    if (typeof item === "string" || typeof item === "number") {
      const value = String(item);
      const last = parts.at(-1);
      if (typeof last === "string") parts[parts.length - 1] = last + value;
      else parts.push(value);
      continue;
    }
    const text = () => richText(item.props.children as Child);
    if (["bold", "italic", "underline", "strikethrough", "spoiler", "subscript", "superscript", "marked", "code"].includes(item.kind)) {
      parts.push({ type: item.kind, text: text() });
    } else if (item.kind === "date_time") {
      parts.push({ type: item.kind, text: text(), unix_time: item.props.unixTime, date_time_format: item.props.format });
    } else if (item.kind === "text_mention") {
      parts.push({ type: item.kind, text: text(), user: item.props.user });
    } else if (item.kind === "custom_emoji") {
      parts.push({ type: item.kind, custom_emoji_id: item.props.id, alternative_text: item.props.alt });
    } else if (item.kind === "mathematical_expression") {
      parts.push({ type: item.kind, expression: item.props.expression });
    } else if (item.kind === "url") {
      parts.push({ type: item.kind, text: text(), url: item.props.url });
    } else if (item.kind === "email_address") {
      parts.push({ type: item.kind, text: text(), email_address: item.props.address });
    } else if (item.kind === "phone_number") {
      parts.push({ type: item.kind, text: text(), phone_number: item.props.number });
    } else if (item.kind === "bank_card_number") {
      parts.push({ type: item.kind, text: text(), bank_card_number: item.props.number });
    } else if (item.kind === "mention") {
      parts.push({ type: item.kind, text: text(), username: item.props.username });
    } else if (item.kind === "hashtag" || item.kind === "cashtag") {
      parts.push({ type: item.kind, text: text(), [item.kind]: item.props.value });
    } else if (item.kind === "bot_command") {
      parts.push({ type: item.kind, text: text(), bot_command: item.props.command });
    } else if (item.kind === "anchor") {
      parts.push({ type: item.kind, name: item.props.name });
    } else if (item.kind === "anchor_link") {
      parts.push({ type: item.kind, text: text(), anchor_name: item.props.name });
    } else if (item.kind === "reference") {
      parts.push({ type: item.kind, text: text(), name: item.props.name });
    } else if (item.kind === "reference_link") {
      parts.push({ type: item.kind, text: text(), reference_name: item.props.name });
    } else {
      throw new TypeError(`Expected rich text, received <${item.kind}>`);
    }
  }
  return parts.length === 1 ? parts[0]! : parts;
}

function childNodes(child: Child, context: string): Node[] {
  const result: Node[] = [];
  for (const item of flatten(child)) {
    if (item == null || typeof item === "boolean") continue;
    if (typeof item === "string" && item.trim() === "") continue;
    if (typeof item !== "object" || Array.isArray(item)) {
      throw new TypeError(`${context} only accepts TSX elements`);
    }
    result.push(item);
  }
  return result;
}

function caption(props: Record<string, unknown>): Record<string, RichText> | undefined {
  if (props.caption === undefined) {
    if (props.credit !== undefined) throw new TypeError("credit requires caption text");
    return undefined;
  }
  const value: Record<string, RichText> = { text: richText(props.caption as Child) };
  if (props.credit !== undefined) value.credit = richText(props.credit as Child);
  return value;
}

function setOptional(target: InputRichBlock, key: string, value: unknown): void {
  if (value !== undefined && value !== false) target[key] = value;
}

function listItem(value: Node): Record<string, unknown> {
  if (value.kind !== "list-item") throw new TypeError("<List> only accepts <ListItem> children");
  const result: Record<string, unknown> = {
    blocks: childNodes(value.props.children as Child, "<ListItem>").map(block),
  };
  if (value.props.checkbox === true) result.has_checkbox = true;
  if (value.props.checked === true) result.is_checked = true;
  if (value.props.value !== undefined) result.value = value.props.value;
  if (value.props.labelType !== undefined) result.type = value.props.labelType;
  return result;
}

function tableCell(value: Node): Record<string, unknown> {
  if (value.kind !== "table-cell") throw new TypeError("<TableRow> only accepts <TableCell> children");
  const result: Record<string, unknown> = {
    text: richText(value.props.children as Child),
    align: value.props.align ?? "left",
    valign: value.props.valign ?? "top",
  };
  if (value.props.header === true) result.is_header = true;
  if (value.props.colspan !== undefined) result.colspan = value.props.colspan;
  if (value.props.rowspan !== undefined) result.rowspan = value.props.rowspan;
  return result;
}

function block(value: Node): InputRichBlock {
  const props = value.props;
  if (["paragraph", "footer", "thinking"].includes(value.kind)) {
    return { type: value.kind, text: richText(props.children as Child) };
  }
  if (value.kind === "heading") return { type: "heading", text: richText(props.children as Child), size: props.size };
  if (value.kind === "pre") {
    const result: InputRichBlock = { type: "pre", text: richText(props.children as Child) };
    setOptional(result, "language", props.language);
    return result;
  }
  if (value.kind === "divider") return { type: "divider" };
  if (value.kind === "block-mathematical_expression") return { type: "mathematical_expression", expression: props.expression };
  if (value.kind === "block-anchor") return { type: "anchor", name: props.name };
  if (value.kind === "list") return { type: "list", items: childNodes(props.children as Child, "<List>").map(listItem) };
  if (value.kind === "blockquote") {
    const result: InputRichBlock = { type: "blockquote", blocks: childNodes(props.children as Child, "<BlockQuote>").map(block) };
    if (props.credit !== undefined) result.credit = richText(props.credit as Child);
    return result;
  }
  if (value.kind === "pullquote") {
    const result: InputRichBlock = { type: "pullquote", text: richText(props.children as Child) };
    if (props.credit !== undefined) result.credit = richText(props.credit as Child);
    return result;
  }
  if (value.kind === "collage" || value.kind === "slideshow") {
    const result: InputRichBlock = { type: value.kind, blocks: childNodes(props.children as Child, `<${value.kind}>`).map(block) };
    setOptional(result, "caption", caption(props));
    return result;
  }
  if (value.kind === "table") {
    const rows = childNodes(props.children as Child, "<Table>").map((row) => {
      if (row.kind !== "table-row") throw new TypeError("<Table> only accepts <TableRow> children");
      return childNodes(row.props.children as Child, "<TableRow>").map(tableCell);
    });
    const result: InputRichBlock = { type: "table", cells: rows };
    if (props.bordered === true) result.is_bordered = true;
    if (props.striped === true) result.is_striped = true;
    if (props.caption !== undefined) result.caption = richText(props.caption as Child);
    return result;
  }
  if (value.kind === "details") {
    const result: InputRichBlock = {
      type: "details",
      summary: richText(props.summary as Child),
      blocks: childNodes(props.children as Child, "<Details>").map(block),
    };
    if (props.open === true) result.is_open = true;
    return result;
  }
  if (value.kind === "map") {
    const zoom = props.zoom as number;
    const width = props.width as number;
    const height = props.height as number;
    if (!Number.isInteger(zoom) || zoom < 0 || zoom > 24) throw new RangeError("<Map> zoom must be an integer from 0 to 24");
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0 || width + height > 10_000) {
      throw new RangeError("<Map> width and height must be non-negative integers whose total does not exceed 10000");
    }
    if ((width === 0) !== (height === 0) || (width > 0 && Math.max(width / height, height / width) > 20)) {
      throw new RangeError("<Map> width-to-height ratio must not exceed 20");
    }
    const result: InputRichBlock = { type: "map", location: props.location, zoom, width, height };
    setOptional(result, "caption", caption(props));
    return result;
  }
  if (["animation", "audio", "photo", "video", "voice_note"].includes(value.kind)) {
    const result: InputRichBlock = { type: value.kind, [value.kind]: props.media };
    setOptional(result, "caption", caption(props));
    return result;
  }
  throw new TypeError(`Expected a rich-message block, received <${value.kind}>`);
}

export function render(element: Node): InputRichMessage {
  if (element.kind !== "rich-message") throw new TypeError("render() expects a <RichMessage> root");
  const blocks = childNodes(element.props.children as Child, "<RichMessage>").map(block);
  const result: InputRichMessage = { blocks };
  if (element.props.isRtl === true) result.is_rtl = true;
  if (element.props.skipEntityDetection === true) result.skip_entity_detection = true;
  return result;
}

export type { Child } from "./jsx-runtime.js";
