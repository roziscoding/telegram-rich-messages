import { expect } from "@std/expect";
import { it as test } from "@std/testing/bdd";
import * as rm from "../src/core.ts";
import {
    bold,
    italic,
    richMessage,
    table,
    tableCell,
    tableRow,
} from "../src/core.ts";
import {
    Bold,
    expectRichMessage,
    Paragraph,
    Table,
} from "../src/components.ts";
import * as components from "../src/components.ts";

test("functional builders return canonical Telegram values without rendering", () => {
    const formatted = bold("some", italic("text"), "here");
    expect(JSON.parse(JSON.stringify(formatted))).toEqual({
        type: "bold",
        text: ["some", { type: "italic", text: "text" }, "here"],
    });

    const message = richMessage(
        table(
            tableRow(
                tableCell(formatted),
            ),
        ),
    );

    expect(JSON.parse(JSON.stringify(message))).toEqual({
        blocks: [{
            type: "table",
            cells: [[{
                text: formatted,
                align: "left",
                valign: "top",
            }]],
        }],
    });
    expect(expectRichMessage(message)).toBe(message);
});

test("JSX structural components delegate runtime validation to functional builders", () => {
    expect(() => (
        <Table>
            <Paragraph>not a row</Paragraph>
        </Table>
    )).toThrow("table() only accepts <table-row> children");
});

test("JSX rich-text components delegate runtime validation to functional builders", () => {
    expect(() => (
        <Bold>
            <Paragraph>not rich text</Paragraph>
        </Bold>
    )).toThrow("bold() only accepts rich-text children");
});

test("JSX and functional syntax create the same canonical Telegram value", () => {
    const jsx = components.richMessage(
        { skipEntityDetection: true },
        <components.Table
            bordered
            caption={<components.Bold>Benchmark</components.Bold>}
        >
            <components.TableRow>
                <components.TableCell header align="right">
                    <components.Italic>98.4</components.Italic>
                </components.TableCell>
            </components.TableRow>
        </components.Table>,
    );
    const functional = rm.richMessage(
        { skipEntityDetection: true },
        rm.table(
            { bordered: true, caption: rm.bold("Benchmark") },
            rm.tableRow(
                rm.tableCell(
                    { header: true, align: "right" },
                    rm.italic("98.4"),
                ),
            ),
        ),
    );

    expect(jsx).toEqual(functional);
});

test("JSX nodes can enter strict functional composition through runtime narrowing guards", () => {
    const message = rm.richMessage(
        rm.table(
            components.expectTableRow(
                <components.TableRow>
                    <components.TableCell>
                        {rm.bold("hybrid")}
                    </components.TableCell>
                </components.TableRow>,
            ),
        ),
    );

    expect(message.blocks![0]).toEqual({
        type: "table",
        cells: [[{
            text: { type: "bold", text: "hybrid" },
            align: "left",
            valign: "top",
        }]],
    });
});

test("functional builders enforce hierarchy at runtime for JavaScript and cast callers", () => {
    expect(() => rm.table(rm.paragraph("bad") as never)).toThrow(
        "table() only accepts <table-row>",
    );
    expect(() => rm.tableRow(rm.paragraph("bad") as never)).toThrow(
        "tableRow() only accepts <table-cell>",
    );
    expect(() => rm.richMessage(rm.bold("bad") as never)).toThrow(
        "richMessage() only accepts rich-message blocks",
    );
    expect(() => rm.bold(rm.paragraph("bad") as never)).toThrow(
        "bold() only accepts rich-text children",
    );
    expect(() => rm.richMessage(rm.inlineMath({ expression: "x" }) as never))
        .toThrow("richMessage() only accepts rich-message blocks");
    expect(() => rm.bold(rm.blockAnchor({ name: "bad" }) as never)).toThrow(
        "bold() only accepts rich-text children",
    );
    expect(() => rm.list(rm.paragraph("bad") as never)).toThrow(
        "list() only accepts <list-item>",
    );
    expect(() => components.expectTableRow(rm.paragraph("bad"))).toThrow(
        "expectTableRow() only accepts <table-row>",
    );
    expect(() => components.expectRichText("plain text")).toThrow(
        "expectRichText() expects a rich-text element",
    );
    expect(() => rm.richMessage({ typo: true } as never)).toThrow(
        'richMessage() received unknown option "typo"',
    );
    expect(() => rm.table({ kind: "table-row", prop: {} } as never)).toThrow(
        'table() received unknown option "kind"',
    );
    expect(() =>
        (rm.customEmoji as (...args: unknown[]) => unknown)({
            id: "emoji",
            alt: "✨",
        }, "bad")
    )
        .toThrow("customEmoji() does not accept children");
});

