import { childNodes } from "./common.js";
import { richText } from "./rich-text.js";
function caption(props) {
    if (props.caption === undefined) {
        if (props.credit !== undefined)
            throw new TypeError("credit requires caption text");
        return undefined;
    }
    const value = { text: richText(props.caption) };
    if (props.credit !== undefined)
        value.credit = richText(props.credit);
    return value;
}
function setOptional(target, key, value) {
    if (value !== undefined && value !== false)
        target[key] = value;
}
function listItem(value) {
    if (value.kind !== "list-item")
        throw new TypeError("<List> only accepts <ListItem> children");
    const result = {
        blocks: childNodes(value.props.children, "<ListItem>").map(block),
    };
    if (value.props.checkbox === true)
        result.has_checkbox = true;
    if (value.props.checked === true)
        result.is_checked = true;
    if (value.props.value !== undefined)
        result.value = value.props.value;
    if (value.props.labelType !== undefined)
        result.type = value.props.labelType;
    return result;
}
function tableCell(value) {
    if (value.kind !== "table-cell")
        throw new TypeError("<TableRow> only accepts <TableCell> children");
    const result = {
        text: richText(value.props.children),
        align: value.props.align ?? "left",
        valign: value.props.valign ?? "top",
    };
    if (value.props.header === true)
        result.is_header = true;
    if (value.props.colspan !== undefined)
        result.colspan = value.props.colspan;
    if (value.props.rowspan !== undefined)
        result.rowspan = value.props.rowspan;
    return result;
}
function serializeTextBlock(value) {
    return { type: value.kind, text: richText(value.props.children) };
}
function serializeHeading(value) {
    return { type: "heading", text: richText(value.props.children), size: value.props.size };
}
function serializePre(value) {
    const result = { type: "pre", text: richText(value.props.children) };
    setOptional(result, "language", value.props.language);
    return result;
}
function serializeList(value) {
    return { type: "list", items: childNodes(value.props.children, "<List>").map(listItem) };
}
function serializeBlockQuote(value) {
    const result = {
        type: "blockquote",
        blocks: childNodes(value.props.children, "<BlockQuote>").map(block),
    };
    if (value.props.credit !== undefined)
        result.credit = richText(value.props.credit);
    return result;
}
function serializePullQuote(value) {
    const result = { type: "pullquote", text: richText(value.props.children) };
    if (value.props.credit !== undefined)
        result.credit = richText(value.props.credit);
    return result;
}
function serializeBlockCollection(value) {
    const result = {
        type: value.kind,
        blocks: childNodes(value.props.children, `<${value.kind}>`).map(block),
    };
    setOptional(result, "caption", caption(value.props));
    return result;
}
function serializeTable(value) {
    const rows = childNodes(value.props.children, "<Table>").map((row) => {
        if (row.kind !== "table-row")
            throw new TypeError("<Table> only accepts <TableRow> children");
        return childNodes(row.props.children, "<TableRow>").map(tableCell);
    });
    const result = { type: "table", cells: rows };
    if (value.props.bordered === true)
        result.is_bordered = true;
    if (value.props.striped === true)
        result.is_striped = true;
    if (value.props.caption !== undefined)
        result.caption = richText(value.props.caption);
    return result;
}
function serializeDetails(value) {
    const result = {
        type: "details",
        summary: richText(value.props.summary),
        blocks: childNodes(value.props.children, "<Details>").map(block),
    };
    if (value.props.open === true)
        result.is_open = true;
    return result;
}
function serializeMap(value) {
    const zoom = value.props.zoom;
    const width = value.props.width;
    const height = value.props.height;
    if (!Number.isInteger(zoom) || zoom < 0 || zoom > 24)
        throw new RangeError("<Map> zoom must be an integer from 0 to 24");
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0 || width + height > 10_000) {
        throw new RangeError("<Map> width and height must be non-negative integers whose total does not exceed 10000");
    }
    if ((width === 0) !== (height === 0) || (width > 0 && Math.max(width / height, height / width) > 20)) {
        throw new RangeError("<Map> width-to-height ratio must not exceed 20");
    }
    const result = { type: "map", location: value.props.location, zoom, width, height };
    setOptional(result, "caption", caption(value.props));
    return result;
}
function serializeMediaBlock(value) {
    const result = { type: value.kind, [value.kind]: value.props.media };
    setOptional(result, "caption", caption(value.props));
    return result;
}
const blockSerializers = new Map([
    ...["paragraph", "footer", "thinking"]
        .map((kind) => [kind, serializeTextBlock]),
    ["heading", serializeHeading],
    ["pre", serializePre],
    ["divider", () => ({ type: "divider" })],
    ["block-mathematical_expression", (value) => ({ type: "mathematical_expression", expression: value.props.expression })],
    ["block-anchor", (value) => ({ type: "anchor", name: value.props.name })],
    ["list", serializeList],
    ["blockquote", serializeBlockQuote],
    ["pullquote", serializePullQuote],
    ["collage", serializeBlockCollection],
    ["slideshow", serializeBlockCollection],
    ["table", serializeTable],
    ["details", serializeDetails],
    ["map", serializeMap],
    ...["animation", "audio", "photo", "video", "voice_note"]
        .map((kind) => [kind, serializeMediaBlock]),
]);
export function block(value) {
    const serializer = blockSerializers.get(value.kind);
    if (!serializer)
        throw new TypeError(`Expected a rich-message block, received <${value.kind}>`);
    return serializer(value);
}
//# sourceMappingURL=blocks.js.map