import type { CSSProperties } from "react";
import Image from "next/image";
import Piano from "@/components/Piano";
import ListenMenu from "@/components/ListenMenu";
import ScrollFX from "@/components/ScrollFX";
import BookingForm from "@/components/BookingForm";
import { albums, singles, formatDate } from "@/lib/catalog";
import { SITE, SITE_URL } from "@/lib/site";

const links = {
  youtube: "https://www.youtube.com/@DJShadzO-Official",
  instagram: "https://www.instagram.com/its.dj_shadzo/",
  tiktok: "https://www.tiktok.com/@its.dj_shadzo",
  chillas: "https://www.youtube.com/watch?v=3lA9ycFzq8M",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.name,
      description: SITE.description,
      inLanguage: "en-ZA",
    },
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}/#artist`,
      name: SITE.artist,
      alternateName: "DJ Shadzo",
      url: SITE_URL,
      image: `${SITE_URL}/rnpiano-logo.jpg`,
      genre: ["Amapiano", "R&B"],
      description: SITE.description,
      sameAs: Object.values(SITE.social),
      album: albums.map((a) => ({
        "@type": "MusicAlbum",
        name: a.title,
        albumReleaseType: a.kind === "EP" ? "EPRelease" : "AlbumRelease",
        datePublished: a.date,
        image: `${SITE_URL}${a.cover}`,
        url: a.apple,
        recordLabel: { "@type": "Organization", name: a.label },
        numTracks: a.tracks?.length,
        byArtist: { "@id": `${SITE_URL}/#artist` },
        track: a.tracks?.map((t, i) => ({
          "@type": "MusicRecording",
          position: i + 1,
          name: t.title,
        })),
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ScrollFX />
      <header className="nav">
        <a href="#top" className="wordmark" aria-label="RNPiano home">
          <Image
            src="/rnpiano-wordmark.png"
            alt="RNPiano"
            width={830}
            height={195}
            priority
          />
        </a>
        <nav aria-label="Primary">
          <a href="#destiny">Destiny</a>
          <a href="#music">Music</a>
          <a href="#mixes">Mixes</a>
          <a href="#about">The sound</a>
          <a href="#book" className="nav-cta">
            Book
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <p className="hero-by">DJ ShadzO presents</p>
          <h1>
            RN<span>Piano</span>
          </h1>
          <p className="hero-sub">
            Amapiano, smoothed with R&amp;B. Durban roots, Johannesburg floors.
          </p>
          <div className="hero-actions">
            <ListenMenu title="Destiny" apple={albums[0].apple} variant="solid" label="Listen now" />
            <a className="btn ghost" href="#book">
              Book DJ ShadzO
            </a>
          </div>
          <Piano />
        </section>

        <section id="destiny" className="section destiny">
          <div className="cover-frame" data-reveal>
          <Image
            className="cover"
            src={albums[0].cover}
            alt="Destiny album cover: DJ ShadzO seen from behind in a sepia living room, an RNPiano keyboard against the wall"
            width={1000}
            height={1000}
            sizes="(max-width: 820px) 90vw, 520px"
            priority
          />
          </div>
          <div className="copy" data-reveal style={{ "--i": 1 } as CSSProperties}>
            <h2>Destiny</h2>
            <p className="lede">
              The album, out 3 July 2026 on RnPiano Records, with a piano solo
              at its centre.
            </p>
            <p>
              ShadzO plays the keys himself. On Destiny he is keyboardist,
              songwriter, producer and engineer, so every chord you hear started
              under his hands.
            </p>
            <div className="actions left">
              <ListenMenu title="Destiny" apple={albums[0].apple} variant="solid" label="Listen now" />
              <a className="btn ghost" href={links.instagram} target="_blank" rel="noreferrer">
                Follow for updates
              </a>
            </div>
          </div>
        </section>

        <section id="music" className="section music">
          <div className="section-head" data-reveal>
            <h2>Music</h2>
            <p>
              Three full projects and ten singles since 2020. Open a release to
              see the tracklist.
            </p>
          </div>
          <div className="albums">
            {albums.map((r, i) => (
              <article
                key={r.slug}
                className="album"
                data-reveal
                style={{ "--i": i } as CSSProperties}
              >
                <Image
                  src={r.cover}
                  alt={`${r.title} cover`}
                  width={600}
                  height={600}
                  sizes="(max-width: 820px) 90vw, 380px"
                />
                <h3>{r.title}</h3>
                <p className="meta">
                  {r.kind}, {formatDate(r.date)}
                </p>
                <details>
                  <summary>Tracklist</summary>
                  <ol>
                    {r.tracks?.map((t) => (
                      <li key={t.title}>
                        <span>
                          {t.title}
                          {t.feat && <em> feat. {t.feat}</em>}
                        </span>
                        <time>{t.length}</time>
                      </li>
                    ))}
                  </ol>
                  <p className="meta">{r.label}</p>
                </details>
                <ListenMenu title={r.title} apple={r.apple} variant="solid" />
              </article>
            ))}
          </div>
          <h3 className="sub">Singles</h3>
          <ul className="singles">
            {singles.map((r, i) => (
              <li key={r.slug} data-reveal style={{ "--i": i % 5 } as CSSProperties}>
                <Image
                  src={r.cover}
                  alt={`${r.title} cover`}
                  width={400}
                  height={400}
                  sizes="(max-width: 560px) 45vw, 220px"
                />
                <strong>{r.title}</strong>
                <span>
                  {r.feat ? `feat. ${r.feat}, ` : ""}
                  {r.date.slice(0, 4)}
                </span>
                <ListenMenu title={r.title} apple={r.apple} />
              </li>
            ))}
          </ul>
        </section>

        <section id="mixes" className="section mixes">
          <div className="section-head" data-reveal>
            <h2>Live mixes</h2>
            <p>
              RnPiano Chillas, recorded live at Wild Waters in Boksburg. His own
              &ldquo;Losing It&rdquo; sits alongside Kelvin Momo, Dlala Regal,
              Stixx and The Squad.
            </p>
          </div>
          <div className="video" data-reveal>
            <iframe
              src="https://www.youtube-nocookie.com/embed/3lA9ycFzq8M"
              title="DJ ShadzO – RNPiano Chillas live mix"
              loading="lazy"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <a className="btn ghost" href={links.youtube} target="_blank" rel="noreferrer">
            More on YouTube
          </a>
        </section>

        <section id="about" className="section about">
          <h2>The ShadzO Experience</h2>
          <div className="about-grid" data-reveal>
            <p>
              RNPiano is where amapiano&rsquo;s bright, jazzy log drums meet the
              slow glide of R&amp;B. It runs as a mix series, a record label and
              a night out, from piano and R&amp;B evenings in Sandton to
              daytime sessions by the water.
            </p>
            <p>
              Don&rsquo;t dala. Come early, stay for the last chord.
            </p>
          </div>
        </section>

        <section id="book" className="section book">
          <h2 data-reveal>Book DJ ShadzO</h2>
          <p data-reveal style={{ "--i": 1 } as CSSProperties}>
            Bookings go through RNPiano. Tell us your date, venue and the kind
            of night you have in mind.
          </p>
          <div data-reveal style={{ "--i": 2 } as CSSProperties}>
            <BookingForm />
          </div>
          <p className="book-alt" data-reveal style={{ "--i": 3 } as CSSProperties}>
            Or reach us on
          </p>
          <div className="actions" data-reveal style={{ "--i": 4 } as CSSProperties}>
            <a className="btn ghost" href={links.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="btn ghost" href={links.tiktok} target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a className="btn ghost" href={links.youtube} target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-keys" aria-hidden="true" data-reveal>
          {Array.from({ length: 28 }).map((_, i) => (
            <i key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
        <p>&copy; 2026 RNPiano &middot; DJ ShadzO</p>
      </footer>
    </>
  );
}
