import { type BlockInput, type HeadingOptions, type PreOptions, type TableOptions } from "../functions/blocks.js";
import { type RichMessageOptions } from "../functions/message.js";
import type { RichTextInput } from "../functions/text.js";
import { type BlockValue, type RichMessageValue } from "../values.js";
import { type TableConfigurator } from "./table.js";
export declare class RichMessageBuilder {
    #private;
    constructor(options?: RichMessageOptions);
    get blocks(): readonly BlockValue[];
    add(...values: readonly BlockInput[]): this;
    paragraph(...content: readonly RichTextInput[]): this;
    heading(content: RichTextInput, options: HeadingOptions): this;
    pre(content: RichTextInput, options?: PreOptions): this;
    footer(...content: readonly RichTextInput[]): this;
    divider(): this;
    mathBlock(expression: string): this;
    anchor(name: string): this;
    table(configure: TableConfigurator): this;
    table(options: TableOptions, configure: TableConfigurator): this;
    build(): RichMessageValue;
}
//# sourceMappingURL=message.d.ts.map