import type { InputRichMessage, Message } from "grammy/types"
import type { JSX } from "./components/jsx-runtime"
import type { Context, NextFunction } from "grammy"
import { expectRichMessage } from "./components"

export type RichMessagesFlavor<C = Context> = C & {
    replyRich(richMessage: InputRichMessage | JSX.Element): Promise<Message.RichMessageMessage>
}

export const richMessages = async (ctx: RichMessagesFlavor, next: NextFunction) => {
    Object.defineProperty(ctx, 'replyRich', {
        writable: false,
        configurable: false,
        value: (input: InputRichMessage | JSX.Element) => ctx.replyWithRichMessage(expectRichMessage(input))
    })
    await next()
}