function node(kind, props) {
    return { kind, props: props };
}
export function RichMessage(props) {
    return node("rich-message", props);
}
export function Paragraph(props) { return node("paragraph", props); }
export function Heading(props) { return node("heading", props); }
export function Pre(props) { return node("pre", props); }
export function Footer(props) { return node("footer", props); }
export function Divider(props) { return node("divider", props); }
export function MathBlock(props) { return node("block-mathematical_expression", props); }
export function BlockAnchor(props) { return node("block-anchor", props); }
export function List(props) { return node("list", props); }
export function ListItem(props) { return node("list-item", props); }
export function BlockQuote(props) { return node("blockquote", props); }
export function PullQuote(props) { return node("pullquote", props); }
export function Collage(props) { return node("collage", props); }
export function Slideshow(props) { return node("slideshow", props); }
export function Table(props) { return node("table", props); }
export function TableRow(props) { return node("table-row", props); }
export function TableCell(props) { return node("table-cell", props); }
export function Details(props) { return node("details", props); }
export function Map(props) { return node("map", props); }
export function Animation(props) { return node("animation", props); }
export function Audio(props) { return node("audio", props); }
export function Photo(props) { return node("photo", props); }
export function Video(props) { return node("video", props); }
export function VoiceNote(props) { return node("voice_note", props); }
/**
 * A temporary “Thinking…” block. Telegram only permits this block in
 * sendRichMessageDraft payloads; render() cannot infer the eventual endpoint.
 */
