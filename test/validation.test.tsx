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
    richMessage,
} from "../src/components.ts";

const photo = { type: "photo" as const, media: "photo-file-id" };

if (false) {
    // @ts-expect-error Telegram captions cannot contain a credit without caption text.
    Photo({ media: photo, credit: "Unattached credit" });
}

test("rejects compositions that cannot be sent as InputRichMessage", () => {
    expect(() => expectRichMessage(<Paragraph>not a root</Paragraph>)).toThrow(
        "richMessage() root",
    );
    expect(() => richMessage("plain text at block level" as any)).toThrow(
        "only accepts rich-message blocks",
    );
    expect(() =>
        richMessage(
            <Map
                location={{ latitude: 0, longitude: 0 }}
                zoom={25}
                width={100}
                height={100}
            />,
        )
    ).toThrow("zoom");
    expect(() =>
        richMessage(
            <Map
                location={{ latitude: 0, longitude: 0 }}
                zoom={10}
                width={9500}
                height={600}
            />,
        )
    ).toThrow("width and height");
    expect(() =>
        richMessage(
            <Map
                location={{ latitude: 0, longitude: 0 }}
                zoom={10}
                width={1000}
                height={20}
            />,
        )
    ).toThrow("ratio");
    expect(() =>
        richMessage(
            Photo({ media: photo, credit: "Unattached credit" } as any),
        )
    ).toThrow("credit requires caption");
    expect(() =>
        richMessage(
            <List>{ListItem({ checked: true } as any)}</List>,
        )
    ).toThrow("checked requires checkbox");
});

test("accepts the documented zero boundary for map dimensions", () => {
    expect(
        richMessage(
            <Map
                location={{ latitude: 0, longitude: 0 }}
                zoom={0}
                width={0}
                height={0}
            />,
        ).blocks![0],
    ).toEqual({
        type: "map",
        location: { latitude: 0, longitude: 0 },
        zoom: 0,
        width: 0,
        height: 0,
    });
});
