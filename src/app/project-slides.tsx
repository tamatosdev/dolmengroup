import Image from "next/image";
import Link from "next/link";
import groveProjectImage from "../../assets/grove-project-image.jpg";
import dolmenIslamabadProject from "../../assets/dolmen-islamabad-project.jpg";
import { projectPage } from "./project-pages";
import { SHOW_DOLMEN_CITY_ISLAMABAD } from "./project-visibility";

type ProjectSlide = {
  image: typeof groveProjectImage;
  title: string;
};

const slides: ProjectSlide[] = [
  {
    image: groveProjectImage,
    title: "Grove Residency Karachi",
  },
  ...(SHOW_DOLMEN_CITY_ISLAMABAD
    ? [
        {
          image: dolmenIslamabadProject,
          title: "Dolmen City Islamabad",
        } satisfies ProjectSlide,
      ]
    : []),
];

export default function ProjectSlides() {
  return (
    <section className="latest-developments" aria-labelledby="latest-developments-title">
      <h2 className="latest-developments-title" id="latest-developments-title">
        Latest Developments
      </h2>

      <div className="project-slides">
        {slides.map((slide, index) => {
          const href = projectPage(slide.title);

          return (
            <article className="project-slide" key={slide.title}>
              <Image
                className="project-slide-background"
                src={slide.image}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
              />
              <h3 className="project-slides-title">{slide.title}</h3>
              {href ? (
                // Covers the whole slide so the image and title both open the project page.
                <Link className="project-slide-link" href={href} aria-label={slide.title} />
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
