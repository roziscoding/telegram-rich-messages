import { heading, paragraph, pre, footer, divider, mathBlock, blockAnchor, } from "../functions/blocks.js";
import { richMessage } from "../functions/message.js";
import { blocks as normalizeBlocks } from "../functions/shared.js";
import { cloneValue } from "../values.js";
import { TableBuilder } from "./table.js";
export class RichMessageBuilder {
    #options;
    #blocks = [];
    constructor(options = {}) {
        this.#options = { ...options };
    }
    get blocks() {
        return cloneValue(this.#blocks);
    }
    add(...values) {
        this.#blocks.push(...cloneValue(normalizeBlocks(values, "RichMessageBuilder.add()")));
        return this;
    }
    paragraph(...content) {
        return this.add(paragraph(...content));
    }
    heading(content, options) {
        return this.add(heading(options, content));
    }
    pre(content, options = {}) {
        return this.add(pre(options, content));
    }
    footer(...content) {
        return this.add(footer(...content));
    }
    divider() {
        return this.add(divider());
    }
    mathBlock(expression) {
        return this.add(mathBlock({ expression }));
    }
    anchor(name) {
        return this.add(blockAnchor({ name }));
    }
    table(first, second) {
        const options = typeof first === "function" ? {} : first;
        const configure = typeof first === "function" ? first : second;
        if (configure === undefined)
            throw new TypeError("RichMessageBuilder.table() requires a configurator");
        const builder = new TableBuilder(options);
        configure(builder);
        return this.add(builder.build());
    }
    build() {
        return richMessage(this.#options, ...cloneValue(this.#blocks));
    }
}
//# sourceMappingURL=message.js.map