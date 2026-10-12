export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rnpiano.com"
).replace(/\/$/, "");

export const SITE = {
  name: "RNPiano",
  artist: "DJ ShadzO",
  title: "DJ ShadzO | RNPiano: Amapiano & R&B DJ from South Africa",
  description:
    "RNPiano is DJ ShadzO's sound: amapiano smoothed with R&B. Hear the new album Destiny, play the piano, watch live mixes and book DJ ShadzO.",
  social: {
    instagram: "https://www.instagram.com/its.dj_shadzo/",
    tiktok: "https://www.tiktok.com/@its.dj_shadzo",
    youtube: "https://www.youtube.com/@DJShadzO-Official",
    apple: "https://music.apple.com/us/artist/dj-shadzo/1521951814",
  },
};
