import { flatten } from "./common.js";
function nested(type) {
    return (value) => ({ type, text: richText(value.props.children) });
}
const richTextSerializerDefinitions = {
    bold: nested("bold"),
    italic: nested("italic"),
    underline: nested("underline"),
    strikethrough: nested("strikethrough"),
    spoiler: nested("spoiler"),
    subscript: nested("subscript"),
    superscript: nested("superscript"),
    marked: nested("marked"),
    code: nested("code"),
    date_time: (value) => ({
        type: "date_time",
        text: richText(value.props.children),
        unix_time: value.props.unixTime,
        date_time_format: value.props.format,
    }),
    text_mention: (value) => ({ type: "text_mention", text: richText(value.props.children), user: value.props.user }),
    custom_emoji: (value) => ({ type: "custom_emoji", custom_emoji_id: value.props.id, alternative_text: value.props.alt }),
    mathematical_expression: (value) => ({ type: "mathematical_expression", expression: value.props.expression }),
    url: (value) => ({ type: "url", text: richText(value.props.children), url: value.props.url }),
    email_address: (value) => ({ type: "email_address", text: richText(value.props.children), email_address: value.props.address }),
    phone_number: (value) => ({ type: "phone_number", text: richText(value.props.children), phone_number: value.props.number }),
    bank_card_number: (value) => ({ type: "bank_card_number", text: richText(value.props.children), bank_card_number: value.props.number }),
    mention: (value) => ({ type: "mention", text: richText(value.props.children), username: value.props.username }),
    hashtag: (value) => ({ type: "hashtag", text: richText(value.props.children), hashtag: value.props.value }),
    cashtag: (value) => ({ type: "cashtag", text: richText(value.props.children), cashtag: value.props.value }),
    bot_command: (value) => ({ type: "bot_command", text: richText(value.props.children), bot_command: value.props.command }),
    anchor: (value) => ({ type: "anchor", name: value.props.name }),
    anchor_link: (value) => ({ type: "anchor_link", text: richText(value.props.children), anchor_name: value.props.name }),
    reference: (value) => ({ type: "reference", text: richText(value.props.children), name: value.props.name }),
    reference_link: (value) => ({ type: "reference_link", text: richText(value.props.children), reference_name: value.props.name }),
};
const richTextSerializers = new Map(Object.entries(richTextSerializerDefinitions).map(([kind, serializer]) => [
    kind,
    (value) => serializer(value),
]));
export function richText(child) {
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
        const serializer = richTextSerializers.get(item.kind);
        if (!serializer)
            throw new TypeError(`Expected rich text, received <${item.kind}>`);
        parts.push(serializer(item));
    }
    return parts.length === 1 ? parts[0] : parts;
}
//# sourceMappingURL=rich-text.js.map