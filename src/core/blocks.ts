import type {
    InputMediaAnimation,
    InputMediaAudio,
    InputMediaPhoto,
    InputMediaVideo,
    InputMediaVoiceNote,
    InputRichBlock,
    InputRichBlockListItem,
    Location,
    RichBlockTableCell,
} from "../deps.deno.ts";
import {
    type BlockValueOf,
    brand,
    type ListItemValue,
    type TableCellValue,
    type TableRowValue,
} from "../core/values.ts";
import {
    assertNoChildren,
    type BlockInput,
    blocks,
    caption,
    type ListItemInput,
    listItems,
    richText,
    type RichTextInput,
    splitOptions,
    type TableCellInput,
    tableCells,
    type TableRowInput,
    tableRows,
} from "./shared.ts";

export type {
    BlockInput,
    ListItemInput,
    TableCellInput,
    TableRowInput,
} from "./shared.ts";

export type CaptionOptions =
    | { caption: RichTextInput; credit?: RichTextInput }
    | { caption?: undefined; credit?: never };

function block<T extends InputRichBlock>(value: T) {
    return brand(value, "block");
}

function richTextBlock<T extends "paragraph" | "footer" | "thinking">(
    type: T,
    context: string,
    children: readonly RichTextInput[],
): BlockValueOf<T> {
    return block(
        { type, text: richText(children, context) } as Extract<
            InputRichBlock,
            { type: T }
        >,
    );
}

export function paragraph(...children: readonly RichTextInput[]) {
    return richTextBlock("paragraph", "paragraph()", children);
}
export function footer(...children: readonly RichTextInput[]) {
    return richTextBlock("footer", "footer()", children);
}
export function thinking(...children: readonly RichTextInput[]) {
    return richTextBlock("thinking", "thinking()", children);
}

export interface HeadingOptions {
    size: 1 | 2 | 3 | 4 | 5 | 6;
}
export function heading(
    options: HeadingOptions,
    ...children: readonly RichTextInput[]
) {
    return block({
        type: "heading",
        text: richText(children, "heading()"),
        size: options.size,
    });
}

export interface PreOptions {
    language?: string;
}
export function pre(...children: readonly RichTextInput[]): BlockValueOf<"pre">;
export function pre(
    options: PreOptions,
    ...children: readonly RichTextInput[]
): BlockValueOf<"pre">;
export function pre(
    first?: PreOptions | RichTextInput,
    ...rest: readonly RichTextInput[]
) {
    const [options, children] = splitOptions<PreOptions, RichTextInput>(
        first,
        rest,
        "pre()",
        ["language"],
        true,
    );
    return block({
        type: "pre",
        text: richText(children, "pre()"),
        ...(options?.language === undefined
            ? {}
            : { language: options.language }),
    });
}

export function divider(...children: readonly never[]) {
    assertNoChildren(children, "divider()");
    return block({ type: "divider" });
}
export interface MathBlockOptions {
    expression: string;
}
export function mathBlock(
    options: MathBlockOptions,
    ...children: readonly never[]
) {
    assertNoChildren(children, "mathBlock()");
    return block({
        type: "mathematical_expression",
        expression: options.expression,
    });
}
export interface BlockAnchorOptions {
    name: string;
}
export function blockAnchor(
    options: BlockAnchorOptions,
    ...children: readonly never[]
) {
    assertNoChildren(children, "blockAnchor()");
    return block({ type: "anchor", name: options.name });
}

export function list(...items: readonly ListItemInput[]): BlockValueOf<"list"> {
    return block(
        { type: "list", items: listItems(items, "list()") } as Extract<
            InputRichBlock,
            { type: "list" }
        >,
    );
}

export type ListItemOptions =
    & (
        | { checkbox: true; checked?: boolean }
        | { checkbox?: false; checked?: never }
    )
    & { value?: number; labelType?: "a" | "A" | "i" | "I" | "1" };

export function listItem(...children: readonly BlockInput[]): ListItemValue;
export function listItem(
    options: ListItemOptions,
    ...children: readonly BlockInput[]
): ListItemValue;
export function listItem(
    first?: ListItemOptions | BlockInput,
    ...rest: readonly BlockInput[]
) {
    const [options = {}, children] = splitOptions<ListItemOptions, BlockInput>(
        first,
        rest,
        "listItem()",
        ["checkbox", "checked", "value", "labelType"],
    );
    if (
        (options as { checked?: unknown }).checked === true &&
        (options as { checkbox?: unknown }).checkbox !== true
    ) {
        throw new TypeError("listItem() checked requires checkbox");
    }
    const value: InputRichBlockListItem = {
        blocks: blocks(children, "listItem()"),
        ...(options.value === undefined ? {} : { value: options.value }),
        ...(options.labelType === undefined ? {} : { type: options.labelType }),
        ...(options.checkbox === true
            ? {
                has_checkbox: true as const,
                ...(options.checked === true
                    ? { is_checked: true as const }
                    : {}),
            }
            : {}),
    };
    return brand(value, "list-item");
}

