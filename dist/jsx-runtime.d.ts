export type Child = Node | string | number | boolean | null | undefined | readonly Child[];
export interface Node {
    readonly kind: string;
    readonly props: Record<string, unknown>;
}
export type Component<P = Record<string, unknown>> = (props: P) => Node;
export declare const Fragment: unique symbol;
export declare function jsx(type: Component<any> | typeof Fragment, props: Record<string, unknown>): Child;
export declare const jsxs: typeof jsx;
export declare const jsxDEV: typeof jsx;
export declare namespace JSX {
    type Element = Node;
    interface ElementChildrenAttribute {
        children: {};
    }
    interface IntrinsicElements {
    }
}
//# sourceMappingURL=jsx-runtime.d.ts.map