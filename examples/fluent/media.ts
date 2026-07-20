import { photo } from "../../src/core.ts";
import { RichMessage } from "../../src/fluent.ts";

// Media and container blocks are first-class fluent methods, so they can be
// composed inline without falling back to add(). The photo() calls nested in
// collage() still come from the core builders, because collage children are
// block values.
export const withMedia = new RichMessage()
    .paragraph("Trip highlights:")
    .collage(
        { caption: "Gallery", credit: "Photographer" },
        photo({
            media: { type: "photo", media: "https://example.com/beach.jpg" },
        }),
        photo({ media: { type: "photo", media: "photo-file-id" } }),
    )
    .video({
        media: { type: "video", media: "video-file-id" },
        caption: "Sunset timelapse",
    });

export const withMediaJson = JSON.stringify(withMedia);
