// deno-lint-ignore-file no-explicit-any no-namespace ban-types no-empty-interface -- JSX runtime typing requires the JSX namespace, `{}`, empty interfaces, and an `any` component type
import type {
    BlockValue,
    ListItemValue,
    RichMessageValue,
    RichTextValue,
    TableCellValue,
    TableRowValue,
} from "../core/values.ts";

/**
 * Represents any rich-message value a JSX element can evaluate to.
 */
export type Element =
    | RichTextValue
    | BlockValue
    | ListItemValue
    | TableCellValue
    | TableRowValue
    | RichMessageValue;
/**
 * Represents anything that may appear as a child in a JSX tree: an
 * {@link Element}, a primitive, a nullish value, or a nested array of these.
 */
export type Child =
    | Element
    | string
    | number
    | boolean
    | null
    | undefined
    | readonly Child[];
/**
 * Represents a child restricted to {@link Element} values (no strings or
 * numbers), plus the nullish and nested-array forms.
 */
export type ElementChild =
    | Element
    | boolean
    | null
    | undefined
    | readonly ElementChild[];

/**
 * Represents props that accept any {@link Child} as their children.
 */
export interface ChildrenProps {
    /** Optional children of any {@link Child} type. */
    children?: Child;
}
/**
 * Represents props whose children are restricted to {@link ElementChild}.
 */
export interface ElementChildrenProps {
    /** Optional children restricted to {@link ElementChild}. */
    children?: ElementChild;
}
/**
 * Represents props that forbid children.
 */
export interface NoChildrenProps {
    /** Children are not allowed on these props. */
    children?: never;
}
/**
 * Represents props that carry an optional caption and credit, where a
 * credit may only be given alongside a caption.
 */
export type CaptionProps =
    | { caption: Child; credit?: Child }
    | { caption?: undefined; credit?: never };

/**
 * Represents a component function that maps props to an {@link Element}.
 */
export type Component<P = Record<string, unknown>> = (props: P) => Element;

/**
 * Marker symbol used for JSX fragments (`<>...</>`).
 */
export const Fragment = Symbol.for("grammy-rich-messages.fragment");

/**
 * JSX factory the TypeScript compiler calls for each element. It is
 * compiler-facing; users do not call it directly.
 *
 * @param type The component to invoke, or {@link Fragment} for a fragment
 * @param props The element's props, including its `children`
 */
export function jsx(
    type: Component<any> | typeof Fragment,
    props: Record<string, unknown>,
): Child {
    if (type === Fragment) return props.children as Child;
    return type(props);
}

/**
 * Alias of {@link jsx} used by the compiler for elements with static children.
 */
export const jsxs = jsx;
/**
 * Alias of {@link jsx} used by the compiler in development builds.
 */
export const jsxDEV = jsx;

export namespace JSX {
    export type Element = import("./jsx-runtime.ts").Element;
    export interface ElementChildrenAttribute {
        children: {};
    }
    export interface IntrinsicElements {}
}
