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

/**
 * Caption and credit fields shared by media and collection blocks. A
 * `credit` may only be supplied together with a `caption`.
 */
export type CaptionOptions =
    | {
        /** Rich-text caption shown beneath the block. */
        caption: RichTextInput;
        /** Rich-text attribution line rendered under the caption. */
        credit?: RichTextInput;
    }
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

/**
 * Creates a paragraph block.
 *
 * @param children The rich-text children
 */
export function paragraph(...children: readonly RichTextInput[]) {
    return richTextBlock("paragraph", "paragraph()", children);
}
/**
 * Creates a footer block.
 *
 * @param children The rich-text children
 */
export function footer(...children: readonly RichTextInput[]) {
    return richTextBlock("footer", "footer()", children);
}
/**
 * Creates a thinking block.
 *
 * @param children The rich-text children
 */
export function thinking(...children: readonly RichTextInput[]) {
    return richTextBlock("thinking", "thinking()", children);
}

/** Options for {@link heading}. */
export interface HeadingOptions {
    /** Heading level from `1` (largest) to `6` (smallest). */
    size: 1 | 2 | 3 | 4 | 5 | 6;
}
/**
 * Creates a heading block.
 *
 * @param options The {@link HeadingOptions}
 * @param children The rich-text children
 */
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

/** Options for {@link pre}. */
export interface PreOptions {
    /** Programming language used to syntax-highlight the block. */
    language?: string;
}
/**
 * Creates a preformatted (code) block.
 *
 * @param children The rich-text children
 */
export function pre(...children: readonly RichTextInput[]): BlockValueOf<"pre">;
/**
 * Creates a preformatted (code) block.
 *
 * @param options The {@link PreOptions}
 * @param children The rich-text children
 */
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

/**
 * Creates a divider block. Accepts no children.
 *
 * @param children Must be empty
 */
export function divider(...children: readonly never[]) {
    assertNoChildren(children, "divider()");
    return block({ type: "divider" });
}
/** Options for {@link mathBlock}. */
export interface MathBlockOptions {
    /** LaTeX expression rendered as `mathematical_expression`. */
    expression: string;
}
/**
 * Creates a mathematical expression block. Accepts no children.
 *
 * @param options The {@link MathBlockOptions}
 * @param children Must be empty
 */
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
/** Options for {@link blockAnchor}. */
export interface BlockAnchorOptions {
    /** Anchor `name` that other blocks can link to. */
    name: string;
}
/**
 * Creates an anchor block. Accepts no children.
 *
 * @param options The {@link BlockAnchorOptions}
 * @param children Must be empty
 */
export function blockAnchor(
    options: BlockAnchorOptions,
    ...children: readonly never[]
) {
    assertNoChildren(children, "blockAnchor()");
    return block({ type: "anchor", name: options.name });
}

/**
 * Creates a list block from {@link listItem} values.
 *
 * @param items The list items
 */
export function list(...items: readonly ListItemInput[]): BlockValueOf<"list"> {
    return block(
        { type: "list", items: listItems(items, "list()") } as Extract<
            InputRichBlock,
            { type: "list" }
        >,
    );
}

/**
 * Options for {@link listItem}. A `checked` state is only allowed when
 * `checkbox` is `true`.
 */
export type ListItemOptions =
    & (
        | {
            /**
             * Renders the item with a checkbox, setting `has_checkbox`.
             */
            checkbox: true;
            /**
             * Marks the checkbox as ticked, setting `is_checked`.
             * Defaults to `false`.
             */
            checked?: boolean;
        }
        | { checkbox?: false; checked?: never }
    )
    & {
        /** Explicit ordinal `value` for the item in an ordered list. */
        value?: number;
        /**
         * Marker style for the item, mapped to the `type` field:
         * `a`/`A` for lettered, `i`/`I` for Roman, `1` for numeric.
         */
        labelType?: "a" | "A" | "i" | "I" | "1";
    };

/**
 * Creates a list item for use in {@link list}.
 *
 * @param children The block children
 */
export function listItem(...children: readonly BlockInput[]): ListItemValue;
/**
 * Creates a list item for use in {@link list}.
 *
 * @param options The {@link ListItemOptions}
 * @param children The block children
 */
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

/** Options for {@link blockQuote}. */
export interface BlockQuoteOptions {
    /** Rich-text attribution rendered as the `credit` field. */
    credit?: RichTextInput;
}
/**
 * Creates a block quote from block children.
 *
 * @param children The block children
 */
export function blockQuote(
    ...children: readonly BlockInput[]
): BlockValueOf<"blockquote">;
/**
 * Creates a block quote from block children.
 *
 * @param options The {@link BlockQuoteOptions}
 * @param children The block children
 */
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

/** Options for {@link pullQuote}. */
export interface PullQuoteOptions {
    /** Rich-text attribution rendered as the `credit` field. */
    credit?: RichTextInput;
}
/**
 * Creates a pull quote from rich-text children.
 *
 * @param children The rich-text children
 */
export function pullQuote(
    ...children: readonly RichTextInput[]
): BlockValueOf<"pullquote">;
/**
 * Creates a pull quote from rich-text children.
 *
 * @param options The {@link PullQuoteOptions}
 * @param children The rich-text children
 */
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
/**
 * Groups several media blocks into a collage under one caption.
 *
 * @param children The block children
 */
export function collage(
    ...children: readonly BlockInput[]
): BlockValueOf<"collage">;
/**
 * Groups several media blocks into a collage under one caption.
 *
 * @param options The {@link CaptionOptions}
 * @param children The block children
 */
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
/**
 * Groups several media blocks into a slideshow under one caption.
 *
 * @param children The block children
 */
