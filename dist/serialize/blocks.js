import { childNodes } from "./common.js";
import { richText } from "./rich-text.js";
function caption(props) {
    if (props.caption === undefined) {
        if (props.credit !== undefined)
            throw new TypeError("credit requires caption text");
        return undefined;
    }
    return {
        text: richText(props.caption),
        ...(props.credit === undefined ? {} : { credit: richText(props.credit) }),
    };
}
function listItem(value) {
    if (value.kind !== "list-item")
        throw new TypeError("<List> only accepts <ListItem> children");
    const base = {
        blocks: childNodes(value.props.children, "<ListItem>").map(block),
        ...(value.props.value === undefined ? {} : { value: value.props.value }),
        ...(value.props.labelType === undefined ? {} : { type: value.props.labelType }),
    };
    if (value.props.checked === true && value.props.checkbox !== true) {
        throw new TypeError("checked requires checkbox");
    }
    if (value.props.checkbox === true) {
        return { ...base, has_checkbox: true, ...(value.props.checked === true ? { is_checked: true } : {}) };
    }
    return base;
}
function tableCell(value) {
    if (value.kind !== "table-cell")
        throw new TypeError("<TableRow> only accepts <TableCell> children");
    return {
        ...(value.props.children === undefined ? {} : { text: richText(value.props.children) }),
        align: value.props.align ?? "left",
        valign: value.props.valign ?? "top",
        ...(value.props.header === true ? { is_header: true } : {}),
        ...(value.props.colspan === undefined ? {} : { colspan: value.props.colspan }),
        ...(value.props.rowspan === undefined ? {} : { rowspan: value.props.rowspan }),
    };
}
function serializeBlockQuote(value) {
    return {
        type: "blockquote",
        blocks: childNodes(value.props.children, "<BlockQuote>").map(block),
        ...(value.props.credit === undefined ? {} : { credit: richText(value.props.credit) }),
    };
}
function serializePullQuote(value) {
    return {
        type: "pullquote",
        text: richText(value.props.children),
        ...(value.props.credit === undefined ? {} : { credit: richText(value.props.credit) }),
    };
}
function serializeCollection(type, value) {
    const richCaption = caption(value.props);
    return {
        type,
        blocks: childNodes(value.props.children, `<${type}>`).map(block),
        ...(richCaption === undefined ? {} : { caption: richCaption }),
    };
}
function serializeTable(value) {
    const cells = childNodes(value.props.children, "<Table>").map((row) => {
        if (row.kind !== "table-row")
            throw new TypeError("<Table> only accepts <TableRow> children");
        return childNodes(row.props.children, "<TableRow>").map(tableCell);
    });
    return {
        type: "table",
        cells,
        ...(value.props.bordered === true ? { is_bordered: true } : {}),
        ...(value.props.striped === true ? { is_striped: true } : {}),
        ...(value.props.caption === undefined ? {} : { caption: richText(value.props.caption) }),
    };
}
function serializeMap(value) {
    const { zoom, width, height } = value.props;
    if (!Number.isInteger(zoom) || zoom < 0 || zoom > 24)
        throw new RangeError("<Map> zoom must be an integer from 0 to 24");
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0 || width + height > 10_000) {
        throw new RangeError("<Map> width and height must be non-negative integers whose total does not exceed 10000");
    }
    if ((width === 0) !== (height === 0) || (width > 0 && Math.max(width / height, height / width) > 20)) {
        throw new RangeError("<Map> width-to-height ratio must not exceed 20");
    }
    const richCaption = caption(value.props);
    return {
        type: "map",
        location: value.props.location,
        zoom,
        width,
        height,
        ...(richCaption === undefined ? {} : { caption: richCaption }),
    };
}
const blockSerializerDefinitions = {
    paragraph: (value) => ({ type: "paragraph", text: richText(value.props.children) }),
    footer: (value) => ({ type: "footer", text: richText(value.props.children) }),
    thinking: (value) => ({ type: "thinking", text: richText(value.props.children) }),
    heading: (value) => ({ type: "heading", text: richText(value.props.children), size: value.props.size }),
    pre: (value) => ({ type: "pre", text: richText(value.props.children), ...(value.props.language === undefined ? {} : { language: value.props.language }) }),
    divider: () => ({ type: "divider" }),
    "block-mathematical_expression": (value) => ({ type: "mathematical_expression", expression: value.props.expression }),
    "block-anchor": (value) => ({ type: "anchor", name: value.props.name }),
    list: (value) => ({ type: "list", items: childNodes(value.props.children, "<List>").map(listItem) }),
    blockquote: serializeBlockQuote,
    pullquote: serializePullQuote,
    collage: (value) => serializeCollection("collage", value),
    slideshow: (value) => serializeCollection("slideshow", value),
    table: serializeTable,
    details: (value) => ({
        type: "details",
        summary: richText(value.props.summary),
        blocks: childNodes(value.props.children, "<Details>").map(block),
        ...(value.props.open === true ? { is_open: true } : {}),
    }),
    map: serializeMap,
    animation: (value) => {
        const richCaption = caption(value.props);
        return { type: "animation", animation: value.props.media, ...(richCaption === undefined ? {} : { caption: richCaption }) };
    },
    audio: (value) => {
        const richCaption = caption(value.props);
        return { type: "audio", audio: value.props.media, ...(richCaption === undefined ? {} : { caption: richCaption }) };
    },
    photo: (value) => {
        const richCaption = caption(value.props);
        return { type: "photo", photo: value.props.media, ...(richCaption === undefined ? {} : { caption: richCaption }) };
    },
    video: (value) => {
        const richCaption = caption(value.props);
        return { type: "video", video: value.props.media, ...(richCaption === undefined ? {} : { caption: richCaption }) };
    },
    voice_note: (value) => {
        const richCaption = caption(value.props);
        return { type: "voice_note", voice_note: value.props.media, ...(richCaption === undefined ? {} : { caption: richCaption }) };
    },
};
const blockSerializers = new Map(Object.entries(blockSerializerDefinitions).map(([kind, serializer]) => [
    kind,
    (value) => serializer(value),
]));
export function block(value) {
    const serializer = blockSerializers.get(value.kind);
    if (!serializer)
        throw new TypeError(`Expected a rich-message block, received <${value.kind}>`);
    return serializer(value);
}
//# sourceMappingURL=blocks.js.map