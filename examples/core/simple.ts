import { bold, heading, paragraph, richMessage } from "../../src/core.ts";

// The functional interface builds canonical Telegram values by composing
// plain function calls. Each call returns a branded value that the next
// builder accepts as a child.
export const simple = richMessage(
    heading({ size: 1 }, "Welcome"),
    paragraph("Hello from ", bold("telegram-rich-messages"), "."),
);

export const simpleJson = JSON.stringify(simple);
