import type { Metadata } from "next";
import heroImage from "../../../assets/Sky towers page/hero section Sky towers.jpg";
import tallImage from "../../../assets/Sky towers page/Architectural Skyline Landmark/image 1336 (10).jpg";
import wideImage from "../../../assets/Sky towers page/Architectural Skyline Landmark/image 1335 (10).jpg";
import gallery1 from "../../../assets/Sky towers page/Dynamic Professional Environment/Sky towers (1).png";
import gallery2 from "../../../assets/Sky towers page/Dynamic Professional Environment/Sky towers (2).jpg";
import gallery3 from "../../../assets/Sky towers page/Dynamic Professional Environment/Sky towers (3).jpg";
import gallery4 from "../../../assets/Sky towers page/Dynamic Professional Environment/Sky towers (4).jpg";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Sky Towers | Dolmen Group",
  description:
    "Sky Towers brings contemporary workplaces and everyday convenience together in a connected business destination within Karachi’s Dolmen City.",
};

export default function SkyTowersPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Offices"
        titleLines={["Sky", "Towers"]}
        description="Sky Towers brings contemporary workplaces and everyday convenience together in a connected business destination within Karachi’s Dolmen City."
        image={heroImage}
      />
      <ProjectIntro
        reverse
        titleLines={["Elite Modern", "Corporate"]}
        highlight="Facilities"
        paragraphs={[
          "Sky Towers stands as a landmark corporate address, redefining the modern business environment. Designed for forward-thinking enterprises seeking excellence, innovation and growth.",
          "A sophisticated workplace that inspires productivity, collaboration and ambition. An iconic development setting new benchmarks for corporate spaces in Karachi.",
        ]}
        wideImage={{ src: wideImage, alt: "Sky Towers" }}
        tallImage={{ src: tallImage, alt: "Sky Towers" }}
      />
      <ProjectStats
        label="Sky Towers at a glance"
        stats={[
          {
            value: "2020",
            title: "Operational Since",
            text: "A state of the art commercial complex setting a new standard for corporate towers in Karachi.",
          },
          {
            value: "1.2M+",
            title: "Sq. Ft. Gross Leasable Area",
            text: "Unmatched commercial capacity providing high grade corporate office space for industry leaders.",
          },
          {
            value: "35",
            title: "High Rise Floors Each",
            text: "Premium twin towers offering panoramic views, modern infrastructure and complete business facilities.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Dynamic Professional"
        highlight="Environment"
        slides={[
          { src: gallery1, title: "Architectural Skyline Landmark" },
          { src: gallery2, title: "Grand Entrance Plaza" },
          { src: gallery3, title: "Secure Lobby Access" },
          { src: gallery4, title: "Modern Business Lounge" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
