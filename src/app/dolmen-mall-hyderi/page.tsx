import type { Metadata } from "next";
import heroImage from "../../../assets/Dolmen Mall Hyderi page/hero section hydery.png";
import tallImage from "../../../assets/Dolmen Mall Hyderi page/Your Everyday Neighborhood Mall /image 1336 (5).png";
import wideImage from "../../../assets/Dolmen Mall Hyderi page/Your Everyday Neighborhood Mall /image 1335 (5).png";
import galleryImage from "../../../assets/Dolmen Mall Hyderi page/Elevated Dining Experience/image 1341.png";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Dolmen Mall Hyderi | Dolmen Group",
  description:
    "Dolmen Mall Hyderi brings shopping, dining and family entertainment together in a welcoming destination close to home.",
};

export default function DolmenMallHyderiPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Malls"
        titleLines={["Dolmen Mall", "Hyderi"]}
        description="Dolmen Mall Hyderi brings shopping, dining and family entertainment together in a welcoming destination close to home."
        image={heroImage}
      />
      <ProjectIntro
        titleLines={["Your Everyday", ""]}
        highlight="Neighborhood"
        titleAfter="Mall"
        paragraphs={[
          "Dolmen Mall Hyderi stands as a vibrant community destination in the heart of North Nazimabad. Bringing together retail, dining, entertainment and everyday essentials under one roof. Offering a convenient and welcoming experience for families and visitors of all generations. Your neighborhood mall, close to your heart.",
        ]}
        wideImage={{ src: wideImage, alt: "Dolmen Mall Hyderi" }}
        tallImage={{ src: tallImage, alt: "Dolmen Mall Hyderi" }}
      />
      <ProjectStats
        label="Dolmen Mall Hyderi at a glance"
        stats={[
          {
            value: "2008",
            title: "Operational Since",
            text: "North Nazimabad’s first dedicated retail hub bringing quality shopping to northern Karachi.",
          },
          {
            value: "50K+",
            title: "Sq. Ft. Total Built Up Area",
            text: "A compact and efficient commercial layout tailored for everyday neighborhood convenience.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Everyday Joy, Shared"
        highlight="Together"
        slides={[{ src: galleryImage, title: "Dolmen Mall Hyderi" }]}
        hideCaption
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
