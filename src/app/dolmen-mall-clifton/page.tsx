import type { Metadata } from "next";
import heroImage from "../../../assets/Dolmen Mall Clifton page/hero section.png";
import tallImage from "../../../assets/Dolmen Mall Clifton page/Pakistan’s Pioneering Shopping Destination /image 1336 (4).png";
import wideImage from "../../../assets/Dolmen Mall Clifton page/Pakistan’s Pioneering Shopping Destination /image 1335 (4).png";
import gallery1 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/Elevated Dining Experience.png";
import gallery2 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/slider.png";
import gallery3 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/slider 3.png";
import gallery4 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/slider 4.png";
import gallery5 from "../../../assets/Dolmen Mall Clifton page/Elevated Dining Experience/hero section.png";
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
            text: "A curated mix of international and top local retail, dining entertainment offerings.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Shop, Dine and"
        highlight="Unwind"
        slides={[
          { src: gallery1, title: "Elevated Dining Experience" },
          { src: gallery2, title: "Family Entertainment" },
          { src: gallery3, title: "Premium Retail Galleries" },
          { src: gallery4, title: "Skylit Grand Atrium" },
          { src: gallery5, title: "Dolmen Mall Clifton Exterior" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
