// deno-lint-ignore-file no-import-prefix -- grammy pulled directly from lib.deno.dev in the example
import { Bot } from "https://lib.deno.dev/x/grammy@^1.45/mod.ts";
import {
    Bold,
    Divider,
    Paragraph,
    richMessage,
    Table,
    TableCell,
    TableRow,
} from "../src/components.ts";
import { RichMessage as RichMessageBuilder } from "../src/fluent.ts";
import {
    bold,
    paragraph,
    richMessage as coreRichMessage,
    table,
    tableCell,
    tableRow,
} from "../src/core.ts";

const bot = new Bot(Deno.env.get("TELEGRAM_TOKEN")!);

bot.command("components", (ctx) => {
    const message = richMessage(
        <Paragraph>
            Hello, <Bold>{ctx.message?.from.first_name ?? "there"}!</Bold>
        </Paragraph>,
        <Paragraph>
            Here's a table:
        </Paragraph>,
        <Divider />,
        <Table>
            <TableRow>
                <TableCell header>Name</TableCell>
                <TableCell header>Last Name</TableCell>
                <TableCell header>Age</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>John</TableCell>
                <TableCell>Doe</TableCell>
                <TableCell>42</TableCell>
            </TableRow>
        </Table>,
    );

    return ctx.replyWithRichMessage(message);
});

bot.command("fluent", (ctx) => {
    const message = new RichMessageBuilder()
        .paragraph(
            "Hello, ",
            bold(ctx.message?.from.first_name ?? "there"),
            "!",
        )
        .paragraph("Here's a table:")
        .table((t) =>
            t
                .row((r) =>
                    r
                        .cell("Name", { header: true })
                        .cell("Last Name", { header: true })
                        .cell("Age", { header: true })
                )
                .row((r) =>
                    r
                        .cell("John")
                        .cell("Doe")
                        .cell("42")
                )
        );

    return ctx.replyWithRichMessage(message);
});

bot.command("core", (ctx) => {
    const message = coreRichMessage(
        paragraph(
            `Hello, `,
            bold(ctx.message?.from.first_name ?? "there"),
            "!",
        ),
        paragraph("Here's a table:"),
        table(
            tableRow(
                tableCell({ header: true }, "Name"),
                tableCell({ header: true }, "Last Name"),
                tableCell({ header: true }, "Age"),
            ),
            tableRow(
                tableCell("John"),
                tableCell("Doe"),
                tableCell("42"),
            ),
        ),
    );

    return ctx.replyWithRichMessage(message);
});

bot.start({
    onStart: ({ username }) => {
        console.log(`Listening as @${username}`);
    },
});
