import {
    collage,
    paragraph,
    photo,
    richMessage,
    video,
} from "../../src/core.ts";

// Media blocks carry a Telegram InputMedia payload. The `media` field accepts
// a file_id or URL string (the default), and collage/slideshow group several
// media blocks under a single caption.
export const withMedia = richMessage(
    paragraph("Trip highlights:"),
    collage(
        { caption: "Gallery", credit: "Photographer" },
        photo({
            media: { type: "photo", media: "https://example.com/beach.jpg" },
        }),
        photo({ media: { type: "photo", media: "photo-file-id" } }),
    ),
    video({
        media: { type: "video", media: "video-file-id" },
        caption: "Sunset timelapse",
    }),
);

export const withMediaJson = JSON.stringify(withMedia);
