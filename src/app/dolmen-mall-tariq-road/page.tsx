import type { Metadata } from "next";
import heroImage from "../../../assets/Dolmen Mall Tariq Road/hero section tariq mall.jpg";
import tallImage from "../../../assets/Dolmen Mall Tariq Road/Reimagining Traditional Retail Elegance /image 1336 (6).jpg";
import wideImage from "../../../assets/Dolmen Mall Tariq Road/Reimagining Traditional Retail Elegance /image 1335 (6).jpg";
import galleryImage from "../../../assets/Dolmen Mall Tariq Road/Karachi Connects Here .jpg";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Dolmen Mall Tariq Road | Dolmen Group",
  description:
    "Dolmen Mall Tariq Road brings shopping, dining and family entertainment together in a familiar destination at Karachi’s heart.",
};

export default function DolmenMallTariqRoadPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Malls"
        titleLines={["Dolmen Mall", "Tariq Road"]}
        description="Dolmen Mall Tariq Road brings shopping, dining and family entertainment together in a familiar destination at Karachi’s heart."
        image={heroImage}
        mobileFocus={46}
      />
      <ProjectIntro
        reverse
        titleLines={["Reimagining Traditional", "Retail"]}
        highlight="Elegance"
        paragraphs={[
          "Located in the heart of Karachi’s iconic Tariq Road, Dolmen Mall Tariq Road stands as a pioneer of modern retail in Pakistan.",
          "As the country’s first organized indoor retail mall, it transformed the traditional shopping experience and set new benchmarks for the industry. Bringing together leading brands, convenience entertainment under one roof, it redefined the meaning of urban lifestyle. A timeless landmark that has become an integral part of Karachi’s vibrant retail landscape.",
        ]}
        wideImage={{ src: wideImage, alt: "Dolmen Mall Tariq Road" }}
        tallImage={{ src: tallImage, alt: "Dolmen Mall Tariq Road" }}
      />
      <ProjectStats
        label="Dolmen Mall Tariq Road at a glance"
        stats={[
          {
            value: "2001",
            title: "Operational Since",
            text: "A pioneer in modern shopping that introduced structured retail culture to Tariq Road.",
          },
          {
            value: "500K",
            title: "Sq. Ft. Total Built Up Area",
            text: "A multi level commercial layout integrated seamlessly into Karachi’s premier shopping hub.",
          },
        ]}
      />
      <ProjectGallery
        titleLead=""
        highlight="Karachi"
        titleTrail="Connects Here"
        slides={[{ src: galleryImage, title: "Karachi Connects Here" }]}
        hideCaption
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
