export type Track = { title: string; feat?: string; length: string };

export type Release = {
  slug: string;
  title: string;
  kind: "Album" | "EP" | "Single";
  date: string; // ISO
  label: string;
  cover: string;
  apple?: string;
  feat?: string;
  tracks?: Track[];
};

export const albums: Release[] = [
  {
    slug: "destiny",
    title: "Destiny",
    kind: "Album",
    date: "2026-07-03",
    label: "RnPiano Records",
    cover: "/covers/2026-destiny.jpg",
    apple: "https://music.apple.com/us/album/destiny/6781640117",
    tracks: [
      { title: "Piano Love Intro", feat: "Theola", length: "5:17" },
      { title: "Get Loose", feat: "Lyle.OG, Kelly", length: "6:52" },
      { title: "Dance With Me", feat: "Jose", length: "8:13" },
      { title: "Reflectionz", length: "6:57" },
      { title: "Losing It", feat: "Kelly", length: "6:40" },
      { title: "Higher", feat: "Theola", length: "6:08" },
      { title: "Don't Dxla", length: "6:08" },
      { title: "You (Acoustic Outro)", feat: "Theola", length: "2:58" },
    ],
  },
  {
    slug: "2-sides-of-me",
    title: "2 Sides Of Me",
    kind: "Album",
    date: "2024-11-15",
    label: "Lush Production Haus",
    cover: "/covers/2024-2-sides-of-me.jpg",
    apple: "https://music.apple.com/us/album/2-sides-of-me/1778836401",
    tracks: [
      { title: "Connection", feat: "Luke M, Leia, LuE", length: "7:00" },
      { title: "She Said", feat: "Lyle OG, Nino Neels", length: "6:09" },
      { title: "Ses'fikile", feat: "LuE", length: "6:04" },
      { title: "Saxy Drum", feat: "Nino Neels", length: "7:00" },
      { title: "Thought Of You", feat: "Leia", length: "7:00" },
      { title: "Girls Night", feat: "Danielle Whitebooi, Leia", length: "6:26" },
    ],
  },
  {
    slug: "new-era-ep",
    title: "New Era",
    kind: "EP",
    date: "2024-04-11",
    label: "Statemint",
    cover: "/covers/2024-new-era-ep.jpg",
    apple: "https://music.apple.com/us/album/new-era-ep/1740495449",
    tracks: [
      { title: "Insecure", feat: "The Squad, Mikhale Jones", length: "7:34" },
      { title: "Dreamz", feat: "Bazy B, Cya M", length: "7:52" },
      { title: "Where did you go", feat: "Mikhale Jones", length: "7:34" },
      { title: "Your love", feat: "Zane Gulston, Leia", length: "7:00" },
      { title: "No one", feat: "Leia", length: "6:37" },
    ],
  },
];

const single = (
  slug: string,
  title: string,
  date: string,
  cover: string,
  label: string,
  apple: string,
  feat?: string,
): Release => ({
  slug,
  title,
  kind: "Single",
  date,
  label,
  feat,
  apple,
  cover: `/covers/${cover}`,
});

export const singles: Release[] = [
  single("nova-rec", "Nova Rec 2.0 (Quantum Sound)", "2023-05-08", "2023-nova-rec-2-0-quantum-sound.jpg", "RnPiano Records", "https://music.apple.com/us/album/nova-rec-2-0-quantum-sound-single/1686987717"),
  single("between-the-keys", "Between The Keys", "2023-03-23", "2023-between-the-keys.jpg", "1758237 Records DK", "https://music.apple.com/us/album/between-the-keys-single/1678692549"),
  single("banane-mavoko", "Banane Mavoko 2.0", "2023-01-29", "2023-banane-mavoko-2-0.jpg", "1758237 Records DK", "https://music.apple.com/us/album/banane-mavoko-2-0-single/1668691877"),
  single("my-boo", "My Boo", "2022-12-15", "2022-my-boo.jpg", "1758237 Records DK", "https://music.apple.com/us/album/my-boo-feat-jayda-lums-single/1660145958", "Jayda\"Lums"),
  single("saxy-dayz", "Saxy Dayz", "2022-08-23", "2022-saxy-dayz.jpg", "1758237 Records DK", "https://music.apple.com/us/album/saxy-dayz-single/1641407586"),
  single("need-you", "Need You", "2022-07-20", "2022-need-you.jpg", "1758237 Records DK", "https://music.apple.com/us/album/need-you-single/1635576027"),
  single("whenever-you-ready", "Whenever you ready", "2021-02-12", "2021-whenever-you-ready.jpg", "1758237 Records DK", "https://music.apple.com/us/album/whenever-you-ready-feat-sky-iscariot-single/1553657697", "Sky Iscariot"),
  single("ayeyeye", "Ayeyeye Ayayaya", "2021-01-24", "2021-ayeyeye-ayayaya.jpg", "1758237 Records DK", "https://music.apple.com/us/album/ayeyeye-ayayaya-single/1550503712"),
  single("pushed-me-away", "Pushed Me Away", "2020-08-25", "2020-pushed-me-away.jpg", "1758237 Records DK", "https://music.apple.com/us/album/pushed-me-away-feat-chaidene-single/1529199669", "Chaidene"),
  single("feelings", "Feelings", "2020-07-01", "2020-feelings.jpg", "1758237 Records DK", "https://music.apple.com/us/album/feelings-feat-chaidene-single/1522069839", "Chaidene"),
];

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export const listenLinks = (r: { title: string; apple?: string }) => {
  const q = encodeURIComponent(`DJ ShadzO ${r.title}`);
  return [
    { name: "Apple Music", href: r.apple ?? `https://music.apple.com/us/search?term=${q}` },
    { name: "Spotify", href: `https://open.spotify.com/search/${q}` },
    { name: "YouTube Music", href: `https://music.youtube.com/search?q=${q}` },
  ];
};
