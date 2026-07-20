import type {
  InputFile,
  InputMediaAnimation,
  InputMediaAudio,
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaVoiceNote,
  InputRichBlock,
  InputRichBlockListItem,
  Location,
  RichBlockTableCell,
} from "../deps";
import { brand, type BlockValue, type BlockValueOf, type ListItemValue, type TableCellValue, type TableRowValue } from "../core/values";
import {
  assertNoChildren,
  blocks,
  caption,
  listItems,
  richText,
  splitOptions,
  tableCells,
  tableRows,
  type BlockInput,
  type ListItemInput,
  type RichTextInput,
  type TableCellInput,
  type TableRowInput,
} from "./shared";

export type { BlockInput, ListItemInput, TableCellInput, TableRowInput } from "./shared";

export type CaptionOptions =
  | { caption: RichTextInput; credit?: RichTextInput }
  | { caption?: undefined; credit?: never };

function block<T extends InputRichBlock<unknown>>(value: T) {
  return brand(value, "block");
}

function richTextBlock<T extends "paragraph" | "footer" | "thinking">(
  type: T,
  context: string,
  children: readonly RichTextInput[],
): BlockValueOf<T> {
  return block({ type, text: richText(children, context) } as Extract<InputRichBlock<never>, { type: T }>);
}

export function paragraph(...children: readonly RichTextInput[]) { return richTextBlock("paragraph", "paragraph()", children); }
export function footer(...children: readonly RichTextInput[]) { return richTextBlock("footer", "footer()", children); }
export function thinking(...children: readonly RichTextInput[]) { return richTextBlock("thinking", "thinking()", children); }

export interface HeadingOptions { size: 1 | 2 | 3 | 4 | 5 | 6; }
export function heading(options: HeadingOptions, ...children: readonly RichTextInput[]) {
  return block({ type: "heading", text: richText(children, "heading()"), size: options.size });
}

export interface PreOptions { language?: string; }
export function pre(...children: readonly RichTextInput[]): BlockValueOf<"pre">;
export function pre(options: PreOptions, ...children: readonly RichTextInput[]): BlockValueOf<"pre">;
export function pre(first?: PreOptions | RichTextInput, ...rest: readonly RichTextInput[]) {
  const [options, children] = splitOptions<PreOptions, RichTextInput>(first, rest, "pre()", ["language"], "rich-text", true);
  return block({ type: "pre", text: richText(children, "pre()"), ...(options?.language === undefined ? {} : { language: options.language }) });
}

export function divider(...children: readonly never[]) {
  assertNoChildren(children, "divider()");
  return block({ type: "divider" });
}
export interface MathBlockOptions { expression: string; }
export function mathBlock(options: MathBlockOptions, ...children: readonly never[]) {
  assertNoChildren(children, "mathBlock()");
  return block({ type: "mathematical_expression", expression: options.expression });
}
export interface BlockAnchorOptions { name: string; }
export function blockAnchor(options: BlockAnchorOptions, ...children: readonly never[]) {
  assertNoChildren(children, "blockAnchor()");
  return block({ type: "anchor", name: options.name });
}

export function list<F = InputFile>(...items: readonly ListItemInput<F>[]): BlockValueOf<"list", F> {
  return block({ type: "list", items: listItems<F>(items, "list()") } as Extract<InputRichBlock<F>, { type: "list" }>);
}

export type ListItemOptions = (
  | { checkbox: true; checked?: boolean }
  | { checkbox?: false; checked?: never }
) & { value?: number; labelType?: "a" | "A" | "i" | "I" | "1" };

export function listItem<F = InputFile>(...children: readonly BlockInput<F>[]): ListItemValue<F>;
export function listItem<F = InputFile>(options: ListItemOptions, ...children: readonly BlockInput<F>[]): ListItemValue<F>;
export function listItem<F = InputFile>(first?: ListItemOptions | BlockInput<F>, ...rest: readonly BlockInput<F>[]) {
  const [options = {}, children] = splitOptions<ListItemOptions, BlockInput<F>>(
    first, rest, "listItem()", ["checkbox", "checked", "value", "labelType"], "block",
  );
  if ((options as { checked?: unknown }).checked === true && (options as { checkbox?: unknown }).checkbox !== true) {
    throw new TypeError("listItem() checked requires checkbox");
  }
  const value: InputRichBlockListItem<F> = {
    blocks: blocks<F>(children, "listItem()"),
    ...(options.value === undefined ? {} : { value: options.value }),
    ...(options.labelType === undefined ? {} : { type: options.labelType }),
    ...(options.checkbox === true ? { has_checkbox: true as const, ...(options.checked === true ? { is_checked: true as const } : {}) } : {}),
  };
  return brand(value, "list-item");
}

