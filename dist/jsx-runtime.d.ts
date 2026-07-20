import type { InputMediaAnimation, InputMediaAudio, InputMediaPhoto, InputMediaVideo, InputMediaVoiceNote, Location } from "./types.js";
export type RichTextNodeKind = "bold" | "italic" | "underline" | "strikethrough" | "spoiler" | "subscript" | "superscript" | "marked" | "code" | "date_time" | "text_mention" | "custom_emoji" | "mathematical_expression" | "url" | "email_address" | "phone_number" | "bank_card_number" | "mention" | "hashtag" | "cashtag" | "bot_command" | "anchor" | "anchor_link" | "reference" | "reference_link";
export type BlockNodeKind = "paragraph" | "footer" | "thinking" | "heading" | "pre" | "divider" | "block-mathematical_expression" | "block-anchor" | "list" | "blockquote" | "pullquote" | "collage" | "slideshow" | "table" | "details" | "map" | "animation" | "audio" | "photo" | "video" | "voice_note";
export type StructuralNodeKind = "rich-message" | "list-item" | "table-row" | "table-cell";
export type NodeKind = RichTextNodeKind | BlockNodeKind | StructuralNodeKind;
export type Node<K extends NodeKind = NodeKind> = K extends NodeKind ? {
    readonly kind: K;
    readonly props: NodePropsByKind[K];
} : never;
export type Child = Node | string | number | boolean | null | undefined | readonly Child[];
export type ElementChild = Node | boolean | null | undefined | readonly ElementChild[];
export interface ChildrenProps {
    children?: Child;
}
export interface ElementChildrenProps {
    children?: ElementChild;
}
export interface NoChildrenProps {
    children?: never;
}
export type CaptionProps = {
    caption: Child;
    credit?: Child;
} | {
    caption?: undefined;
    credit?: never;
};
export type ListItemSelectionProps = {
    checkbox: true;
    checked?: boolean;
} | {
    checkbox?: false;
    checked?: never;
};
export interface NodePropsByKind {
    bold: ChildrenProps;
    italic: ChildrenProps;
    underline: ChildrenProps;
    strikethrough: ChildrenProps;
    spoiler: ChildrenProps;
    subscript: ChildrenProps;
    superscript: ChildrenProps;
    marked: ChildrenProps;
    code: ChildrenProps;
    date_time: ChildrenProps & {
        unixTime: number;
        format: string;
    };
    text_mention: ChildrenProps & {
        user: Record<string, unknown>;
    };
    custom_emoji: {
        id: string;
        alt: string;
    } & NoChildrenProps;
    mathematical_expression: {
        expression: string;
    } & NoChildrenProps;
    url: ChildrenProps & {
        url: string;
    };
    email_address: ChildrenProps & {
        address: string;
    };
    phone_number: ChildrenProps & {
        number: string;
    };
    bank_card_number: ChildrenProps & {
        number: string;
    };
    mention: ChildrenProps & {
        username: string;
    };
    hashtag: ChildrenProps & {
        value: string;
    };
    cashtag: ChildrenProps & {
        value: string;
    };
    bot_command: ChildrenProps & {
        command: string;
    };
    anchor: {
        name: string;
    } & NoChildrenProps;
    anchor_link: ChildrenProps & {
        name: string;
    };
    reference: ChildrenProps & {
        name: string;
    };
    reference_link: ChildrenProps & {
        name: string;
    };
    paragraph: ChildrenProps;
    footer: ChildrenProps;
    thinking: ChildrenProps;
    heading: ChildrenProps & {
        size: 1 | 2 | 3 | 4 | 5 | 6;
    };
    pre: ChildrenProps & {
        language?: string;
    };
    divider: NoChildrenProps;
    "block-mathematical_expression": {
        expression: string;
    } & NoChildrenProps;
    "block-anchor": {
        name: string;
    } & NoChildrenProps;
    list: ElementChildrenProps;
    blockquote: ElementChildrenProps & {
        credit?: Child;
    };
    pullquote: ChildrenProps & {
        credit?: Child;
    };
    collage: ElementChildrenProps & CaptionProps;
    slideshow: ElementChildrenProps & CaptionProps;
    table: ElementChildrenProps & {
        bordered?: boolean;
        striped?: boolean;
        caption?: Child;
    };
    details: ElementChildrenProps & {
        summary: Child;
        open?: boolean;
    };
    map: {
        location: Location;
        zoom: number;
        width: number;
        height: number;
    } & CaptionProps & NoChildrenProps;
    animation: {
        media: InputMediaAnimation;
    } & CaptionProps & NoChildrenProps;
    audio: {
        media: InputMediaAudio;
    } & CaptionProps & NoChildrenProps;
    photo: {
        media: InputMediaPhoto;
    } & CaptionProps & NoChildrenProps;
    video: {
        media: InputMediaVideo;
    } & CaptionProps & NoChildrenProps;
    voice_note: {
        media: InputMediaVoiceNote;
    } & CaptionProps & NoChildrenProps;
    "rich-message": ElementChildrenProps & {
        isRtl?: boolean;
        skipEntityDetection?: boolean;
    };
    "list-item": ElementChildrenProps & ListItemSelectionProps & {
        value?: number;
        labelType?: "a" | "A" | "i" | "I" | "1";
    };
    "table-row": ElementChildrenProps;
    "table-cell": ChildrenProps & {
        header?: boolean;
        colspan?: number;
        rowspan?: number;
        align?: "left" | "center" | "right";
        valign?: "top" | "middle" | "bottom";
    };
}
export type Component<P = Record<string, unknown>> = (props: P) => Node;
export declare const Fragment: unique symbol;
export declare function jsx(type: Component<any> | typeof Fragment, props: Record<string, unknown>): Child;
export declare const jsxs: typeof jsx;
export declare const jsxDEV: typeof jsx;
export declare namespace JSX {
    type Element = Node;
    interface ElementChildrenAttribute {
        children: {};
    }
    interface IntrinsicElements {
    }
}
//# sourceMappingURL=jsx-runtime.d.ts.map