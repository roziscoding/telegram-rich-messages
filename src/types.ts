export interface InputRichMessage {
  blocks: InputRichBlock[];
  is_rtl?: boolean;
  skip_entity_detection?: boolean;
}

export type RichText = string | RichText[] | { type: string; [key: string]: unknown };
export type InputRichBlock = { type: string; [key: string]: unknown };

export interface Location {
  latitude: number;
  longitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

interface InputMediaBase { media: string; [key: string]: unknown; }
export interface InputMediaAnimation extends InputMediaBase { type: "animation"; }
export interface InputMediaAudio extends InputMediaBase { type: "audio"; }
export interface InputMediaPhoto extends InputMediaBase { type: "photo"; }
export interface InputMediaVideo extends InputMediaBase { type: "video"; }
export interface InputMediaVoiceNote extends InputMediaBase { type: "voice_note"; }
