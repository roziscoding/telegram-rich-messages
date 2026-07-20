// deno-lint-ignore-file no-explicit-any no-constant-condition -- `as any` drives negative type-checks and `if (false)` guards a compile-only assertion
import { expect } from "@std/expect";
import { it as test } from "@std/testing/bdd";
import {
    expectRichMessage,
    List,
    ListItem,
    Map,
    Paragraph,
    Photo,
    RichMessage,
} from "../src/components.ts";

const photo = { type: "photo" as const, media: "photo-file-id" };

if (false) {
    // @ts-expect-error Telegram captions cannot contain a credit without caption text.
    Photo({ media: photo, credit: "Unattached credit" });
}

test("rejects compositions that cannot be sent as InputRichMessage", () => {
    expect(() => expectRichMessage(<Paragraph>not a root</Paragraph>)).toThrow(
        "<RichMessage> root",
    );
    expect(() =>
        expectRichMessage(
            RichMessage({ children: "plain text at block level" } as any),
        )
    ).toThrow("only accepts rich-message blocks");
    expect(() =>
        expectRichMessage(
            <RichMessage>
                <Map
                    location={{ latitude: 0, longitude: 0 }}
                    zoom={25}
                    width={100}
                    height={100}
                />
            </RichMessage>,
        )
    ).toThrow("zoom");
    expect(() =>
        expectRichMessage(
            <RichMessage>
                <Map
                    location={{ latitude: 0, longitude: 0 }}
                    zoom={10}
                    width={9500}
                    height={600}
                />
            </RichMessage>,
        )
    ).toThrow("width and height");
    expect(() =>
        expectRichMessage(
            <RichMessage>
                <Map
                    location={{ latitude: 0, longitude: 0 }}
                    zoom={10}
                    width={1000}
                    height={20}
                />
            </RichMessage>,
        )
    ).toThrow("ratio");
    expect(() =>
        expectRichMessage(
            <RichMessage>
                {Photo({ media: photo, credit: "Unattached credit" } as any)}
            </RichMessage>,
        )
    ).toThrow("credit requires caption");
    expect(() =>
        expectRichMessage(
            <RichMessage>
                <List>{ListItem({ checked: true } as any)}</List>
            </RichMessage>,
        )
    ).toThrow("checked requires checkbox");
});

test("accepts the documented zero boundary for map dimensions", () => {
    expect(
        expectRichMessage(
            <RichMessage>
                <Map
                    location={{ latitude: 0, longitude: 0 }}
                    zoom={0}
                    width={0}
                    height={0}
                />
            </RichMessage>,
        ).blocks![0],
    ).toEqual({
        type: "map",
        location: { latitude: 0, longitude: 0 },
        zoom: 0,
        width: 0,
        height: 0,
    });
});
