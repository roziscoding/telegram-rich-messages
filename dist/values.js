const valueKindKey = "__telegramRichMessagesValueKind";
export function brand(value, kind) {
    Object.defineProperty(value, valueKindKey, { value: kind, enumerable: false });
    return value;
}
export function kindOf(value) {
    return typeof value === "object" && value !== null
        ? value[valueKindKey]
        : undefined;
}
export function cloneValue(value) {
    return clone(value, new WeakMap());
}
function clone(value, seen) {
    if (typeof value !== "object" || value === null)
        return value;
    const existing = seen.get(value);
    if (existing !== undefined)
        return existing;
    if (Array.isArray(value)) {
        const result = [];
        seen.set(value, result);
        for (const item of value)
            result.push(clone(item, seen));
        return result;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
        return structuredClone(value);
    }
    const result = {};
    seen.set(value, result);
    for (const [key, item] of Object.entries(value))
        result[key] = clone(item, seen);
    const kind = kindOf(value);
    return (kind === undefined ? result : brand(result, kind));
}
//# sourceMappingURL=values.js.map