export type Child = Node | string | number | boolean | null | undefined | readonly Child[];

export interface Node {
  readonly kind: string;
  readonly props: Record<string, unknown>;
}

export type Component<P = Record<string, unknown>> = (props: P) => Node;

export const Fragment = Symbol.for("telegram-rich-messages.fragment");

export function jsx(type: Component<any> | typeof Fragment, props: Record<string, unknown>): Child {
  if (type === Fragment) return props.children as Child;
  return type(props);
}

export const jsxs = jsx;
export const jsxDEV = jsx;

export namespace JSX {
  export type Element = Node;
  export interface ElementChildrenAttribute { children: {}; }
  export interface IntrinsicElements {}
}