export function Thinking(props) { return node("thinking", props); }
export function Bold(props) { return node("bold", props); }
export function Italic(props) { return node("italic", props); }
export function Underline(props) { return node("underline", props); }
export function Strikethrough(props) { return node("strikethrough", props); }
export function Spoiler(props) { return node("spoiler", props); }
export function Subscript(props) { return node("subscript", props); }
export function Superscript(props) { return node("superscript", props); }
export function Marked(props) { return node("marked", props); }
export function Code(props) { return node("code", props); }
export function DateTime(props) { return node("date_time", props); }
export function TextMention(props) { return node("text_mention", props); }
export function CustomEmoji(props) { return node("custom_emoji", props); }
export function InlineMath(props) { return node("mathematical_expression", props); }
export function Link(props) { return node("url", props); }
export function Email(props) { return node("email_address", props); }
export function Phone(props) { return node("phone_number", props); }
export function BankCard(props) { return node("bank_card_number", props); }
export function Mention(props) { return node("mention", props); }
export function Hashtag(props) { return node("hashtag", props); }
export function Cashtag(props) { return node("cashtag", props); }
export function BotCommand(props) { return node("bot_command", props); }
export function TextAnchor(props) { return node("anchor", props); }
export function AnchorLink(props) { return node("anchor_link", props); }
export function Reference(props) { return node("reference", props); }
export function ReferenceLink(props) { return node("reference_link", props); }
function flatten(child) {
    if (Array.isArray(child))
        return child.flatMap(flatten);
    return [child];
}
function richText(child) {
    const parts = [];
    for (const item of flatten(child)) {
        if (item == null || typeof item === "boolean")
            continue;
        if (typeof item === "string" || typeof item === "number") {
            const value = String(item);
            const last = parts.at(-1);
            if (typeof last === "string")
                parts[parts.length - 1] = last + value;
            else
                parts.push(value);
            continue;
        }
        const text = () => richText(item.props.children);
        if (["bold", "italic", "underline", "strikethrough", "spoiler", "subscript", "superscript", "marked", "code"].includes(item.kind)) {
            parts.push({ type: item.kind, text: text() });
        }
        else if (item.kind === "date_time") {
            parts.push({ type: item.kind, text: text(), unix_time: item.props.unixTime, date_time_format: item.props.format });
        }
        else if (item.kind === "text_mention") {
            parts.push({ type: item.kind, text: text(), user: item.props.user });
        }
        else if (item.kind === "custom_emoji") {
            parts.push({ type: item.kind, custom_emoji_id: item.props.id, alternative_text: item.props.alt });
        }
        else if (item.kind === "mathematical_expression") {
            parts.push({ type: item.kind, expression: item.props.expression });
        }
        else if (item.kind === "url") {
            parts.push({ type: item.kind, text: text(), url: item.props.url });
        }
        else if (item.kind === "email_address") {
            parts.push({ type: item.kind, text: text(), email_address: item.props.address });
        }
        else if (item.kind === "phone_number") {
            parts.push({ type: item.kind, text: text(), phone_number: item.props.number });
        }
        else if (item.kind === "bank_card_number") {
            parts.push({ type: item.kind, text: text(), bank_card_number: item.props.number });
        }
        else if (item.kind === "mention") {
            parts.push({ type: item.kind, text: text(), username: item.props.username });
        }
        else if (item.kind === "hashtag" || item.kind === "cashtag") {
            parts.push({ type: item.kind, text: text(), [item.kind]: item.props.value });
        }
        else if (item.kind === "bot_command") {
            parts.push({ type: item.kind, text: text(), bot_command: item.props.command });
        }
        else if (item.kind === "anchor") {
            parts.push({ type: item.kind, name: item.props.name });
        }
        else if (item.kind === "anchor_link") {
            parts.push({ type: item.kind, text: text(), anchor_name: item.props.name });
        }
        else if (item.kind === "reference") {
            parts.push({ type: item.kind, text: text(), name: item.props.name });
        }
        else if (item.kind === "reference_link") {
            parts.push({ type: item.kind, text: text(), reference_name: item.props.name });
        }
        else {
            throw new TypeError(`Expected rich text, received <${item.kind}>`);
        }
    }
    return parts.length === 1 ? parts[0] : parts;
}
function childNodes(child, context) {
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
function block(value) {
    const props = value.props;
    if (["paragraph", "footer", "thinking"].includes(value.kind)) {
        return { type: value.kind, text: richText(props.children) };
    }
    if (value.kind === "heading")
        return { type: "heading", text: richText(props.children), size: props.size };
    if (value.kind === "pre") {
        const result = { type: "pre", text: richText(props.children) };
        setOptional(result, "language", props.language);
        return result;
    }
    if (value.kind === "divider")
        return { type: "divider" };
    if (value.kind === "block-mathematical_expression")
        return { type: "mathematical_expression", expression: props.expression };
    if (value.kind === "block-anchor")
        return { type: "anchor", name: props.name };
    if (value.kind === "list")
        return { type: "list", items: childNodes(props.children, "<List>").map(listItem) };
    if (value.kind === "blockquote") {
        const result = { type: "blockquote", blocks: childNodes(props.children, "<BlockQuote>").map(block) };
        if (props.credit !== undefined)
            result.credit = richText(props.credit);
        return result;
    }
    if (value.kind === "pullquote") {
        const result = { type: "pullquote", text: richText(props.children) };
        if (props.credit !== undefined)
            result.credit = richText(props.credit);
        return result;
    }
    if (value.kind === "collage" || value.kind === "slideshow") {
        const result = { type: value.kind, blocks: childNodes(props.children, `<${value.kind}>`).map(block) };
        setOptional(result, "caption", caption(props));
        return result;
    }
    if (value.kind === "table") {
        const rows = childNodes(props.children, "<Table>").map((row) => {
            if (row.kind !== "table-row")
                throw new TypeError("<Table> only accepts <TableRow> children");
            return childNodes(row.props.children, "<TableRow>").map(tableCell);
        });
        const result = { type: "table", cells: rows };
        if (props.bordered === true)
            result.is_bordered = true;
        if (props.striped === true)
            result.is_striped = true;
        if (props.caption !== undefined)
            result.caption = richText(props.caption);
        return result;
    }
    if (value.kind === "details") {
        const result = {
            type: "details",
            summary: richText(props.summary),
            blocks: childNodes(props.children, "<Details>").map(block),
        };
        if (props.open === true)
            result.is_open = true;
        return result;
    }
    if (value.kind === "map") {
        const zoom = props.zoom;
        const width = props.width;
        const height = props.height;
        if (!Number.isInteger(zoom) || zoom < 0 || zoom > 24)
            throw new RangeError("<Map> zoom must be an integer from 0 to 24");
        if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0 || width + height > 10_000) {
            throw new RangeError("<Map> width and height must be non-negative integers whose total does not exceed 10000");
        }
        if ((width === 0) !== (height === 0) || (width > 0 && Math.max(width / height, height / width) > 20)) {
            throw new RangeError("<Map> width-to-height ratio must not exceed 20");
        }
        const result = { type: "map", location: props.location, zoom, width, height };
        setOptional(result, "caption", caption(props));
        return result;
    }
    if (["animation", "audio", "photo", "video", "voice_note"].includes(value.kind)) {
        const result = { type: value.kind, [value.kind]: props.media };
        setOptional(result, "caption", caption(props));
        return result;
    }
    throw new TypeError(`Expected a rich-message block, received <${value.kind}>`);
}
export function render(element) {
    if (element.kind !== "rich-message")
        throw new TypeError("render() expects a <RichMessage> root");
    const blocks = childNodes(element.props.children, "<RichMessage>").map(block);
    const result = { blocks };
    if (element.props.isRtl === true)
        result.is_rtl = true;
    if (element.props.skipEntityDetection === true)
        result.skip_entity_detection = true;
    return result;
}
//# sourceMappingURL=index.js.map