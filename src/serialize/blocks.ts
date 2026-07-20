import type { Child, Node } from "../jsx-runtime.js";
import type { InputRichBlock, RichText } from "../types.js";
import { childNodes } from "./common.js";
import { richText } from "./rich-text.js";

function caption(props: Record<string, unknown>): Record<string, RichText> | undefined {
  if (props.caption === undefined) {
    if (props.credit !== undefined) throw new TypeError("credit requires caption text");
    return undefined;
  }
  const value: Record<string, RichText> = { text: richText(props.caption as Child) };
  if (props.credit !== undefined) value.credit = richText(props.credit as Child);
  return value;
}

function setOptional(target: InputRichBlock, key: string, value: unknown): void {
  if (value !== undefined && value !== false) target[key] = value;
}

function listItem(value: Node): Record<string, unknown> {
  if (value.kind !== "list-item") throw new TypeError("<List> only accepts <ListItem> children");
  const result: Record<string, unknown> = {
    blocks: childNodes(value.props.children as Child, "<ListItem>").map(block),
  };
  if (value.props.checkbox === true) result.has_checkbox = true;
  if (value.props.checked === true) result.is_checked = true;
  if (value.props.value !== undefined) result.value = value.props.value;
  if (value.props.labelType !== undefined) result.type = value.props.labelType;
  return result;
}

function tableCell(value: Node): Record<string, unknown> {
  if (value.kind !== "table-cell") throw new TypeError("<TableRow> only accepts <TableCell> children");
  const result: Record<string, unknown> = {
    text: richText(value.props.children as Child),
    align: value.props.align ?? "left",
    valign: value.props.valign ?? "top",
  };
  if (value.props.header === true) result.is_header = true;
  if (value.props.colspan !== undefined) result.colspan = value.props.colspan;
  if (value.props.rowspan !== undefined) result.rowspan = value.props.rowspan;
  return result;
}

type BlockSerializer = (value: Node) => InputRichBlock;

function serializeTextBlock(value: Node): InputRichBlock {
  return { type: value.kind, text: richText(value.props.children as Child) };
}

function serializeHeading(value: Node): InputRichBlock {
  return { type: "heading", text: richText(value.props.children as Child), size: value.props.size };
}

function serializePre(value: Node): InputRichBlock {
  const result: InputRichBlock = { type: "pre", text: richText(value.props.children as Child) };
  setOptional(result, "language", value.props.language);
  return result;
}

function serializeList(value: Node): InputRichBlock {
  return { type: "list", items: childNodes(value.props.children as Child, "<List>").map(listItem) };
}

function serializeBlockQuote(value: Node): InputRichBlock {
  const result: InputRichBlock = {
    type: "blockquote",
    blocks: childNodes(value.props.children as Child, "<BlockQuote>").map(block),
  };
  if (value.props.credit !== undefined) result.credit = richText(value.props.credit as Child);
  return result;
}

function serializePullQuote(value: Node): InputRichBlock {
  const result: InputRichBlock = { type: "pullquote", text: richText(value.props.children as Child) };
  if (value.props.credit !== undefined) result.credit = richText(value.props.credit as Child);
  return result;
}

function serializeBlockCollection(value: Node): InputRichBlock {
  const result: InputRichBlock = {
    type: value.kind,
    blocks: childNodes(value.props.children as Child, `<${value.kind}>`).map(block),
  };
  setOptional(result, "caption", caption(value.props));
  return result;
}

function serializeTable(value: Node): InputRichBlock {
  const rows = childNodes(value.props.children as Child, "<Table>").map((row) => {
    if (row.kind !== "table-row") throw new TypeError("<Table> only accepts <TableRow> children");
    return childNodes(row.props.children as Child, "<TableRow>").map(tableCell);
  });
  const result: InputRichBlock = { type: "table", cells: rows };
  if (value.props.bordered === true) result.is_bordered = true;
  if (value.props.striped === true) result.is_striped = true;
  if (value.props.caption !== undefined) result.caption = richText(value.props.caption as Child);
  return result;
}

function serializeDetails(value: Node): InputRichBlock {
  const result: InputRichBlock = {
    type: "details",
    summary: richText(value.props.summary as Child),
    blocks: childNodes(value.props.children as Child, "<Details>").map(block),
  };
  if (value.props.open === true) result.is_open = true;
  return result;
}

function serializeMap(value: Node): InputRichBlock {
  const zoom = value.props.zoom as number;
  const width = value.props.width as number;
  const height = value.props.height as number;
  if (!Number.isInteger(zoom) || zoom < 0 || zoom > 24) throw new RangeError("<Map> zoom must be an integer from 0 to 24");
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0 || width + height > 10_000) {
    throw new RangeError("<Map> width and height must be non-negative integers whose total does not exceed 10000");
  }
  if ((width === 0) !== (height === 0) || (width > 0 && Math.max(width / height, height / width) > 20)) {
    throw new RangeError("<Map> width-to-height ratio must not exceed 20");
  }
  const result: InputRichBlock = { type: "map", location: value.props.location, zoom, width, height };
  setOptional(result, "caption", caption(value.props));
  return result;
}

function serializeMediaBlock(value: Node): InputRichBlock {
  const result: InputRichBlock = { type: value.kind, [value.kind]: value.props.media };
  setOptional(result, "caption", caption(value.props));
  return result;
}

const blockSerializers = new Map<string, BlockSerializer>([
  ...["paragraph", "footer", "thinking"]
    .map((kind): [string, BlockSerializer] => [kind, serializeTextBlock]),
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
    .map((kind): [string, BlockSerializer] => [kind, serializeMediaBlock]),
]);

export function block(value: Node): InputRichBlock {
  const serializer = blockSerializers.get(value.kind);
  if (!serializer) throw new TypeError(`Expected a rich-message block, received <${value.kind}>`);
  return serializer(value);
}
