import {
  Divider,
  ListItem,
  Paragraph,
  RichMessage,
  Table,
  render,
  type InputMediaPhoto,
  type InputRichMessage,
  type InputRichBlockParagraph,
  type InputRichBlockTable,
  type MessageEntity,
  type RichBlockTableCell,
} from "../src/index.js";

function expectType<T>(_value: T): void {}

function typeSafetyAssertions(): void {
  const dateTimeEntity: MessageEntity = {
    type: "date_time",
    offset: 0,
    length: 1,
    unix_time: 0,
    date_time_format: "dd MMM yyyy",
  };
  void dateTimeEntity;

  const htmlMessage: InputRichMessage = {
    html: "<p>Hello</p>",
    media: [{ id: "hero", media: { type: "photo", media: "photo-id" } }],
    is_rtl: false,
  };
  const invisibleCell: RichBlockTableCell = { align: "left", valign: "top" };
  void htmlMessage;
  void invisibleCell;

  // @ts-expect-error exactly one content representation is allowed.
  const conflictingMessage: InputRichMessage = { blocks: [], html: "<p>Hello</p>" };
  // @ts-expect-error parse_mode and caption_entities are mutually exclusive.
  const conflictingCaption: InputMediaPhoto = {
    type: "photo",
    media: "id",
    parse_mode: "HTML",
    caption_entities: [],
  };
  // @ts-expect-error text_link entities require their URL.
  const incompleteEntity: MessageEntity = { type: "text_link", offset: 0, length: 1 };
  void conflictingMessage;
  void conflictingCaption;
  void incompleteEntity;

  // @ts-expect-error InputMedia fields are closed against misspelled Bot API properties.
  const invalidMedia: InputMediaPhoto = { type: "photo", media: "id", has_spolier: true };
  void invalidMedia;

  // @ts-expect-error checked is only meaningful when checkbox is enabled.
  <ListItem checked />;

  // @ts-expect-error leaf components do not accept children.
  <Divider>not allowed</Divider>;

  // @ts-expect-error structural containers do not accept raw text.
  <Table>not a row</Table>;

  const output = render(<RichMessage><Paragraph>Hello</Paragraph></RichMessage>);
  const first = output.blocks[0]!;

  if (first.type === "table") {
    expectType<InputRichBlockTable>(first);
    expectType<readonly (readonly unknown[])[]>(first.cells);
  }

  if (first.type === "paragraph") {
    expectType<InputRichBlockParagraph>(first);
    // @ts-expect-error paragraph blocks do not expose table cells.
    first.cells;
  }
}
