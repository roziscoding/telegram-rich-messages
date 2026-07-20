import { expect, test } from "bun:test";
import * as builder from "../src/builder.js";
import * as core from "../src/core.js";
import * as jsx from "../src/jsx.js";

test("public entrypoints expose separate functional, JSX, and fluent surfaces", () => {
  expect(typeof core.richMessage).toBe("function");
  expect(typeof core.paragraph).toBe("function");
  expect("RichMessage" in core).toBe(false);
  expect("RichMessageBuilder" in core).toBe(false);

  expect(typeof jsx.RichMessage).toBe("function");
  expect(typeof jsx.Paragraph).toBe("function");
  expect(typeof jsx.expectRichMessage).toBe("function");
  expect("richMessage" in jsx).toBe(false);
  expect("RichMessageBuilder" in jsx).toBe(false);

  expect(typeof builder.RichMessageBuilder).toBe("function");
  expect(typeof builder.TableBuilder).toBe("function");
  expect("richMessage" in builder).toBe(false);
  expect("RichMessage" in builder).toBe(false);
});
