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

/**
 * Chaining builder for a rich message. Accumulates canonical block values
 * through chainable methods and implements `InputRichMessage`, so an instance
 * can be passed straight to grammY (or any Bot API client); {@link toJSON}
 * produces the canonical value on serialization. Every functional block builder
 * has a matching method here.
 */
export class RichMessage implements InputRichMessage {
    readonly #options: RichMessageOptions;
    readonly #blocks: BlockValue[] = [];

    /**
     * Creates a rich message builder.
     *
     * @param options Message options mirroring {@link RichMessageOptions}, such
     * as `isRtl` and `skipEntityDetection`
     */
    constructor(options: RichMessageOptions = {}) {
        this.#options = { ...options };
    }

    /**
     * A snapshot of the block values appended so far. The returned array is a
     * clone, so later mutations of the builder do not change earlier snapshots.
     */
    get blocks(): BlockValue[] {
        return cloneValue(this.#blocks);
    }

    /**
     * The `is_rtl` flag for the message, `true` when the message was configured
     * with `isRtl`.
     */
    get is_rtl(): boolean {
        return this.#options.isRtl === true;
    }

    /**
     * The `skip_entity_detection` flag for the message, `true` when the message
     * was configured with `skipEntityDetection`.
     */
    get skip_entity_detection(): boolean {
        return this.#options.skipEntityDetection === true;
    }

    /**
     * Appends one or more pre-built block values, normalizing each input into a
     * canonical block value.
     *
     * @param values Block inputs to append
     * @returns this for chaining
     */
    add(...values: readonly BlockInput[]): this {
        this.#blocks.push(
            ...cloneValue(normalizeBlocks(values, "RichMessage.add()")),
        );
        return this;
    }

    /**
     * Appends a paragraph block. The chaining form of {@link paragraph}.
     *
     * @param content Rich text making up the paragraph
     * @returns this for chaining
     */
    paragraph(...content: readonly RichTextInput[]): this {
        return this.add(paragraph(...content));
    }

    /**
     * Appends a heading block. The chaining form of {@link heading}.
     *
     * @param content Rich text for the heading
     * @param options Heading options such as its level
     * @returns this for chaining
     */
    heading(content: RichTextInput, options: HeadingOptions): this {
        return this.add(heading(options, content));
    }

    /**
     * Appends a preformatted block. The chaining form of {@link pre}.
     *
     * @param content Rich text for the preformatted block
     * @param options Pre options such as the language
     * @returns this for chaining
     */
    pre(content: RichTextInput, options: PreOptions = {}): this {
        return this.add(pre(options, content));
    }

    /**
     * Appends a footer block. The chaining form of {@link footer}.
     *
     * @param content Rich text making up the footer
     * @returns this for chaining
     */
    footer(...content: readonly RichTextInput[]): this {
        return this.add(footer(...content));
    }

    /**
     * Appends a divider block. The chaining form of {@link divider}.
     *
     * @returns this for chaining
     */
    divider(): this {
        return this.add(divider());
    }

    /**
     * Appends a math block. The chaining form of {@link mathBlock}.
     *
     * @param expression The math expression to render
     * @returns this for chaining
     */
    mathBlock(expression: string): this {
        return this.add(mathBlock({ expression }));
    }

    /**
     * Appends a block anchor that later blocks can link to. The chaining form
     * of {@link blockAnchor}.
     *
     * @param name The anchor name
     * @returns this for chaining
     */
    anchor(name: string): this {
        return this.add(blockAnchor({ name }));
    }

    /**
     * Appends a thinking block. The chaining form of {@link thinking}.
     *
     * @param content Rich text making up the thinking block
     * @returns this for chaining
     */
    thinking(...content: readonly RichTextInput[]): this {
        return this.add(thinking(...content));
    }

    /**
     * Appends an animation block. The chaining form of {@link animation}.
     *
     * @param options Animation options such as the media and caption
     * @returns this for chaining
     */
    animation(options: AnimationOptions): this {
        return this.add(animation(options));
    }

    /**
     * Appends an audio block. The chaining form of {@link audio}.
     *
     * @param options Audio options such as the media and caption
     * @returns this for chaining
     */
    audio(options: AudioOptions): this {
        return this.add(audio(options));
    }

    /**
     * Appends a photo block. The chaining form of {@link photo}.
     *
     * @param options Photo options such as the media and caption
     * @returns this for chaining
     */
    photo(options: PhotoOptions): this {
        return this.add(photo(options));
    }

    /**
     * Appends a video block. The chaining form of {@link video}.
     *
     * @param options Video options such as the media and caption
     * @returns this for chaining
     */
    video(options: VideoOptions): this {
        return this.add(video(options));
    }

    /**
     * Appends a voice note block. The chaining form of {@link voiceNote}.
     *
     * @param options Voice note options such as the media and caption
     * @returns this for chaining
     */
    voiceNote(options: VoiceNoteOptions): this {
        return this.add(voiceNote(options));
    }

    /**
     * Appends a list block. The chaining form of {@link list}.
     *
     * @param items The list items
     * @returns this for chaining
     */
    list(...items: readonly ListItemInput[]): this {
        return this.add(list(...items));
    }

    /**
     * Appends a details (collapsible) block. The chaining form of
     * {@link details}.
     *
     * @param options Details options such as the summary
     * @param children Child blocks revealed when expanded
     * @returns this for chaining
     */
    details(options: DetailsOptions, ...children: readonly BlockInput[]): this {
        return this.add(details(options, ...children));
    }

    /**
     * Appends a block quote. The chaining form of {@link blockQuote}. Options
     * may be passed as the first argument, otherwise all arguments are treated
     * as child blocks.
     *
     * @param options Block quote options, when provided
     * @param children Child blocks making up the quote
     * @returns this for chaining
     */
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

    /**
     * Appends a pull quote. The chaining form of {@link pullQuote}. Options may
     * be passed as the first argument, otherwise all arguments are treated as
     * rich text content.
     *
     * @param options Pull quote options, when provided
     * @param children Rich text making up the quote
     * @returns this for chaining
     */
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

    /**
     * Appends a collage of media. The chaining form of {@link collage}. Caption
     * options may be passed as the first argument, otherwise all arguments are
     * treated as child media blocks.
     *
     * @param options Caption options, when provided
     * @param children Child media blocks making up the collage
     * @returns this for chaining
     */
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

    /**
     * Appends a slideshow of media. The chaining form of {@link slideshow}.
     * Caption options may be passed as the first argument, otherwise all
     * arguments are treated as child media blocks.
     *
     * @param options Caption options, when provided
     * @param children Child media blocks making up the slideshow
     * @returns this for chaining
     */
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

    /**
     * Appends a table built by the given configurator. The callback receives a
     * {@link TableBuilder} whose {@link TableBuilder.row} and
     * {@link TableBuilder.rows} methods populate the table. Table options may be
     * passed before the configurator.
     *
     * @param options Table options, when provided
     * @param configure Callback that populates the table builder
     * @returns this for chaining
     */
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

    /**
     * Materializes the accumulated blocks and options into the canonical rich
     * message value. Called automatically when the instance is serialized to
     * JSON, so the builder can be passed directly to a Bot API client.
     *
     * @returns the canonical rich message value
     */
    toJSON(): RichMessageValue {
        return richMessage(this.#options, ...cloneValue(this.#blocks));
    }
}