export interface BlockQuoteOptions { credit?: RichTextInput; }
export function blockQuote<F = InputFile>(...children: readonly BlockInput<F>[]): BlockValueOf<"blockquote", F>;
export function blockQuote<F = InputFile>(options: BlockQuoteOptions, ...children: readonly BlockInput<F>[]): BlockValueOf<"blockquote", F>;
export function blockQuote<F = InputFile>(first?: BlockQuoteOptions | BlockInput<F>, ...rest: readonly BlockInput<F>[]) {
  const [options = {}, children] = splitOptions<BlockQuoteOptions, BlockInput<F>>(first, rest, "blockQuote()", ["credit"], "block");
  return block({
    type: "blockquote",
    blocks: blocks<F>(children, "blockQuote()"),
    ...(options.credit === undefined ? {} : { credit: richText([options.credit], "blockQuote() credit") }),
  } as Extract<InputRichBlock<F>, { type: "blockquote" }>);
}

export interface PullQuoteOptions { credit?: RichTextInput; }
export function pullQuote(...children: readonly RichTextInput[]): BlockValueOf<"pullquote">;
export function pullQuote(options: PullQuoteOptions, ...children: readonly RichTextInput[]): BlockValueOf<"pullquote">;
export function pullQuote(first?: PullQuoteOptions | RichTextInput, ...rest: readonly RichTextInput[]) {
  const [options = {}, children] = splitOptions<PullQuoteOptions, RichTextInput>(first, rest, "pullQuote()", ["credit"], "rich-text", true);
  return block({
    type: "pullquote",
    text: richText(children, "pullQuote()"),
    ...(options.credit === undefined ? {} : { credit: richText([options.credit], "pullQuote() credit") }),
  });
}

function collection<F, T extends "collage" | "slideshow">(
  type: T,
  context: string,
  options: CaptionOptions,
  children: readonly BlockInput<F>[],
): BlockValueOf<T, F> {
  const richCaption = caption(options, context);
  return block({ type, blocks: blocks<F>(children, context), ...(richCaption === undefined ? {} : { caption: richCaption }) } as Extract<InputRichBlock<F>, { type: T }>);
}
export function collage<F = InputFile>(...children: readonly BlockInput<F>[]): BlockValueOf<"collage", F>;
export function collage<F = InputFile>(options: CaptionOptions, ...children: readonly BlockInput<F>[]): BlockValueOf<"collage", F>;
export function collage<F = InputFile>(first?: CaptionOptions | BlockInput<F>, ...rest: readonly BlockInput<F>[]) {
  const [options = {}, children] = splitOptions<CaptionOptions, BlockInput<F>>(first, rest, "collage()", ["caption", "credit"], "block");
  return collection<F, "collage">("collage", "collage()", options, children);
}
export function slideshow<F = InputFile>(...children: readonly BlockInput<F>[]): BlockValueOf<"slideshow", F>;
export function slideshow<F = InputFile>(options: CaptionOptions, ...children: readonly BlockInput<F>[]): BlockValueOf<"slideshow", F>;
export function slideshow<F = InputFile>(first?: CaptionOptions | BlockInput<F>, ...rest: readonly BlockInput<F>[]) {
  const [options = {}, children] = splitOptions<CaptionOptions, BlockInput<F>>(first, rest, "slideshow()", ["caption", "credit"], "block");
  return collection<F, "slideshow">("slideshow", "slideshow()", options, children);
}

export interface TableOptions { bordered?: boolean; striped?: boolean; caption?: RichTextInput; }
export function table(...rows: readonly TableRowInput[]): BlockValueOf<"table">;
export function table(options: TableOptions, ...rows: readonly TableRowInput[]): BlockValueOf<"table">;
export function table(first?: TableOptions | TableRowInput, ...rest: readonly TableRowInput[]) {
  const [options = {}, children] = splitOptions<TableOptions, TableRowInput>(first, rest, "table()", ["bordered", "striped", "caption"], "table-row");
  return block({
    type: "table",
    cells: tableRows(children, "table()").map((row) => row.cells),
    ...(options.bordered === true ? { is_bordered: true as const } : {}),
    ...(options.striped === true ? { is_striped: true as const } : {}),
    ...(options.caption === undefined ? {} : { caption: richText([options.caption], "table() caption") }),
  } as Extract<InputRichBlock<never>, { type: "table" }>);
}

