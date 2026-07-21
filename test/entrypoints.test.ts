import { expect } from "@std/expect";
import { it as test } from "@std/testing/bdd";
import * as builder from "../src/fluent.ts";
import * as core from "../src/core.ts";
import * as jsx from "../src/components.ts";

test("public entrypoints expose separate functional, JSX, and fluent surfaces", () => {
    expect(typeof core.richMessage).toBe("function");
    expect(typeof core.paragraph).toBe("function");
    expect("RichMessage" in core).toBe(false);
    expect("RichMessageBuilder" in core).toBe(false);

    expect(typeof jsx.richMessage).toBe("function");
    expect(jsx.richMessage).not.toBe(core.richMessage);
    expect(typeof jsx.Paragraph).toBe("function");
    expect(typeof jsx.expectRichMessage).toBe("function");
    expect("RichMessage" in jsx).toBe(false);
    expect("RichMessageBuilder" in jsx).toBe(false);

    expect(typeof builder.RichMessage).toBe("function");
    expect(typeof builder.TableBuilder).toBe("function");
    expect("richMessage" in builder).toBe(false);
    expect("RichMessageBuilder" in builder).toBe(false);
});
