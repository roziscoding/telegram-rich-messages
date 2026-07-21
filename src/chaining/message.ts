import {
    animation,
    type AnimationOptions,
    audio,
    type AudioOptions,
    blockAnchor,
    type BlockInput,
    blockQuote,
    type BlockQuoteOptions,
    type CaptionOptions,
    collage,
    details,
    type DetailsOptions,
    divider,
    footer,
    heading,
    type HeadingOptions,
    list,
    type ListItemInput,
    mathBlock,
    paragraph,
    photo,
    type PhotoOptions,
    pre,
    type PreOptions,
    pullQuote,
    type PullQuoteOptions,
    slideshow,
    type TableOptions,
    thinking,
    video,
    type VideoOptions,
    voiceNote,
    type VoiceNoteOptions,
} from "../core/blocks.ts";
import { richMessage, type RichMessageOptions } from "../core/message.ts";
import type { RichTextInput } from "../core/text.ts";
import { blocks as normalizeBlocks } from "../core/shared.ts";
import {
    type BlockValue,
    cloneValue,
    type RichMessageValue,
} from "../core/values.ts";
import type { InputRichMessage } from "../deps.deno.ts";
import { TableBuilder, type TableConfigurator } from "./table.ts";

export class RichMessage implements InputRichMessage {
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
        this.#blocks.push(
            ...cloneValue(normalizeBlocks(values, "RichMessage.add()")),
        );
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
    blockQuote(
        options: BlockQuoteOptions,
        ...children: readonly BlockInput[]
    ): this;
    blockQuote(
        first?: BlockQuoteOptions | BlockInput,
        ...rest: readonly BlockInput[]
    ): this {
        return this.add(
            (blockQuote as (
                f?: BlockQuoteOptions | BlockInput,
                ...r: readonly BlockInput[]
            ) => BlockValue)(first, ...rest),
        );
    }

    pullQuote(...children: readonly RichTextInput[]): this;
    pullQuote(
        options: PullQuoteOptions,
        ...children: readonly RichTextInput[]
    ): this;
    pullQuote(
        first?: PullQuoteOptions | RichTextInput,
        ...rest: readonly RichTextInput[]
    ): this {
        return this.add(
            (pullQuote as (
                f?: PullQuoteOptions | RichTextInput,
                ...r: readonly RichTextInput[]
            ) => BlockValue)(first, ...rest),
        );
    }

    collage(...children: readonly BlockInput[]): this;
    collage(options: CaptionOptions, ...children: readonly BlockInput[]): this;
    collage(
        first?: CaptionOptions | BlockInput,
        ...rest: readonly BlockInput[]
    ): this {
        return this.add(
            (collage as (
                f?: CaptionOptions | BlockInput,
                ...r: readonly BlockInput[]
            ) => BlockValue)(first, ...rest),
        );
    }

    slideshow(...children: readonly BlockInput[]): this;
    slideshow(
        options: CaptionOptions,
        ...children: readonly BlockInput[]
    ): this;
    slideshow(
        first?: CaptionOptions | BlockInput,
        ...rest: readonly BlockInput[]
    ): this {
        return this.add(
            (slideshow as (
                f?: CaptionOptions | BlockInput,
                ...r: readonly BlockInput[]
            ) => BlockValue)(first, ...rest),
        );
    }

    table(configure: TableConfigurator): this;
    table(options: TableOptions, configure: TableConfigurator): this;
    table(
        first: TableOptions | TableConfigurator,
        second?: TableConfigurator,
    ): this {
        const options = typeof first === "function" ? {} : first;
        const configure = typeof first === "function" ? first : second;
        if (configure === undefined) {
            throw new TypeError("RichMessage.table() requires a configurator");
        }

        const builder = new TableBuilder(options);
        configure(builder);
        return this.add(builder.build());
    }

    toJSON(): RichMessageValue {
        return richMessage(this.#options, ...cloneValue(this.#blocks));
    }
}
