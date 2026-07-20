import { expect, test } from "bun:test";
import { List, ListItem, Map, Paragraph, Photo, RichMessage, render } from "../src/index.js";

const photo = { type: "photo" as const, media: "photo-file-id" };

if (false) {
  // @ts-expect-error Telegram captions cannot contain a credit without caption text.
  Photo({ media: photo, credit: "Unattached credit" });
}

test("rejects compositions that cannot be sent as InputRichMessage", () => {
  expect(() => render(<Paragraph>not a root</Paragraph>)).toThrow("<RichMessage> root");
  expect(() => render(RichMessage({ children: "plain text at block level" } as any))).toThrow("only accepts TSX elements");
  expect(() => render(
    <RichMessage>
      <Map location={{ latitude: 0, longitude: 0 }} zoom={25} width={100} height={100} />
    </RichMessage>,
  )).toThrow("zoom");
  expect(() => render(
    <RichMessage>
      <Map location={{ latitude: 0, longitude: 0 }} zoom={10} width={9500} height={600} />
    </RichMessage>,
  )).toThrow("width and height");
  expect(() => render(
    <RichMessage>
      <Map location={{ latitude: 0, longitude: 0 }} zoom={10} width={1000} height={20} />
    </RichMessage>,
  )).toThrow("ratio");
  expect(() => render(
    <RichMessage>{Photo({ media: photo, credit: "Unattached credit" } as any)}</RichMessage>,
  )).toThrow("credit requires caption");
  expect(() => render(
    <RichMessage><List>{ListItem({ checked: true } as any)}</List></RichMessage>,
  )).toThrow("checked requires checkbox");
});

test("accepts the documented zero boundary for map dimensions", () => {
  expect(render(
    <RichMessage>
      <Map location={{ latitude: 0, longitude: 0 }} zoom={0} width={0} height={0} />
    </RichMessage>,
  ).blocks[0]).toEqual({
    type: "map",
    location: { latitude: 0, longitude: 0 },
    zoom: 0,
    width: 0,
    height: 0,
  });
});
