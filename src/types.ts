export interface InputRichMessageMedia {
  id: string;
  media: InputMediaAnimation | InputMediaAudio | InputMediaPhoto | InputMediaVideo | InputMediaVoiceNote;
}

interface InputRichMessageOptions {
  is_rtl?: boolean;
  skip_entity_detection?: boolean;
}

export type InputRichMessage = InputRichMessageOptions & (
  | { blocks: InputRichBlock[]; html?: never; markdown?: never; media?: never }
  | { html: string; blocks?: never; markdown?: never; media?: InputRichMessageMedia[] }
  | { markdown: string; blocks?: never; html?: never; media?: InputRichMessageMedia[] }
);

export interface RenderedRichMessage {
  blocks: InputRichBlock[];
  is_rtl?: true;
  skip_entity_detection?: true;
}

export interface RichTextNested {
  type: "bold" | "italic" | "underline" | "strikethrough" | "spoiler" | "subscript" | "superscript" | "marked" | "code";
  text: RichText;
}

export interface RichTextDateTime {
  type: "date_time";
  text: RichText;
  unix_time: number;
  date_time_format: string;
}

export interface RichTextTextMention {
  type: "text_mention";
  text: RichText;
  user: Record<string, unknown>;
}

export interface RichTextCustomEmoji {
  type: "custom_emoji";
  custom_emoji_id: string;
  alternative_text: string;
}

export interface RichTextMathematicalExpression {
  type: "mathematical_expression";
  expression: string;
}

export interface RichTextUrl { type: "url"; text: RichText; url: string; }
export interface RichTextEmailAddress { type: "email_address"; text: RichText; email_address: string; }
export interface RichTextPhoneNumber { type: "phone_number"; text: RichText; phone_number: string; }
export interface RichTextBankCardNumber { type: "bank_card_number"; text: RichText; bank_card_number: string; }
export interface RichTextMention { type: "mention"; text: RichText; username: string; }
export interface RichTextHashtag { type: "hashtag"; text: RichText; hashtag: string; }
export interface RichTextCashtag { type: "cashtag"; text: RichText; cashtag: string; }
export interface RichTextBotCommand { type: "bot_command"; text: RichText; bot_command: string; }
export interface RichTextAnchor { type: "anchor"; name: string; }
export interface RichTextAnchorLink { type: "anchor_link"; text: RichText; anchor_name: string; }
export interface RichTextReference { type: "reference"; text: RichText; name: string; }
export interface RichTextReferenceLink { type: "reference_link"; text: RichText; reference_name: string; }

export type RichTextEntity =
  | RichTextNested
  | RichTextDateTime
  | RichTextTextMention
  | RichTextCustomEmoji
  | RichTextMathematicalExpression
  | RichTextUrl
  | RichTextEmailAddress
  | RichTextPhoneNumber
  | RichTextBankCardNumber
  | RichTextMention
  | RichTextHashtag
  | RichTextCashtag
  | RichTextBotCommand
  | RichTextAnchor
  | RichTextAnchorLink
  | RichTextReference
  | RichTextReferenceLink;

export type RichText = string | RichText[] | RichTextEntity;

export interface RichBlockCaption {
  text: RichText;
  credit?: RichText;
}

export interface RichBlockListItemBase {
  blocks: InputRichBlock[];
  value?: number;
  type?: "a" | "A" | "i" | "I" | "1";
}

export type RichBlockListItem = RichBlockListItemBase & (
  | { has_checkbox: true; is_checked?: true }
  | { has_checkbox?: never; is_checked?: never }
);

export interface RichBlockTableCell {
  text?: RichText;
  align: "left" | "center" | "right";
  valign: "top" | "middle" | "bottom";
  is_header?: true;
  colspan?: number;
  rowspan?: number;
}

