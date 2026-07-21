import type { Child, ElementChild } from "./jsx-runtime.ts";
import type {
    InputMediaAnimation,
    InputMediaAudio,
    InputMediaPhoto,
    InputMediaVideo,
    InputMediaVoiceNote,
    Location,
} from "../deps.deno.ts";
import {
    animation,
    type AnimationOptions,
    audio,
    type AudioOptions,
    blockAnchor,
    type BlockInput,
    blockQuote,
    type CaptionOptions,
    collage,
    details,
    divider,
    footer,
    heading,
    list,
    listItem,
    type ListItemInput,
    type ListItemOptions,
    map as mapBuilder,
    mathBlock,
    paragraph,
    photo,
    type PhotoOptions,
    pre,
    pullQuote,
    slideshow,
    table,
    tableCell,
    type TableCellInput,
    type TableOptions,
    tableRow,
    type TableRowInput,
    thinking,
    video,
    type VideoOptions,
    voiceNote,
    type VoiceNoteOptions,
} from "../core/blocks.ts";
import type { RichTextInput } from "../core/text.ts";
import type {
    CaptionProps,
    ChildrenProps,
    ElementChildrenProps,
    NoChildrenProps,
} from "./shared.ts";

function richChildren(children: Child): RichTextInput[] {
    return children === undefined ? [] : [children as RichTextInput];
}
function blockChildren(children: ElementChild): BlockInput[] {
    return children === undefined ? [] : [children as BlockInput];
}

function forbiddenChildren(children: unknown): never[] {
    return children === undefined ? [] : [children as never];
}

/**
 * TSX component for a paragraph block. The TSX form of {@link paragraph}.
 */
export function Paragraph({ children }: ChildrenProps) {
    return paragraph(...richChildren(children));
}
/**
 * TSX component for a heading block. The TSX form of {@link heading}.
 *
 * @param props Heading props, mirroring {@link HeadingOptions}
 */
export function Heading(
    { children, ...options }: ChildrenProps & { size: 1 | 2 | 3 | 4 | 5 | 6 },
) {
    return heading(options, ...richChildren(children));
}
/**
 * TSX component for a preformatted block. The TSX form of {@link pre}.
 *
 * @param props Pre props, mirroring {@link PreOptions}
 */
export function Pre(
    { children, ...options }: ChildrenProps & { language?: string },
) {
    return pre(options, ...richChildren(children));
}
/**
 * TSX component for a footer block. The TSX form of {@link footer}.
 */
export function Footer({ children }: ChildrenProps) {
    return footer(...richChildren(children));
}
/**
 * TSX component for a divider block. The TSX form of {@link divider}.
 */
export function Divider({ children }: NoChildrenProps) {
    return divider(...forbiddenChildren(children));
}
/**
 * TSX component for a math block. The TSX form of {@link mathBlock}.
 *
 * @param props Math block props, mirroring {@link MathBlockOptions}
 */
export function MathBlock(
    { children, ...options }: { expression: string } & NoChildrenProps,
) {
    return mathBlock(options, ...forbiddenChildren(children));
}
/**
 * TSX component for a block anchor. The TSX form of {@link blockAnchor}.
 *
 * @param props Block anchor props, mirroring {@link BlockAnchorOptions}
 */
export function BlockAnchor(
    { children, ...options }: { name: string } & NoChildrenProps,
) {
    return blockAnchor(options, ...forbiddenChildren(children));
}
/**
 * TSX component for a list block. The TSX form of {@link list}.
 */
export function List({ children }: ElementChildrenProps) {
    return list(...(children === undefined ? [] : [children as ListItemInput]));
}

type ListItemSelectionProps =
    | { checkbox: true; checked?: boolean }
    | { checkbox?: false; checked?: never };
/**
 * TSX component for a list item block. The TSX form of {@link listItem}.
 *
 * @param props List item props, mirroring {@link ListItemOptions}
 */
export function ListItem(
    { children, ...options }: ElementChildrenProps & ListItemSelectionProps & {
        value?: number;
        labelType?: "a" | "A" | "i" | "I" | "1";
    },
) {
    return listItem(options as ListItemOptions, ...blockChildren(children));
}
/**
 * TSX component for a block quote. The TSX form of {@link blockQuote}.
 *
 * @param props Block quote props, mirroring {@link BlockQuoteOptions}
 */
export function BlockQuote(
    { children, credit }: ElementChildrenProps & { credit?: Child },
) {
    const options = credit === undefined
        ? {}
        : { credit: credit as RichTextInput };
    return blockQuote(options, ...blockChildren(children));
}
/**
 * TSX component for a pull quote. The TSX form of {@link pullQuote}.
 *
 * @param props Pull quote props, mirroring {@link PullQuoteOptions}
 */
