import {
  heading,
  paragraph,
  pre,
  footer,
  divider,
  mathBlock,
  blockAnchor,
  animation,
  audio,
  photo,
  video,
  voiceNote,
  list,
  blockQuote,
  pullQuote,
  collage,
  slideshow,
  details,
  thinking,
  type BlockInput,
  type HeadingOptions,
  type PreOptions,
  type TableOptions,
  type AnimationOptions,
  type AudioOptions,
  type PhotoOptions,
  type VideoOptions,
  type VoiceNoteOptions,
  type BlockQuoteOptions,
  type PullQuoteOptions,
  type CaptionOptions,
  type DetailsOptions,
  type ListItemInput,
} from "../core/blocks";
import { richMessage, type RichMessageOptions } from "../core/message";
import type { RichTextInput } from "../core/text";
import { blocks as normalizeBlocks } from "../core/shared";
import { cloneValue, type BlockValue, type RichMessageValue } from "../core/values";
import type { InputFile, InputRichMessage } from "../deps";
import { TableBuilder, type TableConfigurator } from "./table";

export class RichMessage implements InputRichMessage<InputFile> {
  readonly #options: RichMessageOptions;
  readonly #blocks: BlockValue[] = [];

  constructor(options: RichMessageOptions = {}) {
    this.#options = { ...options };
  }

  get blocks(): BlockValue[] {
    return cloneValue(this.#blocks);
  }

  get is_rtl(): boolean {
    return this.#options.isRtl === true;
  }

  get skip_entity_detection(): boolean {
    return this.#options.skipEntityDetection === true;
  }

  add(...values: readonly BlockInput[]): this {
    this.#blocks.push(...cloneValue(normalizeBlocks(values, "RichMessage.add()")));
    return this;
  }

  paragraph(...content: readonly RichTextInput[]): this {
    return this.add(paragraph(...content));
  }

  heading(content: RichTextInput, options: HeadingOptions): this {
    return this.add(heading(options, content));
  }

  pre(content: RichTextInput, options: PreOptions = {}): this {
    return this.add(pre(options, content));
  }

  footer(...content: readonly RichTextInput[]): this {
    return this.add(footer(...content));
  }

  divider(): this {
    return this.add(divider());
  }

  mathBlock(expression: string): this {
    return this.add(mathBlock({ expression }));
  }

  anchor(name: string): this {
    return this.add(blockAnchor({ name }));
  }

  thinking(...content: readonly RichTextInput[]): this {
    return this.add(thinking(...content));
  }

  animation(options: AnimationOptions): this {
    return this.add(animation(options));
  }

  audio(options: AudioOptions): this {
    return this.add(audio(options));
  }

  photo(options: PhotoOptions): this {
    return this.add(photo(options));
  }

  video(options: VideoOptions): this {
    return this.add(video(options));
  }

  voiceNote(options: VoiceNoteOptions): this {
    return this.add(voiceNote(options));
  }

  list(...items: readonly ListItemInput[]): this {
    return this.add(list(...items));
  }

  details(options: DetailsOptions, ...children: readonly BlockInput[]): this {
    return this.add(details(options, ...children));
  }

  blockQuote(...children: readonly BlockInput[]): this;
  blockQuote(options: BlockQuoteOptions, ...children: readonly BlockInput[]): this;
  blockQuote(first?: BlockQuoteOptions | BlockInput, ...rest: readonly BlockInput[]): this {
    return this.add((blockQuote as (f?: BlockQuoteOptions | BlockInput, ...r: readonly BlockInput[]) => BlockValue)(first, ...rest));
  }

  pullQuote(...children: readonly RichTextInput[]): this;
  pullQuote(options: PullQuoteOptions, ...children: readonly RichTextInput[]): this;
  pullQuote(first?: PullQuoteOptions | RichTextInput, ...rest: readonly RichTextInput[]): this {
    return this.add((pullQuote as (f?: PullQuoteOptions | RichTextInput, ...r: readonly RichTextInput[]) => BlockValue)(first, ...rest));
  }

  collage(...children: readonly BlockInput[]): this;
  collage(options: CaptionOptions, ...children: readonly BlockInput[]): this;
  collage(first?: CaptionOptions | BlockInput, ...rest: readonly BlockInput[]): this {
    return this.add((collage as (f?: CaptionOptions | BlockInput, ...r: readonly BlockInput[]) => BlockValue)(first, ...rest));
  }

  slideshow(...children: readonly BlockInput[]): this;
  slideshow(options: CaptionOptions, ...children: readonly BlockInput[]): this;
  slideshow(first?: CaptionOptions | BlockInput, ...rest: readonly BlockInput[]): this {
    return this.add((slideshow as (f?: CaptionOptions | BlockInput, ...r: readonly BlockInput[]) => BlockValue)(first, ...rest));
  }

  table(configure: TableConfigurator): this;
  table(options: TableOptions, configure: TableConfigurator): this;
  table(first: TableOptions | TableConfigurator, second?: TableConfigurator): this {
    const options = typeof first === "function" ? {} : first;
    const configure = typeof first === "function" ? first : second;
    if (configure === undefined) throw new TypeError("RichMessage.table() requires a configurator");

    const builder = new TableBuilder(options);
    configure(builder);
    return this.add(builder.build());
  }

  toJSON(): RichMessageValue {
    return richMessage(this.#options, ...cloneValue(this.#blocks));
  }
}
