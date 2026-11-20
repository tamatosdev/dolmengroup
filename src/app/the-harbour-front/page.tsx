import type { Metadata } from "next";
import heroImage from "../../../assets/Harbour Front page/hero section Harbour Front.jpg";
import tallImage from "../../../assets/Harbour Front page/Prestigious Waterfront Corporate Offices/image 1336 (11).jpg";
import wideImage from "../../../assets/Harbour Front page/Prestigious Waterfront Corporate Offices/image 1335 (11).jpg";
import gallery1 from "../../../assets/Harbour Front page/Prestigious Commercial Address/Executive Corporate Lounge.jpg";
import gallery2 from "../../../assets/Harbour Front page/Prestigious Commercial Address/Harbour front (3).jpg";
import gallery3 from "../../../assets/Harbour Front page/Prestigious Commercial Address/Harbour front (4).jpg";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "The Harbour Front | Dolmen Group",
  description:
    "The Harbour Front is a modern, 19-story office tower developed by the Dolmen Group along the Clifton coastline in Karachi as part of the landmark Dolmen City Karachi.",
};

export default function HarbourFrontPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Offices"
        titleLines={["The Harbour", "Front"]}
        description="The Harbour Front is a modern, 19-story office tower developed by the Dolmen Group along the Clifton coastline in Karachi as part of the landmark Dolmen City Karachi."
        image={heroImage}
        mobileFocus={57}
      />
      <ProjectIntro
        titleLines={["Prestigious Waterfront", "Corporate"]}
        highlight="Offices"
        paragraphs={[
          "Harbour Front stands as a prestigious corporate landmark, offering premium office spaces in a distinguished waterfront setting.",
          "Designed for businesses that value excellence, sophistication and a prominent corporate identity. Combining contemporary architecture with thoughtfully planned spaces that inspire productivity and growth. A refined professional environment where convenience, functionality and elegance come together.",
        ]}
        wideImage={{ src: wideImage, alt: "The Harbour Front" }}
        tallImage={{ src: tallImage, alt: "The Harbour Front" }}
      />
      <ProjectStats
        label="The Harbour Front at a glance"
        stats={[
          {
            value: "2008",
            title: "Operational Since",
            text: "A landmark waterfront corporate address offering stunning views and a prestigious business environment.",
          },
          {
            value: "250K",
            title: "Sq. Ft. Gross Leasable Area",
            text: "Premium corporate real estate designed to cater to leading multinational and local enterprises.",
          },
          {
            value: "19",
            title: "Executive Floors",
            text: "Advanced commercial infrastructure featuring high speed elevators, secure parking and complete backup systems.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Prestigious Commercial"
        highlight="Address"
        slides={[
          { src: gallery1, title: "Executive Corporate Lounge" },
          { src: gallery2, title: "Waterfront Views" },
          { src: gallery3, title: "Reception & Waiting Area" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
