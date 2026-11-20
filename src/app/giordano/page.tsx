import type { Metadata } from "next";
import heroImage from "../../../assets/Giordano/hero section Giordano.png";
import tallImage from "../../../assets/Giordano/Timeless Global Fashion Standard/image 1336 (8).png";
import galleryImage from "../../../assets/Giordano/Modern Office Lobby & Reception.png";
import wideImage from "../../../assets/Giordano/Timeless Global Fashion Standard/image 1335 (8).png";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Giordano | Dolmen Group",
  description:
    "Giordano brings international style and everyday comfort together through versatile essentials designed for modern wardrobes and relaxed living.",
};

export default function GiordanoPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Retail"
        titleLines={["Giordano"]}
        description="Giordano brings international style and everyday comfort together through versatile essentials designed for modern wardrobes and relaxed living."
        image={heroImage}
      />
      <ProjectIntro
        reverse
        titleLines={["Timeless Global", "Fashion"]}
        highlight="Standard"
        paragraphs={[
          "Giordano brings a world of premium international fashion to Pakistan, combining timeless style with exceptional quality. Renowned for its superior craftsmanship, contemporary designs and effortless everyday elegance. Offering versatile collections that reflect comfort, sophistication and modern lifestyles.",
          "Through Dolmen, Giordano continues to bring its globally recognized fashion experience to customers across Pakistan.",
        ]}
        wideImage={{ src: wideImage, alt: "Giordano" }}
        tallImage={{ src: tallImage, alt: "Giordano" }}
      />
      <ProjectStats
        label="Giordano at a glance"
        stats={[
          {
            value: "2013",
            title: "Operational Since in Pakistan",
            text: "Bringing contemporary global fashion to Pakistani shoppers through accessible, everyday style.",
          },
          {
            value: "1800+",
            title: "Global Stores",
            text: "Maintaining a strong international retail network providing versatile everyday casual wear.",
          },
          {
            value: "30+",
            title: "Countries Worldwide",
            text: "Delivering accessible fashion essentials across Asia, the Middle East and global markets.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="The Giordano"
        highlight="Experience"
        slides={[
          { src: galleryImage, title: "Modern Retail Experience" },
          { src: tallImage, title: "Everyday Essentials" },
          { src: wideImage, title: "Giordano Store" },
          { src: heroImage, title: "Giordano Storefront" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