export function PullQuote(
    { children, credit }: ChildrenProps & { credit?: Child },
) {
    const options = credit === undefined
        ? {}
        : { credit: credit as RichTextInput };
    return pullQuote(options, ...richChildren(children));
}
/**
 * TSX component for a collage block. The TSX form of {@link collage}.
 *
 * @param props Collage props, mirroring {@link CaptionOptions}
 */
export function Collage(
    { children, ...options }: ElementChildrenProps & CaptionProps,
) {
    return collage(options as CaptionOptions, ...blockChildren(children));
}
/**
 * TSX component for a slideshow block. The TSX form of {@link slideshow}.
 *
 * @param props Slideshow props, mirroring {@link CaptionOptions}
 */
export function Slideshow(
    { children, ...options }: ElementChildrenProps & CaptionProps,
) {
    return slideshow(options as CaptionOptions, ...blockChildren(children));
}
/**
 * TSX component for a table block. The TSX form of {@link table}.
 *
 * @param props Table props, mirroring {@link TableOptions}
 */
export function Table(
    { children, ...options }: ElementChildrenProps & {
        bordered?: boolean;
        striped?: boolean;
        caption?: Child;
    },
) {
    return table(
        options as TableOptions,
        ...(children === undefined ? [] : [children as TableRowInput]),
    );
}
/**
 * TSX component for a table row. The TSX form of {@link tableRow}.
 */
export function TableRow({ children }: ElementChildrenProps) {
    return tableRow(
        ...(children === undefined ? [] : [children as TableCellInput]),
    );
}
/**
 * TSX component for a table cell. The TSX form of {@link tableCell}.
 *
 * @param props Table cell props, mirroring {@link TableCellOptions}
 */
export function TableCell(
    { children, ...options }: ChildrenProps & {
        header?: boolean;
        colspan?: number;
        rowspan?: number;
        align?: "left" | "center" | "right";
        valign?: "top" | "middle" | "bottom";
    },
) {
    return tableCell(options, ...richChildren(children));
}
/**
 * TSX component for a collapsible details block. The TSX form of
 * {@link details}.
 *
 * @param props Details props, mirroring {@link DetailsOptions}
 */
export function Details(
    { children, summary, open }: ElementChildrenProps & {
        summary: Child;
        open?: boolean;
    },
) {
    return details({
        summary: summary as RichTextInput,
        ...(open === undefined ? {} : { open }),
    }, ...blockChildren(children));
}
/**
 * TSX component for a map block. The TSX form of {@link map}.
 *
 * @param props Map props, mirroring {@link MapOptions}
 */
export function Map(
    { children, ...options }:
        & { location: Location; zoom: number; width: number; height: number }
        & CaptionProps
        & NoChildrenProps,
) {
    return mapBuilder(
        options as Parameters<typeof mapBuilder>[0],
        ...forbiddenChildren(children),
    );
}
/**
 * TSX component for an animation block. The TSX form of {@link animation}.
 *
 * @param props Animation props, mirroring {@link AnimationOptions}
 */
export function Animation(
    { children, ...options }:
        & { media: InputMediaAnimation }
        & CaptionProps
        & NoChildrenProps,
) {
    return animation(
        options as AnimationOptions,
        ...forbiddenChildren(children),
    );
}
/**
 * TSX component for an audio block. The TSX form of {@link audio}.
 *
 * @param props Audio props, mirroring {@link AudioOptions}
 */
export function Audio(
    { children, ...options }:
        & { media: InputMediaAudio }
        & CaptionProps
        & NoChildrenProps,
) {
    return audio(options as AudioOptions, ...forbiddenChildren(children));
}
/**
 * TSX component for a photo block. The TSX form of {@link photo}.
 *
 * @param props Photo props, mirroring {@link PhotoOptions}
 */
export function Photo(
    { children, ...options }:
        & { media: InputMediaPhoto }
        & CaptionProps
        & NoChildrenProps,
) {
    return photo(options as PhotoOptions, ...forbiddenChildren(children));
}
/**
 * TSX component for a video block. The TSX form of {@link video}.
 *
 * @param props Video props, mirroring {@link VideoOptions}
 */
export function Video(
    { children, ...options }:
        & { media: InputMediaVideo }
        & CaptionProps
        & NoChildrenProps,
) {
    return video(options as VideoOptions, ...forbiddenChildren(children));
}
/**
 * TSX component for a voice note block. The TSX form of {@link voiceNote}.
 *
 * @param props Voice note props, mirroring {@link VoiceNoteOptions}
 */
export function VoiceNote(
    { children, ...options }:
        & { media: InputMediaVoiceNote }
        & CaptionProps
        & NoChildrenProps,
) {
    return voiceNote(
        options as VoiceNoteOptions,
        ...forbiddenChildren(children),
    );
}

/**
 * TSX component for a temporary thinking block. The TSX form of
 * {@link thinking}.
 */
export function Thinking({ children }: ChildrenProps) {
    return thinking(...richChildren(children));
}