export interface BlockQuoteOptions {
    credit?: RichTextInput;
}
export function blockQuote(
    ...children: readonly BlockInput[]
): BlockValueOf<"blockquote">;
export function blockQuote(
    options: BlockQuoteOptions,
    ...children: readonly BlockInput[]
): BlockValueOf<"blockquote">;
export function blockQuote(
    first?: BlockQuoteOptions | BlockInput,
    ...rest: readonly BlockInput[]
) {
    const [options = {}, children] = splitOptions<
        BlockQuoteOptions,
        BlockInput
    >(first, rest, "blockQuote()", ["credit"]);
    return block({
        type: "blockquote",
        blocks: blocks(children, "blockQuote()"),
        ...(options.credit === undefined
            ? {}
            : { credit: richText([options.credit], "blockQuote() credit") }),
    } as Extract<InputRichBlock, { type: "blockquote" }>);
}

export interface PullQuoteOptions {
    credit?: RichTextInput;
}
export function pullQuote(
    ...children: readonly RichTextInput[]
): BlockValueOf<"pullquote">;
export function pullQuote(
    options: PullQuoteOptions,
    ...children: readonly RichTextInput[]
): BlockValueOf<"pullquote">;
export function pullQuote(
    first?: PullQuoteOptions | RichTextInput,
    ...rest: readonly RichTextInput[]
) {
    const [options = {}, children] = splitOptions<
        PullQuoteOptions,
        RichTextInput
    >(first, rest, "pullQuote()", ["credit"], true);
    return block({
        type: "pullquote",
        text: richText(children, "pullQuote()"),
        ...(options.credit === undefined
            ? {}
            : { credit: richText([options.credit], "pullQuote() credit") }),
    });
}

function collection<T extends "collage" | "slideshow">(
    type: T,
    context: string,
    options: CaptionOptions,
    children: readonly BlockInput[],
): BlockValueOf<T> {
    const richCaption = caption(options, context);
    return block(
        {
            type,
            blocks: blocks(children, context),
            ...(richCaption === undefined ? {} : { caption: richCaption }),
        } as Extract<InputRichBlock, { type: T }>,
    );
}
export function collage(
    ...children: readonly BlockInput[]
): BlockValueOf<"collage">;
export function collage(
    options: CaptionOptions,
    ...children: readonly BlockInput[]
): BlockValueOf<"collage">;
export function collage(
    first?: CaptionOptions | BlockInput,
    ...rest: readonly BlockInput[]
) {
    const [options = {}, children] = splitOptions<CaptionOptions, BlockInput>(
        first,
        rest,
        "collage()",
        ["caption", "credit"],
    );
    return collection("collage", "collage()", options, children);
}
export function slideshow(
    ...children: readonly BlockInput[]
): BlockValueOf<"slideshow">;
export function slideshow(
    options: CaptionOptions,
    ...children: readonly BlockInput[]
): BlockValueOf<"slideshow">;
export function slideshow(
    first?: CaptionOptions | BlockInput,
    ...rest: readonly BlockInput[]
) {
    const [options = {}, children] = splitOptions<CaptionOptions, BlockInput>(
        first,
        rest,
        "slideshow()",
        ["caption", "credit"],
    );
    return collection("slideshow", "slideshow()", options, children);
}

export interface TableOptions {
    bordered?: boolean;
    striped?: boolean;
    caption?: RichTextInput;
}
export function table(...rows: readonly TableRowInput[]): BlockValueOf<"table">;
export function table(
    options: TableOptions,
    ...rows: readonly TableRowInput[]
): BlockValueOf<"table">;
export function table(
    first?: TableOptions | TableRowInput,
    ...rest: readonly TableRowInput[]
) {
    const [options = {}, children] = splitOptions<TableOptions, TableRowInput>(
        first,
        rest,
        "table()",
        ["bordered", "striped", "caption"],
    );
    return block({
        type: "table",
        cells: tableRows(children, "table()").map((row) => row.cells),
        ...(options.bordered === true ? { is_bordered: true as const } : {}),
        ...(options.striped === true ? { is_striped: true as const } : {}),
        ...(options.caption === undefined
            ? {}
            : { caption: richText([options.caption], "table() caption") }),
    } as Extract<InputRichBlock, { type: "table" }>);
}

