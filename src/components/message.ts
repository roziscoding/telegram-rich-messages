import type { Node } from "../jsx-runtime.js";
import { node, type ChildrenProps } from "./shared.js";

export function RichMessage(props: ChildrenProps & { isRtl?: boolean; skipEntityDetection?: boolean }): Node {
  return node("rich-message", props);
}
