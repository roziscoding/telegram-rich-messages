import type { Child, ElementChild } from "./jsx-runtime";
import type {
  InputFile,
  InputMediaAnimation,
  InputMediaAudio,
  InputMediaPhoto,
  InputMediaVideo,
  InputMediaVoiceNote,
  Location,
} from "../deps";
import {
  animation,
  audio,
  blockAnchor,
  blockQuote,
  collage,
  details,
  divider,
  footer,
  heading,
  list,
  listItem,
  map as mapBuilder,
  mathBlock,
  paragraph,
  photo,
  pre,
  pullQuote,
  slideshow,
  table,
  tableCell,
  tableRow,
  thinking,
  video,
  voiceNote,
  type AnimationOptions,
  type AudioOptions,
  type BlockInput,
  type CaptionOptions,
  type ListItemInput,
  type ListItemOptions,
  type PhotoOptions,
  type TableCellInput,
  type TableOptions,
  type TableRowInput,
  type VideoOptions,
  type VoiceNoteOptions,
} from "../core/blocks";
import type { RichTextInput } from "../core/text";
import type { CaptionProps, ChildrenProps, ElementChildrenProps, NoChildrenProps } from "./shared";

function richChildren(children: Child): RichTextInput[] {
  return children === undefined ? [] : [children as RichTextInput];
}
function blockChildren(children: ElementChild): BlockInput<InputFile>[] {
  return children === undefined ? [] : [children as BlockInput<InputFile>];
}

function forbiddenChildren(children: unknown): never[] {
  return children === undefined ? [] : [children as never];
}

export function Paragraph({ children }: ChildrenProps) { return paragraph(...richChildren(children)); }
export function Heading({ children, ...options }: ChildrenProps & { size: 1 | 2 | 3 | 4 | 5 | 6 }) {
  return heading(options, ...richChildren(children));
}
export function Pre({ children, ...options }: ChildrenProps & { language?: string }) {
  return pre(options, ...richChildren(children));
}
export function Footer({ children }: ChildrenProps) { return footer(...richChildren(children)); }
export function Divider({ children }: NoChildrenProps) { return divider(...forbiddenChildren(children)); }
export function MathBlock({ children, ...options }: { expression: string } & NoChildrenProps) {
  return mathBlock(options, ...forbiddenChildren(children));
}
export function BlockAnchor({ children, ...options }: { name: string } & NoChildrenProps) {
  return blockAnchor(options, ...forbiddenChildren(children));
}
export function List({ children }: ElementChildrenProps) {
  return list(...(children === undefined ? [] : [children as ListItemInput]));
}

type ListItemSelectionProps =
  | { checkbox: true; checked?: boolean }
  | { checkbox?: false; checked?: never };
export function ListItem({ children, ...options }: ElementChildrenProps & ListItemSelectionProps & { value?: number; labelType?: "a" | "A" | "i" | "I" | "1" }) {
  return listItem(options as ListItemOptions, ...blockChildren(children));
}
export function BlockQuote({ children, credit }: ElementChildrenProps & { credit?: Child }) {
  const options = credit === undefined ? {} : { credit: credit as RichTextInput };
  return blockQuote(options, ...blockChildren(children));
}
export function PullQuote({ children, credit }: ChildrenProps & { credit?: Child }) {
  const options = credit === undefined ? {} : { credit: credit as RichTextInput };
  return pullQuote(options, ...richChildren(children));
}
export function Collage({ children, ...options }: ElementChildrenProps & CaptionProps) {
  return collage(options as CaptionOptions, ...blockChildren(children));
}
export function Slideshow({ children, ...options }: ElementChildrenProps & CaptionProps) {
  return slideshow(options as CaptionOptions, ...blockChildren(children));
}
export function Table({ children, ...options }: ElementChildrenProps & { bordered?: boolean; striped?: boolean; caption?: Child }) {
  return table(options as TableOptions, ...(children === undefined ? [] : [children as TableRowInput]));
}
export function TableRow({ children }: ElementChildrenProps) {
  return tableRow(...(children === undefined ? [] : [children as TableCellInput]));
}
export function TableCell({ children, ...options }: ChildrenProps & { header?: boolean; colspan?: number; rowspan?: number; align?: "left" | "center" | "right"; valign?: "top" | "middle" | "bottom" }) {
  return tableCell(options, ...richChildren(children));
}
export function Details({ children, summary, open }: ElementChildrenProps & { summary: Child; open?: boolean }) {
  return details({ summary: summary as RichTextInput, ...(open === undefined ? {} : { open }) }, ...blockChildren(children));
}
export function Map({ children, ...options }: { location: Location; zoom: number; width: number; height: number } & CaptionProps & NoChildrenProps) {
  return mapBuilder(options as Parameters<typeof mapBuilder>[0], ...forbiddenChildren(children));
}
export function Animation({ children, ...options }: { media: InputMediaAnimation<InputFile> } & CaptionProps & NoChildrenProps) {
  return animation(options as AnimationOptions, ...forbiddenChildren(children));
}
export function Audio({ children, ...options }: { media: InputMediaAudio<InputFile> } & CaptionProps & NoChildrenProps) {
  return audio(options as AudioOptions, ...forbiddenChildren(children));
}
export function Photo({ children, ...options }: { media: InputMediaPhoto<InputFile> } & CaptionProps & NoChildrenProps) {
  return photo(options as PhotoOptions, ...forbiddenChildren(children));
}
export function Video({ children, ...options }: { media: InputMediaVideo<InputFile> } & CaptionProps & NoChildrenProps) {
  return video(options as VideoOptions, ...forbiddenChildren(children));
}
export function VoiceNote({ children, ...options }: { media: InputMediaVoiceNote<InputFile> } & CaptionProps & NoChildrenProps) {
  return voiceNote(options as VoiceNoteOptions, ...forbiddenChildren(children));
}

/**
 * A temporary “Thinking…” block. Telegram only permits this block in
 * sendRichMessageDraft payloads; the component cannot infer the eventual endpoint.
 */
export function Thinking({ children }: ChildrenProps) { return thinking(...richChildren(children)); }
