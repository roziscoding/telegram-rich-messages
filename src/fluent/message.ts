import {
  heading,
  paragraph,
  pre,
  footer,
  divider,
  mathBlock,
  blockAnchor,
  type BlockInput,
  type HeadingOptions,
  type PreOptions,
  type TableOptions,
} from "../functions/blocks.js";
import { richMessage, type RichMessageOptions } from "../functions/message.js";
import type { RichTextInput } from "../functions/text.js";
import { blocks as normalizeBlocks } from "../functions/shared.js";
import { cloneValue, type BlockValue, type RichMessageValue } from "../values.js";
import { TableBuilder, type TableConfigurator } from "./table.js";

export class RichMessageBuilder {
  readonly #options: RichMessageOptions;
  readonly #blocks: BlockValue[] = [];

  constructor(options: RichMessageOptions = {}) {
    this.#options = { ...options };
  }

  get blocks(): readonly BlockValue[] {
    return cloneValue(this.#blocks);
  }

  add(...values: readonly BlockInput[]): this {
    this.#blocks.push(...cloneValue(normalizeBlocks(values, "RichMessageBuilder.add()")));
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

  table(configure: TableConfigurator): this;
  table(options: TableOptions, configure: TableConfigurator): this;
  table(first: TableOptions | TableConfigurator, second?: TableConfigurator): this {
    const options = typeof first === "function" ? {} : first;
    const configure = typeof first === "function" ? first : second;
    if (configure === undefined) throw new TypeError("RichMessageBuilder.table() requires a configurator");

    const builder = new TableBuilder(options);
    configure(builder);
    return this.add(builder.build());
  }

  build(): RichMessageValue {
    return richMessage(this.#options, ...cloneValue(this.#blocks));
  }
}
