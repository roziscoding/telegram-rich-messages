import { type ChildrenProps, type NoChildrenProps } from "./shared.js";
export declare function Bold(props: ChildrenProps): {
    readonly kind: "bold";
    readonly props: ChildrenProps;
};
export declare function Italic(props: ChildrenProps): {
    readonly kind: "italic";
    readonly props: ChildrenProps;
};
export declare function Underline(props: ChildrenProps): {
    readonly kind: "underline";
    readonly props: ChildrenProps;
};
export declare function Strikethrough(props: ChildrenProps): {
    readonly kind: "strikethrough";
    readonly props: ChildrenProps;
};
export declare function Spoiler(props: ChildrenProps): {
    readonly kind: "spoiler";
    readonly props: ChildrenProps;
};
export declare function Subscript(props: ChildrenProps): {
    readonly kind: "subscript";
    readonly props: ChildrenProps;
};
export declare function Superscript(props: ChildrenProps): {
    readonly kind: "superscript";
    readonly props: ChildrenProps;
};
export declare function Marked(props: ChildrenProps): {
    readonly kind: "marked";
    readonly props: ChildrenProps;
};
export declare function Code(props: ChildrenProps): {
    readonly kind: "code";
    readonly props: ChildrenProps;
};
export declare function DateTime(props: ChildrenProps & {
    unixTime: number;
    format: string;
}): {
    readonly kind: "date_time";
    readonly props: ChildrenProps & {
        unixTime: number;
        format: string;
    };
};
export declare function TextMention(props: ChildrenProps & {
    user: Record<string, unknown>;
}): {
    readonly kind: "text_mention";
    readonly props: ChildrenProps & {
        user: Record<string, unknown>;
    };
};
export declare function CustomEmoji(props: {
    id: string;
    alt: string;
} & NoChildrenProps): {
    readonly kind: "custom_emoji";
    readonly props: {
        id: string;
        alt: string;
    } & NoChildrenProps;
};
export declare function InlineMath(props: {
    expression: string;
} & NoChildrenProps): {
    readonly kind: "mathematical_expression";
    readonly props: {
        expression: string;
    } & NoChildrenProps;
};
export declare function Link(props: ChildrenProps & {
    url: string;
}): {
    readonly kind: "url";
    readonly props: ChildrenProps & {
        url: string;
    };
};
export declare function Email(props: ChildrenProps & {
    address: string;
}): {
    readonly kind: "email_address";
    readonly props: ChildrenProps & {
        address: string;
    };
};
export declare function Phone(props: ChildrenProps & {
    number: string;
}): {
    readonly kind: "phone_number";
    readonly props: ChildrenProps & {
        number: string;
    };
};
export declare function BankCard(props: ChildrenProps & {
    number: string;
}): {
    readonly kind: "bank_card_number";
    readonly props: ChildrenProps & {
        number: string;
    };
};
export declare function Mention(props: ChildrenProps & {
    username: string;
}): {
    readonly kind: "mention";
    readonly props: ChildrenProps & {
        username: string;
    };
};
export declare function Hashtag(props: ChildrenProps & {
    value: string;
}): {
    readonly kind: "hashtag";
    readonly props: ChildrenProps & {
        value: string;
    };
};
export declare function Cashtag(props: ChildrenProps & {
    value: string;
}): {
    readonly kind: "cashtag";
    readonly props: ChildrenProps & {
        value: string;
    };
};
export declare function BotCommand(props: ChildrenProps & {
    command: string;
}): {
    readonly kind: "bot_command";
    readonly props: ChildrenProps & {
        command: string;
    };
};
export declare function TextAnchor(props: {
    name: string;
} & NoChildrenProps): {
    readonly kind: "anchor";
    readonly props: {
        name: string;
    } & NoChildrenProps;
};
export declare function AnchorLink(props: ChildrenProps & {
    name: string;
}): {
    readonly kind: "anchor_link";
    readonly props: ChildrenProps & {
        name: string;
    };
};
export declare function Reference(props: ChildrenProps & {
    name: string;
}): {
    readonly kind: "reference";
    readonly props: ChildrenProps & {
        name: string;
    };
};
export declare function ReferenceLink(props: ChildrenProps & {
    name: string;
}): {
    readonly kind: "reference_link";
    readonly props: ChildrenProps & {
        name: string;
    };
};
//# sourceMappingURL=text.d.ts.map