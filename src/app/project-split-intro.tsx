import Image, { type StaticImageData } from "next/image";
import brush from "../../assets/brush.svg";
import { longestTitleLine } from "./project-intro";

type ProjectSplitIntroProps = {
  /** Heading lines; `highlight` is appended to the last one with the brush underline. */
  titleLines: string[];
  highlight: string;
  paragraphs: string[];
  /** Full-width image under the heading and copy. */
  image: { src: StaticImageData; alt: string };
};

/** Project inner page intro: heading on the left, copy on the right, one wide image below. */
export default function ProjectSplitIntro({ titleLines, highlight, paragraphs, image }: ProjectSplitIntroProps) {
  return (
    <section className="project-split" aria-labelledby="project-split-title">
      <div className="project-split-head">
        <h2
          className="project-intro-title"
          id="project-split-title"
          data-reveal
          style={{ "--intro-title-chars": longestTitleLine(titleLines, highlight) } as React.CSSProperties}
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
                </>
              ) : null}
            </span>
          ))}
        </h2>

        <div
          className="project-intro-copy project-split-copy"
          data-reveal
          style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
        >
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="project-split-image" data-reveal="scale">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" />
      </div>
    </section>
  );
}
