import type { Metadata } from "next";
import heroImage from "../../../assets/Dolmen City Islamabad page/hero section.png";
import tallImage from "../../../assets/Dolmen City Islamabad page/islamabad’s New Luxury Standard/image 1336 (12).png";
import wideImage from "../../../assets/Dolmen City Islamabad page/islamabad’s New Luxury Standard/image 1335 (12).png";
import gallery1 from "../../../assets/Dolmen City Islamabad page/Grand Atrium & Concourse/Grand Atrium & Concourse.png";
import gallery2 from "../../../assets/Dolmen City Islamabad page/Grand Atrium & Concourse/Dolmen City Islamabad (4).png";
import gallery3 from "../../../assets/Dolmen City Islamabad page/Grand Atrium & Concourse/Dolmen City Islamabad (5).png";
import gallery4 from "../../../assets/Dolmen City Islamabad page/Grand Atrium & Concourse/Dolmen City Islamabad (6).png";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Dolmen City Islamabad | Dolmen Group",
  description:
    "Dolmen City Islamabad will bring shopping, working, living together in a connected destination envisioned for the capital.",
};

export default function DolmenCityIslamabadPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Residence"
        titleLines={["Dolmen City", "Islamabad"]}
        description="Dolmen City Islamabad will bring shopping, working, living together in a connected destination envisioned for the capital."
        image={heroImage}
      />
      <ProjectIntro
        titleLines={["Islamabad’s New", "Luxury"]}
        highlight="Standard"
        paragraphs={[
          "Discover a sanctuary where architectural brilliance meets natural splendor. Dolmen City Islamabad redefines luxury, establishing a prestigious new standard for sophisticated living in the heart of the capital.",
          "Nestled against a backdrop of breathtaking landscapes, this master-planned development seamlessly blends contemporary innovation with serene beauty. Every detail is meticulously crafted, offering world-class residential towers, corporate spaces and elite retail experiences designed for those who command the extraordinary.",
        ]}
        wideImage={{ src: wideImage, alt: "Dolmen City Islamabad" }}
        tallImage={{ src: tallImage, alt: "Dolmen City Islamabad" }}
      />
      <ProjectStats
        label="Dolmen City Islamabad at a glance"
        stats={[
          {
            value: "2M+",
            title: "Sq. Ft. of Green Landscaping",
            text: "Expansive open green spaces designed to integrate nature with modern lifestyle amenities.",
          },
          {
            value: "130+",
            title: "Acres of Land",
            text: "A sprawling master planned development built to redefine luxury urban living in Islamabad.",
          },
          {
            value: "5KM",
            title: "Walking & Cycling Loop",
            text: "Dedicated outdoor tracks promoting wellness, active living and an eco friendly community.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Inside Islamabad’s New"
        highlight="Landmark"
        slides={[
          { src: gallery1, title: "Grand Atrium & Concourse" },
          { src: gallery2, title: "Master Planned Community" },
          { src: gallery3, title: "Lifestyle Boulevard" },
          { src: gallery4, title: "Dolmen Mall Islamabad" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
