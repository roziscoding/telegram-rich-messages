export const Fragment = Symbol.for("telegram-rich-messages.fragment");
export function jsx(type, props) {
    if (type === Fragment)
        return props.children;
    return type(props);
}
export const jsxs = jsx;
export const jsxDEV = jsx;
//# sourceMappingURL=jsx-runtime.js.map