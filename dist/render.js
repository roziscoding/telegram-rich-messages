import { block } from "./serialize/blocks.js";
import { childNodes } from "./serialize/common.js";
export function render(element) {
    if (element.kind !== "rich-message")
        throw new TypeError("render() expects a <RichMessage> root");
    const blocks = childNodes(element.props.children, "<RichMessage>").map(block);
    const result = { blocks };
    if (element.props.isRtl === true)
        result.is_rtl = true;
    if (element.props.skipEntityDetection === true)
        result.skip_entity_detection = true;
    return result;
}
//# sourceMappingURL=render.js.map