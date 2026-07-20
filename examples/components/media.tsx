import {
    Collage,
    expectRichMessage,
    Paragraph,
    Photo,
    RichMessage,
    Video,
} from "../../src/components.ts";

// Media components take an InputMedia payload through the `media` prop and,
// where the block supports it, a caption. <Collage> groups several media
// children under one caption.
export const withMedia = expectRichMessage(
    <RichMessage>
        <Paragraph>Trip highlights:</Paragraph>
        <Collage caption="Gallery" credit="Photographer">
            <Photo
                media={{
                    type: "photo",
                    media: "https://example.com/beach.jpg",
                }}
            />
            <Photo media={{ type: "photo", media: "photo-file-id" }} />
        </Collage>
        <Video
            media={{ type: "video", media: "video-file-id" }}
            caption="Sunset timelapse"
        />
    </RichMessage>,
);

export const withMediaJson = JSON.stringify(withMedia);
