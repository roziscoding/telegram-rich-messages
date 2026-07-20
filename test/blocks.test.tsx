import { expect, test } from "bun:test";
import {
  Animation, Audio, BlockAnchor, BlockQuote, Bold, Collage, Details, Divider,
  Footer, Heading, List, ListItem, Map, MathBlock, Paragraph, Photo, Pre,
  PullQuote, RichMessage, Slideshow, Table, TableCell, TableRow, Thinking,
  Video, VoiceNote, expectRichMessage,
} from "../src/jsx.js";

const photo = { type: "photo" as const, media: "photo-file-id", has_spoiler: true };
const video = { type: "video" as const, media: "video-file-id", width: 1280, height: 720 };
const animation = { type: "animation" as const, media: "animation-file-id" };
const audio = { type: "audio" as const, media: "audio-file-id", title: "Song" };
const voiceNote = { type: "voice_note" as const, media: "voice-file-id" };

test("builds every InputRichBlock variant", () => {
  const output = expectRichMessage(
    <RichMessage isRtl>
      <Heading size={2}>Title</Heading>
      <Pre language="ts">const answer = 42;</Pre>
      <Footer>Fine print</Footer>
      <Divider />
      <MathBlock expression="\\int_0^1 x dx" />
      <BlockAnchor name="chapter-1" />
      <List>
        <ListItem checkbox checked><Paragraph>done</Paragraph></ListItem>
        <ListItem value={4} labelType="I"><Paragraph>four</Paragraph></ListItem>
      </List>
      <BlockQuote credit={<Bold>Ada</Bold>}><Paragraph>Quote</Paragraph></BlockQuote>
      <PullQuote credit="Roz">Center this</PullQuote>
      <Collage caption="Gallery" credit="Photographer"><Photo media={photo} /></Collage>
      <Slideshow caption="Slides"><Video media={video} /></Slideshow>
      <Table bordered striped caption="Numbers">
        <TableRow><TableCell header align="center" valign="middle">Name</TableCell><TableCell>Value</TableCell></TableRow>
        <TableRow><TableCell colspan={2}>Answer: 42</TableCell><TableCell /></TableRow>
      </Table>
      <Details summary={<Bold>More</Bold>} open><Paragraph>Hidden-ish</Paragraph></Details>
      <Map location={{ latitude: 51.5, longitude: -0.12 }} zoom={12} width={800} height={400} caption="London" />
      <Animation media={animation} caption="Loop" />
      <Audio media={audio} caption="Listen" />
      <Photo media={photo} caption="Look" />
      <Video media={video} caption="Watch" />
      <VoiceNote media={voiceNote} caption="Hear" />
      <Thinking><CustomThinkingText /></Thinking>
    </RichMessage>,
  );

  expect(output.is_rtl).toBe(true);
  expect(output.blocks.map((item) => item.type)).toEqual([
    "heading", "pre", "footer", "divider", "mathematical_expression", "anchor",
    "list", "blockquote", "pullquote", "collage", "slideshow", "table", "details",
    "map", "animation", "audio", "photo", "video", "voice_note", "thinking",
  ]);
  expect(output.blocks[6]).toEqual({
    type: "list",
    items: [
      { blocks: [{ type: "paragraph", text: "done" }], has_checkbox: true, is_checked: true },
      { blocks: [{ type: "paragraph", text: "four" }], value: 4, type: "I" },
    ],
  });
  expect(output.blocks[9]).toEqual({
    type: "collage",
    blocks: [{ type: "photo", photo }],
    caption: { text: "Gallery", credit: "Photographer" },
  });
  expect(output.blocks[11]).toEqual({
    type: "table",
    cells: [
      [
        { text: "Name", is_header: true, align: "center", valign: "middle" },
        { text: "Value", align: "left", valign: "top" },
      ],
      [
        { text: "Answer: 42", colspan: 2, align: "left", valign: "top" },
        { align: "left", valign: "top" },
      ],
    ],
    is_bordered: true,
    is_striped: true,
    caption: "Numbers",
  });
  expect(output.blocks[12]).toEqual({
    type: "details",
    summary: { type: "bold", text: "More" },
    blocks: [{ type: "paragraph", text: "Hidden-ish" }],
    is_open: true,
  });
  expect(output.blocks[13]).toEqual({
    type: "map",
    location: { latitude: 51.5, longitude: -0.12 },
    zoom: 12,
    width: 800,
    height: 400,
    caption: { text: "London" },
  });
});

function CustomThinkingText() {
  return <>Thinking…</>;
}
