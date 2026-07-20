import type {
    Context,
    InputRichMessage,
    Message,
    NextFunction,
} from "./deps.deno.ts";
import type { JSX } from "./components/jsx-runtime.ts";
import { expectRichMessage } from "./components.ts";
import { RichMessage } from "./fluent.ts";

export type RichMessagesFlavor<C = Context> = C & {
    replyRich(
        richMessage: InputRichMessage | JSX.Element,
    ): Promise<Message.RichMessageMessage>;
};

export const richMessages = async (
    ctx: RichMessagesFlavor,
    next: NextFunction,
) => {
    Object.defineProperty(ctx, "replyRich", {
        writable: false,
        configurable: false,
        value: (input: InputRichMessage | JSX.Element) => {
            if (input instanceof RichMessage) {
                return ctx.replyWithRichMessage(input);
            }
            return ctx.replyWithRichMessage(expectRichMessage(input));
        },
    });
    await next();
};
