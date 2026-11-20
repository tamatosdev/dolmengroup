import type { Metadata } from "next";
import heroImage from "../../../assets/Sindbad/hero section Sindbad.png";
import tallImage from "../../../assets/Sindbad/Ultimate Family Entertainment Zone/image 1336 (9).png";
import galleryImage from "../../../assets/Sindbad/Indoor Amusement & Play Arena.png";
import wideImage from "../../../assets/Sindbad/Ultimate Family Entertainment Zone/image 1335 (9).png";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Sindbad’s Wonderland | Dolmen Group",
  description:
    "Sindbad’s Wonderland brings play, discovery and family excitement together in a lively destination made for shared adventures.",
};

export default function SindbadsWonderlandPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Entertainment"
        titleLines={["Sindbad’s", "Wonderland"]}
        description="Sindbad’s Wonderland brings play, discovery and family excitement together in a lively destination made for shared adventures."
        image={heroImage}
      />
      <ProjectIntro
        titleLines={["Ultimate Family", ""]}
        highlight="Entertainment"
        titleAfter="Zone"
        paragraphs={[
          "Sindbad stands as an iconic name in family entertainment, creating joyful experiences for generations. Bringing families together through unforgettable moments of laughter, happiness and connection. For millions, Sindbad is more than entertainment; it is a cherished part of growing up.",
          "A timeless legacy of memories that continues to inspire joy in every generation.",
        ]}
        wideImage={{ src: wideImage, alt: "Sindbad’s Wonderland" }}
        tallImage={{ src: tallImage, alt: "Sindbad’s Wonderland" }}
      />
      <ProjectStats
        label="Sindbad’s Wonderland at a glance"
        stats={[
          {
            value: "1991",
            title: "Operational Since",
            text: "A trusted family entertainment brand delivering fun and recreational activities alongside the mall opening.",
          },
          {
            value: "3",
            title: "Major Cities",
            text: "Operating premier family recreation destinations across Karachi, Lahore and Faisalabad.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Immersive Adventure"
        highlight="Experience"
        slides={[
          { src: galleryImage, title: "Indoor Amusement & Play Arena" },
          { src: tallImage, title: "Family Play Zone" },
          { src: wideImage, title: "Arcade & Rides" },
          { src: heroImage, title: "Sindbad’s Wonderland Entrance" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