test("functional rich-text builders cover every entity", () => {
    const user = { id: 42, is_bot: false, first_name: "Ada" };
    const message = rm.richMessage(rm.paragraph(
        rm.italic("i"),
        rm.underline("u"),
        rm.strikethrough("s"),
        rm.spoiler("secret"),
        rm.dateTime({ unixTime: 0, format: "wDt" }, "epoch"),
        rm.textMention({ user }, "Ada"),
        rm.subscript("2"),
        rm.superscript("3"),
        rm.marked("mark"),
        rm.code("code"),
        rm.customEmoji({ id: "emoji-id", alt: "✨" }),
        rm.inlineMath({ expression: "x^2" }),
        rm.link({ url: "https://telegram.org" }, "link"),
        rm.email({ address: "a@example.com" }, "mail"),
        rm.phone({ number: "+1555" }, "call"),
        rm.bankCard({ number: "4242" }, "card"),
        rm.mention({ username: "telegram" }, "@telegram"),
        rm.hashtag({ value: "bots" }, "#bots"),
        rm.cashtag({ value: "TON" }, "$TON"),
        rm.botCommand({ command: "start" }, "/start"),
        rm.textAnchor({ name: "intro" }),
        rm.anchorLink({ name: "intro" }, "back"),
        rm.reference({ name: "note" }, "note body"),
        rm.referenceLink({ name: "note" }, "[1]"),
    ));

    const first = message.blocks![0];
    if (!first || first.type !== "paragraph" || !Array.isArray(first.text)) {
        throw new Error("expected functional rich-text output");
    }
    expect(
        first.text
            .filter((part): part is Extract<rm.RichText, { type: string }> =>
                typeof part === "object" && !Array.isArray(part)
            )
            .map((part) => part.type),
    ).toEqual([
        "italic",
        "underline",
        "strikethrough",
        "spoiler",
        "date_time",
        "text_mention",
        "subscript",
        "superscript",
        "marked",
        "code",
        "custom_emoji",
        "mathematical_expression",
        "url",
        "email_address",
        "phone_number",
        "bank_card_number",
        "mention",
        "hashtag",
        "cashtag",
        "bot_command",
        "anchor",
        "anchor_link",
        "reference",
        "reference_link",
    ]);
});

test("functional block builders cover every block variant", () => {
    const photo = { type: "photo" as const, media: "photo-id" };
    const animation = { type: "animation" as const, media: "animation-id" };
    const audio = { type: "audio" as const, media: "audio-id" };
    const video = { type: "video" as const, media: "video-id" };
    const voiceNote = { type: "voice_note" as const, media: "voice-id" };

    const output = rm.richMessage(
        { isRtl: true },
        rm.heading({ size: 2 }, "Heading"),
        rm.pre({ language: "ts" }, "code"),
        rm.footer("footer"),
        rm.divider(),
        rm.mathBlock({ expression: "x^2" }),
        rm.blockAnchor({ name: "intro" }),
        rm.list(
            rm.listItem(
                { checkbox: true, checked: true },
                rm.paragraph("item"),
            ),
        ),
        rm.blockQuote({ credit: "Ada" }, rm.paragraph("quote")),
        rm.pullQuote({ credit: "Roz" }, "pull"),
        rm.collage({ caption: "Gallery" }, rm.photo({ media: photo })),
        rm.slideshow({ caption: "Slides" }, rm.video({ media: video })),
        rm.table(
            { bordered: true },
            rm.tableRow(rm.tableCell({ header: true }, "Cell")),
        ),
        rm.details({ summary: "More", open: true }, rm.paragraph("details")),
        rm.map({
            location: { latitude: 0, longitude: 0 },
            zoom: 0,
            width: 0,
            height: 0,
        }),
        rm.animation({ media: animation }),
        rm.audio({ media: audio }),
        rm.photo({ media: photo }),
        rm.video({ media: video }),
        rm.voiceNote({ media: voiceNote }),
        rm.thinking("Thinking"),
    );

    expect(output.is_rtl).toBe(true);
    expect(output.blocks!.map((block) => block.type)).toEqual([
        "heading",
        "pre",
        "footer",
        "divider",
        "mathematical_expression",
        "anchor",
        "list",
        "blockquote",
        "pullquote",
        "collage",
        "slideshow",
        "table",
        "details",
        "map",
        "animation",
        "audio",
        "photo",
        "video",
        "voice_note",
        "thinking",
    ]);
});
