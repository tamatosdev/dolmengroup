import type { Metadata } from "next";
import heroImage from "../../../assets/Corporate Office Block/hero section.png";
import tallImage from "../../../assets/Corporate Office Block/Elevating Karachi’s Corporate Standard/image 1336 (2).png";
import wideImage from "../../../assets/Corporate Office Block/Elevating Karachi’s Corporate Standard/image 1335 (2).png";
import gallery1 from "../../../assets/Corporate Office Block/Prestigious Commercial Address/slider 2.png";
import gallery2 from "../../../assets/Corporate Office Block/Prestigious Commercial Address/slider.png";
import gallery3 from "../../../assets/Corporate Office Block/Prestigious Commercial Address/slider 3.png";
import gallery4 from "../../../assets/Corporate Office Block/Prestigious Commercial Address/slider 4.png";
import gallery5 from "../../../assets/Corporate Office Block/Prestigious Commercial Address/Dolmen Mall Lahore (5).png";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Corporate Office Block | Dolmen Group",
  description:
    "Corporate Office Block brings professional life and everyday convenience together in a connected workplace within Karachi’s Dolmen City.",
};

export default function CorporateOfficeBlockPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Offices"
        titleLines={["Corporate Office", "Block"]}
        description="Corporate Office Block brings professional life and everyday convenience together in a connected workplace within Karachi’s Dolmen City."
        image={heroImage}
      />
      <ProjectIntro
        reverse
        titleLines={["Elevating Karachi’s", "Corporate"]}
        highlight="Standard"
        paragraphs={[
          "Corporate Office Block offers a distinguished business address within one of Karachi’s most established commercial destinations.",
          "Featuring expansive office spaces designed to accommodate the evolving needs of modern enterprises. A professionally managed environment that brings together convenience, functionality and efficiency. A workplace where established businesses and emerging enterprises find the space to thrive.",
        ]}
        wideImage={{ src: wideImage, alt: "Corporate Office Block" }}
        tallImage={{ src: tallImage, alt: "Corporate Office Block" }}
      />
      <ProjectStats
        label="Corporate Office Block at a glance"
        stats={[
          {
            value: "2015",
            title: "Operational Since",
            text: "A premier commercial building designed to host leading corporate enterprises and businesses.",
          },
          {
            value: "115K",
            title: "Sq. Ft. of Gross Leasable Area",
            text: "Expansive high grade office spaces built to support flexible layouts and corporate growth.",
          },
          {
            value: "3",
            title: "Modern Office Floors",
            text: "Built to provide a secure and efficient workspace with complete professional management.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Where Work Meets"
        highlight="Lifestyle"
        slides={[
          { src: gallery1, title: "Elevated Dining Experience" },
          { src: gallery2, title: "Family Entertainment" },
          { src: gallery3, title: "Premium Retail Galleries" },
          { src: gallery4, title: "Skylit Grand Atrium" },
          { src: gallery5, title: "Iconic Architecture" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
