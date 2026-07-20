import type { Node, NodeKind, NodePropsByKind } from "../jsx-runtime.js";

export type {
  CaptionProps,
  ChildrenProps,
  ElementChild,
  ElementChildrenProps,
  ListItemSelectionProps,
  NoChildrenProps,
} from "../jsx-runtime.js";

export function node<K extends NodeKind>(kind: K, props: NodePropsByKind[K]): Node<K> {
  return { kind, props } as Node<K>;
}
