import Image from "next/image";
import arrowRight from "../../assets/arrow-right.svg";
import brush from "../../assets/brush.svg";
import AboutStats from "./about-stats";
import DolmenHero from "./dolmen-hero";
import FeaturedDevelopments from "./featured-developments";
import FutureMarquee from "./future-marquee";
import LatestUpdates from "./latest-updates";
import ProjectSlides from "./project-slides";
import ContactSection from "./contact-section";
import ContactTalk from "./contact-talk";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />

      <DolmenHero />

      <section className="about-section" id="about" aria-labelledby="about-title">
        <h2 className="about-title" id="about-title">
          Where Life, Business
          <br />
          and Cities{" "}
          <span>
            Meet.
            <Image
              className="title-brush"
              src={brush}
              alt=""
              aria-hidden="true"
              style={{ width: "100%", height: "14px" }}
            />
          </span>
        </h2>

        <div className="about-content">
          <p className="about-statement">
            Redefining Spaces. Enriching Lives. Shaping Tomorrow.
          </p>

          <div className="about-copy">
            <p>
              For over 35 years, Dolmen Group has redefined Pakistan&apos;s real estate landscape with landmark destinations.
            </p>
            <p>
              We create vibrant spaces from retail and commercial developments to integrated destinations that bring people, businesses and communities together.
            </p>
            <a className="about-button" href="#about-story">
              Discover Our Story
              <Image src={arrowRight} alt="" aria-hidden="true" />
            </a>
          </div>
        </div>

        <AboutStats />
      </section>

      <ProjectSlides />

      <FeaturedDevelopments />

      <ContactSection />

      <LatestUpdates />

      <ContactTalk />

      <FutureMarquee />

      <SiteFooter />
    </div>
  );
}
