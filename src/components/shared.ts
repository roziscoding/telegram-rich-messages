import type { Child, Node } from "../jsx-runtime.js";

export type CaptionProps =
  | { caption: Child; credit?: Child }
  | { caption?: undefined; credit?: never };

export interface ChildrenProps { children?: Child; }

export function node(kind: string, props: object): Node {
  return { kind, props: props as Record<string, unknown> };
}