export function tableRow(
    ...children: readonly TableCellInput[]
): TableRowValue {
    return brand({ cells: tableCells(children, "tableRow()") }, "table-row");
}

export interface TableCellOptions {
    header?: boolean;
    colspan?: number;
    rowspan?: number;
    align?: "left" | "center" | "right";
    valign?: "top" | "middle" | "bottom";
}
export function tableCell(
    ...children: readonly RichTextInput[]
): TableCellValue;
export function tableCell(
    options: TableCellOptions,
    ...children: readonly RichTextInput[]
): TableCellValue;
export function tableCell(
    first?: TableCellOptions | RichTextInput,
    ...rest: readonly RichTextInput[]
) {
    const [options = {}, children] = splitOptions<
        TableCellOptions,
        RichTextInput
    >(
        first,
        rest,
        "tableCell()",
        ["header", "colspan", "rowspan", "align", "valign"],
        true,
    );
    const value: RichBlockTableCell = {
        ...(children.length === 0
            ? {}
            : { text: richText(children, "tableCell()") }),
        align: options.align ?? "left",
        valign: options.valign ?? "top",
        ...(options.header === true ? { is_header: true as const } : {}),
        ...(options.colspan === undefined ? {} : { colspan: options.colspan }),
        ...(options.rowspan === undefined ? {} : { rowspan: options.rowspan }),
    };
    return brand(value, "table-cell");
}

export interface DetailsOptions {
    summary: RichTextInput;
    open?: boolean;
}
export function details(
    options: DetailsOptions,
    ...children: readonly BlockInput[]
): BlockValueOf<"details"> {
    return block({
        type: "details",
        summary: richText([options.summary], "details() summary"),
        blocks: blocks(children, "details()"),
        ...(options.open === true ? { is_open: true as const } : {}),
    } as Extract<InputRichBlock, { type: "details" }>);
}

export type MapOptions = CaptionOptions & {
    location: Location;
    zoom: number;
    width: number;
    height: number;
};
export function map(
    options: MapOptions,
    ...children: readonly never[]
): BlockValueOf<"map"> {
    assertNoChildren(children, "map()");
    const { zoom, width, height } = options;
    if (!Number.isInteger(zoom) || zoom < 0 || zoom > 24) {
        throw new RangeError("map() zoom must be an integer from 0 to 24");
    }
    if (
        !Number.isInteger(width) || !Number.isInteger(height) || width < 0 ||
        height < 0 || width + height > 10_000
    ) {
        throw new RangeError(
            "map() width and height must be non-negative integers whose total does not exceed 10000",
        );
    }
    if (
        (width === 0) !== (height === 0) ||
        (width > 0 && Math.max(width / height, height / width) > 20)
    ) {
        throw new RangeError("map() width-to-height ratio must not exceed 20");
    }
    const richCaption = caption(options, "map()");
    return block(
        {
            type: "map",
            location: options.location,
            zoom,
            width,
            height,
            ...(richCaption === undefined ? {} : { caption: richCaption }),
        } as Extract<InputRichBlock, { type: "map" }>,
    );
}

export type AnimationOptions = { media: InputMediaAnimation } & CaptionOptions;
export type AudioOptions = { media: InputMediaAudio } & CaptionOptions;
export type PhotoOptions = { media: InputMediaPhoto } & CaptionOptions;
export type VideoOptions = { media: InputMediaVideo } & CaptionOptions;
export type VoiceNoteOptions = { media: InputMediaVoiceNote } & CaptionOptions;

type MediaBlockType = "animation" | "audio" | "photo" | "video" | "voice_note";

function media<T extends MediaBlockType>(
    type: T,
    context: string,
    options: CaptionOptions & { media: unknown },
    children: readonly never[],
): BlockValueOf<T> {
    assertNoChildren(children, context);
    const richCaption = caption(options, context);
    const mediaField = type === "voice_note" ? "voice_note" : type;
    return block({
        type,
        [mediaField]: options.media,
        ...(richCaption === undefined ? {} : { caption: richCaption }),
    } as Extract<InputRichBlock, { type: T }>);
}
export function animation(
    options: AnimationOptions,
    ...children: readonly never[]
) {
    return media("animation", "animation()", options, children);
}
export function audio(options: AudioOptions, ...children: readonly never[]) {
    return media("audio", "audio()", options, children);
}
export function photo(options: PhotoOptions, ...children: readonly never[]) {
    return media("photo", "photo()", options, children);
}
export function video(options: VideoOptions, ...children: readonly never[]) {
    return media("video", "video()", options, children);
}
export function voiceNote(
    options: VoiceNoteOptions,
    ...children: readonly never[]
) {
    return media("voice_note", "voiceNote()", options, children);
}
