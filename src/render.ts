import type { Child, Node } from "./jsx-runtime.js";
import type { InputRichMessage } from "./types.js";
import { block } from "./serialize/blocks.js";
import { childNodes } from "./serialize/common.js";

export function render(element: Node): InputRichMessage {
  if (element.kind !== "rich-message") throw new TypeError("render() expects a <RichMessage> root");
  const blocks = childNodes(element.props.children as Child, "<RichMessage>").map(block);
  const result: InputRichMessage = { blocks };
  if (element.props.isRtl === true) result.is_rtl = true;
  if (element.props.skipEntityDetection === true) result.skip_entity_detection = true;
  return result;
}
