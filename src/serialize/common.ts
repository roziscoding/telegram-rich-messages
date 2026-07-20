import type { Child, Node } from "../jsx-runtime.js";

export function flatten(child: Child): Exclude<Child, readonly Child[]>[] {
  if (Array.isArray(child)) return child.flatMap(flatten);
  return [child as Exclude<Child, readonly Child[]>];
}

export function childNodes(child: Child, context: string): Node[] {
  const result: Node[] = [];
  for (const item of flatten(child)) {
    if (item == null || typeof item === "boolean") continue;
    if (typeof item === "string" && item.trim() === "") continue;
    if (typeof item !== "object" || Array.isArray(item)) {
      throw new TypeError(`${context} only accepts TSX elements`);
    }
    result.push(item);
  }
  return result;
}
