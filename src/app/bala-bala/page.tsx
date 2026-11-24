import type { Metadata } from "next";
import heroImage from "../../../assets/Bala bala page/hero section.jpg";
import tallImage from "../../../assets/Bala bala page/Big Style for Little Adventures/image 1336 (1).jpg";
import galleryImage from "../../../assets/Bala bala page/A New Home for Kids’ Fashion scetion.png";
import lahoreBranchImage from "../../../assets/Bala bala page/Bala Bala Lahore Branch.jpg";
import wideImage from "../../../assets/Bala bala page/Big Style for Little Adventures/image 1335 (1).jpg";
import heroMobileImage from "../../../assets/Bala bala page/mobile hero section image.jpg";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Bala Bala | Dolmen Group",
  description:
    "Balabala brings playful style and everyday comfort together in colourful collections designed for growing personalities and little adventures.",
};

export default function BalaBalaPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Retail"
        titleLines={["Bala Bala"]}
        description="Balabala brings playful style and everyday comfort together in colourful collections designed for growing personalities and little adventures."
        image={heroImage}
        mobileImage={heroMobileImage}
      />
      <ProjectIntro
        reverse
        titleLines={["Big Style for", "Little"]}
        highlight="Adventures"
        paragraphs={[
          "Bala Bala brings a fresh world of international children’s fashion to Pakistan. Renowned for its premium quality, playful designs and contemporary styles for children of all ages. Offering thoughtfully designed collections that reflect the joy, energy and individuality of young generations.",
          "Through Dolmen, Bala Bala introduces a vibrant shopping experience for children and families across Pakistan.",
        ]}
        wideImage={{ src: wideImage, alt: "Bala Bala" }}
        tallImage={{ src: tallImage, alt: "Bala Bala" }}
      />
      <ProjectStats
        label="Bala Bala at a glance"
        stats={[
          {
            value: "2026",
            title: "Operational since in Pakistan",
            text: "Delivering award winning design and durable fashion crafted for active everyday play.",
          },
          {
            value: "4800+",
            title: "Global Retail Stores",
            text: "A premier international kidswear brand with an extensive retail footprint across global markets.",
          },
          {
            value: "18",
            title: "Countries & Regions",
            text: "Serving families worldwide with high quality, functional apparel engineered for growing children.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="A New Home for Kids’"
        highlight="Fashion"
        slides={[
          { src: galleryImage, title: "Kids’ Fashion Flagship" },
          { src: tallImage, title: "Playful Collections" },
          { src: wideImage, title: "Bala Bala Store" },
          { src: heroImage, title: "Bala Bala Storefront" },
          { src: lahoreBranchImage, title: "Bala Bala Lahore Branch" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
