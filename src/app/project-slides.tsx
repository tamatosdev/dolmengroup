import Image from "next/image";
import groveProjectImage from "../../assets/grove-project-image.jpg";
import dolmenIslamabadProject from "../../assets/dolmen-islamabad-project.jpg";
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
        {slides.map((slide, index) => (
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
          </article>
        ))}
      </div>
    </section>
  );
}
