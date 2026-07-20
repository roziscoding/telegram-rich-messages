import { node, type ElementChildrenProps } from "./shared.js";

export function RichMessage(props: ElementChildrenProps & { isRtl?: boolean; skipEntityDetection?: boolean }) {
  return node("rich-message", props);
}