export interface InputRichBlockParagraph { type: "paragraph"; text: RichText; }
export interface InputRichBlockFooter { type: "footer"; text: RichText; }
export interface InputRichBlockThinking { type: "thinking"; text: RichText; }
export interface InputRichBlockHeading { type: "heading"; text: RichText; size: 1 | 2 | 3 | 4 | 5 | 6; }
export interface InputRichBlockPre { type: "pre"; text: RichText; language?: string; }
export interface InputRichBlockDivider { type: "divider"; }
export interface InputRichBlockMathematicalExpression { type: "mathematical_expression"; expression: string; }
export interface InputRichBlockAnchor { type: "anchor"; name: string; }
export interface InputRichBlockList { type: "list"; items: RichBlockListItem[]; }
export interface InputRichBlockBlockQuote { type: "blockquote"; blocks: InputRichBlock[]; credit?: RichText; }
export interface InputRichBlockPullQuote { type: "pullquote"; text: RichText; credit?: RichText; }
export interface InputRichBlockCollage { type: "collage"; blocks: InputRichBlock[]; caption?: RichBlockCaption; }
export interface InputRichBlockSlideshow { type: "slideshow"; blocks: InputRichBlock[]; caption?: RichBlockCaption; }
export interface InputRichBlockTable {
  type: "table";
  cells: RichBlockTableCell[][];
  is_bordered?: true;
  is_striped?: true;
  caption?: RichText;
}
export interface InputRichBlockDetails { type: "details"; summary: RichText; blocks: InputRichBlock[]; is_open?: true; }

export interface Location {
  latitude: number;
  longitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

interface MessageEntityBase {
  offset: number;
  length: number;
}

type MessageEntitySimpleType =
  | "mention" | "hashtag" | "cashtag" | "bot_command" | "url" | "email"
  | "phone_number" | "bold" | "italic" | "underline" | "strikethrough"
  | "spoiler" | "blockquote" | "expandable_blockquote" | "code";

export type MessageEntity = MessageEntityBase & (
  | { type: MessageEntitySimpleType }
  | { type: "pre"; language?: string }
  | { type: "text_link"; url: string }
  | { type: "text_mention"; user: Record<string, unknown> }
  | { type: "custom_emoji"; custom_emoji_id: string }
  | { type: "date_time"; unix_time: number; date_time_format: string }
);

type InputMediaCaptionFields =
  | { caption?: string; parse_mode?: string; caption_entities?: never }
  | { caption?: string; parse_mode?: never; caption_entities: MessageEntity[] };

export type InputMediaAnimation = InputMediaCaptionFields & {
  type: "animation";
  media: string;
  thumbnail?: string;
  show_caption_above_media?: boolean;
  width?: number;
  height?: number;
  duration?: number;
  has_spoiler?: boolean;
};

export type InputMediaAudio = InputMediaCaptionFields & {
  type: "audio";
  media: string;
  thumbnail?: string;
  duration?: number;
  performer?: string;
  title?: string;
};

export type InputMediaPhoto = InputMediaCaptionFields & {
  type: "photo";
  media: string;
  show_caption_above_media?: boolean;
  has_spoiler?: boolean;
};

export type InputMediaVideo = InputMediaCaptionFields & {
  type: "video";
  media: string;
  thumbnail?: string;
  cover?: string;
  start_timestamp?: number;
  show_caption_above_media?: boolean;
  width?: number;
  height?: number;
  duration?: number;
  supports_streaming?: boolean;
  has_spoiler?: boolean;
};

export type InputMediaVoiceNote = InputMediaCaptionFields & {
  type: "voice_note";
  media: string;
  duration?: number;
};

export interface InputRichBlockMap {
  type: "map";
  location: Location;
  zoom: number;
  width: number;
  height: number;
  caption?: RichBlockCaption;
}
export interface InputRichBlockAnimation { type: "animation"; animation: InputMediaAnimation; caption?: RichBlockCaption; }
export interface InputRichBlockAudio { type: "audio"; audio: InputMediaAudio; caption?: RichBlockCaption; }
export interface InputRichBlockPhoto { type: "photo"; photo: InputMediaPhoto; caption?: RichBlockCaption; }
export interface InputRichBlockVideo { type: "video"; video: InputMediaVideo; caption?: RichBlockCaption; }
export interface InputRichBlockVoiceNote { type: "voice_note"; voice_note: InputMediaVoiceNote; caption?: RichBlockCaption; }

export type InputRichBlock =
  | InputRichBlockParagraph
  | InputRichBlockFooter
  | InputRichBlockThinking
  | InputRichBlockHeading
  | InputRichBlockPre
  | InputRichBlockDivider
  | InputRichBlockMathematicalExpression
  | InputRichBlockAnchor
  | InputRichBlockList
  | InputRichBlockBlockQuote
  | InputRichBlockPullQuote
  | InputRichBlockCollage
  | InputRichBlockSlideshow
  | InputRichBlockTable
  | InputRichBlockDetails
  | InputRichBlockMap
  | InputRichBlockAnimation
  | InputRichBlockAudio
  | InputRichBlockPhoto
  | InputRichBlockVideo
  | InputRichBlockVoiceNote;
