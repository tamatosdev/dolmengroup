import Image, { type StaticImageData } from "next/image";
import arrowRight from "../../assets/arrow-right.svg";
import brush from "../../assets/brush.svg";

type ProjectIntroProps = {
  /** Heading lines; `highlight` is appended to the last one with the brush underline. */
  titleLines: string[];
  highlight: string;
  /** Optional words after the highlight on the last line, e.g. "Mall" in "Neighborhood Mall". */
  titleAfter?: string;
  paragraphs: string[];
  /** Optional button under the copy, e.g. the project's own website (opens in a new tab). */
  cta?: { label: string; href: string };
  /** Wide image under the copy (left) and tall image beside it (right).
      Leave both out for a centred, text-only intro. */
  wideImage?: { src: StaticImageData; alt: string };
  tallImage?: { src: StaticImageData; alt: string };
  /** Put the tall image on the left and the copy on the right (desktop only). */
  reverse?: boolean;
};

/** Characters in the longest heading line, so phones can size the heading to keep every line whole. */
export function longestTitleLine(titleLines: string[], highlight: string, titleAfter?: string) {
  const lines = titleLines.map((line, index) =>
    index === titleLines.length - 1 ? [line, highlight, titleAfter].filter(Boolean).join(" ") : line,
  );
  return Math.max(...lines.map((line) => line.length));
}

/** Project inner page intro: heading, copy and two images in a two-column layout,
    or centred heading and copy when there are no images. */
export default function ProjectIntro({
  titleLines,
  highlight,
  titleAfter,
  paragraphs,
  cta,
  wideImage,
  tallImage,
  reverse = false,
}: ProjectIntroProps) {
  const textOnly = !wideImage && !tallImage;

  return (
    <section
      className={`project-intro${reverse ? " is-reversed" : ""}${textOnly ? " is-text-only" : ""}`}
      aria-labelledby="project-intro-title"
    >
      <div className="project-intro-main">
        <h2
          className="project-intro-title"
          id="project-intro-title"
          data-reveal
          style={{ "--intro-title-chars": longestTitleLine(titleLines, highlight, titleAfter) } as React.CSSProperties}
        >
          {titleLines.map((line, index) => (
            <span className="project-intro-line" key={`${index}-${line}`}>
              {line}
              {index === titleLines.length - 1 ? (
                <>
                  {line ? " " : null}
                  <span className="project-intro-highlight">
                    {highlight}
                    <Image className="title-brush" src={brush} alt="" aria-hidden="true" />
                  </span>
                  {titleAfter ? ` ${titleAfter}` : null}
                </>
              ) : null}
            </span>
          ))}
        </h2>

        <div className="project-intro-copy" data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          {cta ? (
            <a className="project-intro-button" href={cta.href} target="_blank" rel="noopener noreferrer">
              {cta.label}
              <Image src={arrowRight} alt="" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>

        {wideImage ? (
          <div
            className="project-intro-image project-intro-image-wide"
            data-reveal
            style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
          >
            <Image src={wideImage.src} alt={wideImage.alt} fill sizes="(max-width: 768px) 100vw, 52vw" />
          </div>
        ) : null}
      </div>

      {tallImage ? (
        <div
          className="project-intro-image project-intro-image-tall"
          data-reveal
          style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
        >
          <Image src={tallImage.src} alt={tallImage.alt} fill sizes="(max-width: 768px) 100vw, 40vw" />
        </div>
      ) : null}
    </section>
  );
}
