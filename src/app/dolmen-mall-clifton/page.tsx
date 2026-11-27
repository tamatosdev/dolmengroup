import type { Metadata } from "next";
import heroImage from "../../../assets/Dolmen Mall Clifton page/hero section.jpg";
import tallImage from "../../../assets/Dolmen Mall Clifton page/Pakistan’s Pioneering Shopping Destination /image 1336 (4).jpg";
import wideImage from "../../../assets/Dolmen Mall Clifton page/Pakistan’s Pioneering Shopping Destination /image 1335 (4).jpg";
import gallery1 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/Iconic Mall Architecture.jpg";
import gallery2 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/A World of Shopping.jpg";
import gallery3 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/Vibrant Dining Experience.jpg";
import gallery4 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/A Landmark Destination.jpg";
import gallery5 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/Iconic Exterior View.jpg";
import heroMobileImage from "../../../assets/Dolmen Mall Clifton page/mobile hero section updated.jpg";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Dolmen Mall Clifton | Dolmen Group",
  description:
    "Dolmen Mall Clifton brings shopping, dining and entertainment together in a landmark destination on Karachi’s vibrant waterfront.",
};

export default function DolmenMallCliftonPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Malls"
        titleLines={["Dolmen Mall", "Clifton"]}
        description="Dolmen Mall Clifton brings shopping, dining and entertainment together in a landmark destination on Karachi’s vibrant waterfront."
        image={heroImage}
        mobileImage={heroMobileImage}
      />
      <ProjectIntro
        reverse
        titleLines={["Pakistan’s Pioneering", "Shopping"]}
        highlight="Destination"
        paragraphs={[
          "Dolmen Mall Clifton is Pakistan’s pioneering flagship international-standard shopping destination, redefining the country’s retail experience.",
          "Bringing together leading local and global brands, dining, entertainment and lifestyle experiences, it offers something for everyone. A landmark destination that continues to set new benchmarks for modern retail in Pakistan.",
        ]}
        wideImage={{ src: wideImage, alt: "Dolmen Mall Clifton" }}
        tallImage={{ src: tallImage, alt: "Dolmen Mall Clifton" }}
      />
      <ProjectStats
        label="Dolmen Mall Clifton at a glance"
        stats={[
          {
            value: "2011",
            title: "Operational Since",
            text: "Pakistan’s premier shopping destination setting the benchmark for retail and lifestyle experiences.",
          },
          {
            value: "2.1M+",
            title: "Sq. Ft. Total Built Up Area",
            text: "An expansive architectural landmark featuring world class infrastructure and high capacity retail space.",
          },
          {
            value: "175+",
            title: "Brands & Outlets",
            text: "A curated mix of international and top local retail, dining and entertainment offerings.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Shop, Dine and"
        highlight="Unwind"
        slides={[
          // Slide titles are the image file names.
          { src: gallery1, title: "Iconic Mall Architecture" },
          { src: gallery2, title: "A World of Shopping" },
          { src: gallery3, title: "Vibrant Dining Experience" },
          { src: gallery4, title: "A Landmark Destination" },
          { src: gallery5, title: "Iconic Exterior View" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
