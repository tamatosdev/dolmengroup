import type { Metadata } from "next";
import elevatedPodiumGarden from "../../../assets/groove-page/Elevated Podium Garden.png";
import exclusiveResidentLounge from "../../../assets/groove-page/Exclusive Resident Lounge.png";
import groveBedroom from "../../../assets/groove-page/grove-1.jpg";
import groveDining from "../../../assets/groove-page/grove-2.jpg";
import modernSpaciousLiving from "../../../assets/groove-page/Modern Spacious Living.png";
import groveResidencyImage from "../../../assets/grove-project-image.jpg";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "The Grove Residency | Dolmen Group",
  description:
    "Grove Residency brings contemporary living to life through thoughtfully designed spaces across three distinctive residential towers.",
};

export default function GroveResidencyPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Residence"
        titleLines={["The Grove", "Residency"]}
        description="Grove Residency brings contemporary living to life through thoughtfully designed spaces across three distinctive residential towers."
        image={groveResidencyImage}
      />
      <ProjectIntro
        titleLines={["Elevated Living at", "The Grove"]}
        highlight="Residency"
        paragraphs={[
          "Dolmen Group’s latest residential development, Grove Residency, is a thoughtfully designed vertically gated community created by award-winning architect Arshad Shahid Abdulla.",
          "Comprising three residential towers, the project features spacious all-corner apartments complemented by modern amenities. Residents enjoy access to an elevated landscaped garden, walking tracks and well-planned communal spaces including a gym, prayer rooms and children’s play areas. Designed for families seeking affordable quality living, Grove Residency offers a secure, well-connected community environment that truly feels like home.",
        ]}
        cta={{ label: "Visit Website", href: "https://groveresidency.com/" }}
        wideImage={{ src: groveBedroom, alt: "Furnished bedroom in a Grove Residency apartment" }}
        tallImage={{ src: groveDining, alt: "Dining area in a Grove Residency apartment" }}
      />
      <ProjectStats
        label="Grove Residency at a glance"
        stats={[
          {
            value: "2026",
            title: "Operational From",
            text: "A new destination for modern living, thoughtfully designed for tomorrow.",
          },
          {
            value: "1M+",
            title: "Sq. Ft. Total Built-up Area",
            text: "Expansive spaces designed to bring comfort, convenience community together.",
          },
          {
            value: "3",
            title: "Residential Towers",
            text: "Three distinctive towers offering a new perspective on contemporary living.",
          },
        ]}
      />
      {/* Slide titles are the image file names. */}
      <ProjectGallery
        titleLead="Life at The"
        highlight="Grove"
        slides={[
          { src: modernSpaciousLiving, title: "Modern Spacious Living" },
          { src: elevatedPodiumGarden, title: "Elevated Podium Garden" },
          { src: exclusiveResidentLounge, title: "Exclusive Resident Lounge" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