export function slideshow(
    ...children: readonly BlockInput[]
): BlockValueOf<"slideshow">;
/**
 * Groups several media blocks into a slideshow under one caption.
 *
 * @param options The {@link CaptionOptions}
 * @param children The block children
 */
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

/** Options for {@link table}. */
export interface TableOptions {
    /** Draws cell borders, setting `is_bordered`. Defaults to `false`. */
    bordered?: boolean;
    /** Shades alternating rows, setting `is_striped`. Defaults to `false`. */
    striped?: boolean;
    /** Rich-text `caption` rendered above the table. */
    caption?: RichTextInput;
}
/**
 * Creates a table block from {@link tableRow} values.
 *
 * @param rows The table rows
 */
export function table(...rows: readonly TableRowInput[]): BlockValueOf<"table">;
/**
 * Creates a table block from {@link tableRow} values.
 *
 * @param options The {@link TableOptions}
 * @param rows The table rows
 */
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

/**
 * Creates a table row from {@link tableCell} values for use in {@link table}.
 *
 * @param children The table cells
 */
export function tableRow(
    ...children: readonly TableCellInput[]
): TableRowValue {
    return brand({ cells: tableCells(children, "tableRow()") }, "table-row");
}

/** Options for {@link tableCell}. */
export interface TableCellOptions {
    /** Renders the cell as a header, setting `is_header`. Defaults to `false`. */
    header?: boolean;
    /** Number of columns the cell spans, mapped to `colspan`. */
    colspan?: number;
    /** Number of rows the cell spans, mapped to `rowspan`. */
    rowspan?: number;
    /** Horizontal `align` of the cell content. Defaults to `left`. */
    align?: "left" | "center" | "right";
    /** Vertical `valign` of the cell content. Defaults to `top`. */
    valign?: "top" | "middle" | "bottom";
}
/**
 * Creates a table cell for use in {@link tableRow}.
 *
 * @param children The rich-text children
 */
export function tableCell(
    ...children: readonly RichTextInput[]
): TableCellValue;
/**
 * Creates a table cell for use in {@link tableRow}.
 *
 * @param options The {@link TableCellOptions}
 * @param children The rich-text children
 */
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

/** Options for {@link details}. */
export interface DetailsOptions {
    /** Rich-text `summary` shown as the disclosure label. */
    summary: RichTextInput;
    /** Renders the block expanded, setting `is_open`. Defaults to `false`. */
    open?: boolean;
}
/**
 * Creates a collapsible details block.
 *
 * @param options The {@link DetailsOptions}
 * @param children The block children
 */
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

/** Options for {@link map}, extending {@link CaptionOptions}. */
export type MapOptions = CaptionOptions & {
    /** Geographic `location` to center the map on. */
    location: Location;
    /** Map `zoom` level, an integer from `0` to `24`. */
    zoom: number;
    /** Map `width` in pixels; a non-negative integer. */
    width: number;
    /** Map `height` in pixels; a non-negative integer. */
    height: number;
};
/**
 * Creates a map block. Accepts no children.
 *
 * @param options The {@link MapOptions}
 * @param children Must be empty
 */
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

/** Options for {@link animation}, extending {@link CaptionOptions}. */
export type AnimationOptions = {
    /** The animation media to attach. */
    media: InputMediaAnimation;
} & CaptionOptions;
/** Options for {@link audio}, extending {@link CaptionOptions}. */
export type AudioOptions = {
    /** The audio media to attach. */
    media: InputMediaAudio;
} & CaptionOptions;
/** Options for {@link photo}, extending {@link CaptionOptions}. */
export type PhotoOptions = {
    /** The photo media to attach. */
    media: InputMediaPhoto;
} & CaptionOptions;
/** Options for {@link video}, extending {@link CaptionOptions}. */
export type VideoOptions = {
    /** The video media to attach. */
    media: InputMediaVideo;
} & CaptionOptions;
/** Options for {@link voiceNote}, extending {@link CaptionOptions}. */
export type VoiceNoteOptions = {
    /** The voice-note media to attach. */
    media: InputMediaVoiceNote;
} & CaptionOptions;

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
/**
 * Creates an animation media block. Accepts no children.
 *
 * @param options The {@link AnimationOptions}
 * @param children Must be empty
 */
export function animation(
    options: AnimationOptions,
    ...children: readonly never[]
) {
    return media("animation", "animation()", options, children);
}
/**
 * Creates an audio media block. Accepts no children.
 *
 * @param options The {@link AudioOptions}
 * @param children Must be empty
 */
export function audio(options: AudioOptions, ...children: readonly never[]) {
    return media("audio", "audio()", options, children);
}
/**
 * Creates a photo media block. Accepts no children.
 *
 * @param options The {@link PhotoOptions}
 * @param children Must be empty
 */
export function photo(options: PhotoOptions, ...children: readonly never[]) {
    return media("photo", "photo()", options, children);
}
/**
 * Creates a video media block. Accepts no children.
 *
 * @param options The {@link VideoOptions}
 * @param children Must be empty
 */
export function video(options: VideoOptions, ...children: readonly never[]) {
    return media("video", "video()", options, children);
}
/**
 * Creates a voice-note media block. Accepts no children.
 *
 * @param options The {@link VoiceNoteOptions}
 * @param children Must be empty
 */
export function voiceNote(
    options: VoiceNoteOptions,
    ...children: readonly never[]
) {
    return media("voice_note", "voiceNote()", options, children);
}
