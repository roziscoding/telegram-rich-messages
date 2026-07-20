export function flatten(child) {
    if (Array.isArray(child))
        return child.flatMap(flatten);
    return [child];
}
export function childNodes(child, context) {
    const result = [];
    for (const item of flatten(child)) {
        if (item == null || typeof item === "boolean")
            continue;
        if (typeof item === "string" && item.trim() === "")
            continue;
        if (typeof item !== "object" || Array.isArray(item)) {
            throw new TypeError(`${context} only accepts TSX elements`);
        }
        result.push(item);
    }
    return result;
}
//# sourceMappingURL=common.js.map