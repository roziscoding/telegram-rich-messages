import { Bold, Heading, Paragraph, richMessage } from "../../src/components.ts";

// The components interface is the same builders exposed as JSX. `richMessage`
// composes the root element and validates it at runtime.
export const simple = richMessage(
    <Heading size={1}>Welcome</Heading>,
    <Paragraph>
        Hello from <Bold>grammy-rich-messages</Bold>.
    </Paragraph>,
);

export const simpleJson = JSON.stringify(simple);
