import Image from "next/image";
import Link from "next/link";
import arrowRight from "../../assets/arrow-right.svg";
import arrowUp from "../../assets/arrow-up.svg";
import brush from "../../assets/brush.svg";
import footerLogo from "../../assets/footer-logo.png";
import DolmenNumbers from "./dolmen-numbers";
import DolmenHero from "./dolmen-hero";
import FeaturedDevelopments from "./featured-developments";
import FutureMarquee from "./future-marquee";
import LatestUpdates from "./latest-updates";
import ProjectSlides from "./project-slides";
import ProjectOverviewSlider from "./project-overview-slider";
import ContactSection from "./contact-section";
import SiteHeader from "./site-header";

export default function Home() {
  return (
    <div className="site-shell">
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
              style={{ width: "100%", height: "9px" }}
            />
          </span>
        </h2>

        <div className="about-content">
          <p className="about-statement">
            A building occupies space.
            <br />
            Destination creates meaning.
          </p>

          <div className="about-copy">
            <p>
              Dolmen approaches development through the way people experience a place — how they arrive, move, meet, work, shop, unwind and return.
            </p>
            <p>
              For over 35 years, Dolmen Group has been shaping Pakistan&apos;s real estate landscape with landmark destinations.
            </p>
            <p className="about-claim">We create places with a life beyond their walls.</p>
            <a className="about-button" href="#about-story">
              Discover Our Story
              <Image src={arrowRight} alt="" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <ProjectSlides />

      <FeaturedDevelopments />

      <DolmenNumbers />

      <ContactSection />

      <ProjectOverviewSlider />

      <LatestUpdates />

      <FutureMarquee />

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-link-group">
            <h2>Socials</h2>
            <a href="#instagram">Instagram</a>
            <a href="#facebook">Facebook</a>
            <a href="#linkedin">LinkedIn</a>
          </div>

          <div className="footer-link-group">
            <h2>Company</h2>
            <a href="#about">About</a>
            <a href="#updates">Updates</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="newsletter">
            <h2>Stay Updated</h2>
            <p>Subscribe to get fresh property listings, market updates,<br />and expert tips delivered straight to your inbox.</p>
            <form className="newsletter-form">
              <label className="sr-only" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Type your email"
                suppressHydrationWarning
              />
              <button type="submit" aria-label="Subscribe">
                <Image src={arrowRight} alt="" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-main">
          <Link className="footer-brand" href="/" aria-label="Dolmen home">
            <Image src={footerLogo} alt="Dolmen - Building a better future" />
          </Link>

          <div className="footer-properties">
            <div className="footer-property-group">
              <h2>Malls</h2>
              <a href="#dolmen-mall-clifton">Dolmen Mall Clifton</a>
              <a href="#dolmen-mall-lahore">Dolmen Mall Lahore</a>
              <a href="#dolmen-mall-tariq-road">Dolmen Mall Tariq Road</a>
              <a href="#dolmen-mall-hyleri">Dolmen Mall Hyderi</a>
            </div>

            <div className="footer-property-group">
              <h2>Offices</h2>
              <a href="#the-harbour-front">The Harbour Front</a>
              <a href="#sky-towers">Sky Towers</a>
              <a href="#corporate-office-block">Corporate Office Block</a>
              <a href="#executive-tower">Executive Tower</a>
            </div>

            <div className="footer-property-group">
              <h2>Residences</h2>
              <a href="#the-grove-residency">The Grove Residency</a>
              <a href="#dolmen-city-islamabad">Dolmen City Islamabad</a>
              <a href="#dolmen-mall-lahore-residences">Dolmen Mall Lahore</a>
            </div>

            <div className="footer-property-group">
              <h2>Entertainment</h2>
              <a href="#sindbads-wonderland">Sindbad&apos;s Wonderland</a>
            </div>

            <div className="footer-property-group">
              <h2>Retail</h2>
              <a href="#giordano">Giordano</a>
              <a href="#bala-bala">Bala Bala</a>
            </div>
          </div>

          <a className="back-to-top" href="#top" aria-label="Back to top">
            <Image src={arrowUp} alt="" aria-hidden="true" />
          </a>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Dolmen Group. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