export function tableRow(...children: readonly TableCellInput[]): TableRowValue {
  return brand({ cells: tableCells(children, "tableRow()") }, "table-row");
}

export interface TableCellOptions {
  header?: boolean;
  colspan?: number;
  rowspan?: number;
  align?: "left" | "center" | "right";
  valign?: "top" | "middle" | "bottom";
}
export function tableCell(...children: readonly RichTextInput[]): TableCellValue;
export function tableCell(options: TableCellOptions, ...children: readonly RichTextInput[]): TableCellValue;
export function tableCell(first?: TableCellOptions | RichTextInput, ...rest: readonly RichTextInput[]) {
  const [options = {}, children] = splitOptions<TableCellOptions, RichTextInput>(
    first, rest, "tableCell()", ["header", "colspan", "rowspan", "align", "valign"], "rich-text", true,
  );
  const value: RichBlockTableCell = {
    ...(children.length === 0 ? {} : { text: richText(children, "tableCell()") }),
    align: options.align ?? "left",
    valign: options.valign ?? "top",
    ...(options.header === true ? { is_header: true as const } : {}),
    ...(options.colspan === undefined ? {} : { colspan: options.colspan }),
    ...(options.rowspan === undefined ? {} : { rowspan: options.rowspan }),
  };
  return brand(value, "table-cell");
}

export interface DetailsOptions { summary: RichTextInput; open?: boolean; }
export function details<F = InputFile>(options: DetailsOptions, ...children: readonly BlockInput<F>[]): BlockValueOf<"details", F> {
  return block({
    type: "details",
    summary: richText([options.summary], "details() summary"),
    blocks: blocks<F>(children, "details()"),
    ...(options.open === true ? { is_open: true as const } : {}),
  } as Extract<InputRichBlock<F>, { type: "details" }>);
}

export type MapOptions = CaptionOptions & { location: Location; zoom: number; width: number; height: number };
export function map(options: MapOptions, ...children: readonly never[]): BlockValueOf<"map"> {
  assertNoChildren(children, "map()");
  const { zoom, width, height } = options;
  if (!Number.isInteger(zoom) || zoom < 0 || zoom > 24) throw new RangeError("map() zoom must be an integer from 0 to 24");
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0 || width + height > 10_000) {
    throw new RangeError("map() width and height must be non-negative integers whose total does not exceed 10000");
  }
  if ((width === 0) !== (height === 0) || (width > 0 && Math.max(width / height, height / width) > 20)) {
    throw new RangeError("map() width-to-height ratio must not exceed 20");
  }
  const richCaption = caption(options, "map()");
  return block({ type: "map", location: options.location, zoom, width, height, ...(richCaption === undefined ? {} : { caption: richCaption }) } as Extract<InputRichBlock<never>, { type: "map" }>);
}

export type AnimationOptions<F = InputFile> = { media: InputMediaAnimation<F> } & CaptionOptions;
export type AudioOptions<F = InputFile> = { media: InputMediaAudio<F> } & CaptionOptions;
export type PhotoOptions<F = InputFile> = { media: InputMediaPhoto<F> } & CaptionOptions;
export type VideoOptions<F = InputFile> = { media: InputMediaVideo<F> } & CaptionOptions;
export type VoiceNoteOptions<F = InputFile> = { media: InputMediaVoiceNote<F> } & CaptionOptions;

type MediaBlockType = "animation" | "audio" | "photo" | "video" | "voice_note";

function media<F, T extends MediaBlockType>(
  type: T,
  context: string,
  options: CaptionOptions & { media: unknown },
  children: readonly never[],
): BlockValueOf<T, F> {
  assertNoChildren(children, context);
  const richCaption = caption(options, context);
  const mediaField = type === "voice_note" ? "voice_note" : type;
  return block({
    type,
    [mediaField]: options.media,
    ...(richCaption === undefined ? {} : { caption: richCaption }),
  } as Extract<InputRichBlock<F>, { type: T }>);
}
export function animation(options: AnimationOptions, ...children: readonly never[]) { return media<InputFile, "animation">("animation", "animation()", options, children); }
export function audio(options: AudioOptions, ...children: readonly never[]) { return media<InputFile, "audio">("audio", "audio()", options, children); }
export function photo(options: PhotoOptions, ...children: readonly never[]) { return media<InputFile, "photo">("photo", "photo()", options, children); }
export function video(options: VideoOptions, ...children: readonly never[]) { return media<InputFile, "video">("video", "video()", options, children); }
export function voiceNote(options: VoiceNoteOptions, ...children: readonly never[]) { return media<InputFile, "voice_note">("voice_note", "voiceNote()", options, children); }
