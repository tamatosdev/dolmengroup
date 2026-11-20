import type { Metadata } from "next";
import heroImage from "../../../assets/Executive Tower page/hero section tower.png";
import tallImage from "../../../assets/Executive Tower page/Prime Corporate Business Hub/image 1336 (7).png";
import galleryImage from "../../../assets/Executive Tower page/Elevated Dining Experience.png";
import wideImage from "../../../assets/Executive Tower page/Prime Corporate Business Hub/image 1335 (7).png";
import ProjectGallery from "../project-gallery";
import ProjectHero from "../project-hero";
import ProjectIntro from "../project-intro";
import ProjectStats from "../project-stats";
import ScrollReveal from "../scroll-reveal";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const metadata: Metadata = {
  title: "Executive Tower | Dolmen Group",
  description:
    "Executive Tower brings business and ambition together in a distinctive corporate setting overlooking Karachi’s iconic Clifton waterfront.",
};

export default function ExecutiveTowerPage() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />
      <ProjectHero
        category="Offices"
        titleLines={["Executive", "Towers"]}
        description="Executive Tower brings business and ambition together in a distinctive corporate setting overlooking Karachi’s iconic Clifton waterfront."
        image={heroImage}
      />
      <ProjectIntro
        titleLines={["Prime Corporate", "Business"]}
        highlight="Hub"
        paragraphs={[
          "An established address for distinguished business. Set against the waterfront, Executive Tower offers a refined corporate environment where businesses benefit from connectivity, convenience and a prominent presence.",
        ]}
        wideImage={{ src: wideImage, alt: "Executive Tower" }}
        tallImage={{ src: tallImage, alt: "Executive Tower" }}
      />
      <ProjectStats
        label="Executive Tower at a glance"
        stats={[
          {
            value: "2006",
            title: "Operational Since",
            text: "A landmark corporate tower establishing a premium office address on the Clifton seafront.",
          },
          {
            value: "175K",
            title: "Sq. Ft. Gross Leasable Area",
            text: "Expansive workspace designed to accommodate leading multinational and local corporations.",
          },
          {
            value: "17",
            title: "Corporate Floors",
            text: "Modern commercial floors offering panoramic ocean views and complete corporate facilities.",
          },
        ]}
      />
      <ProjectGallery
        titleLead="Modern Workspace"
        highlight="Solutions"
        slides={[
          { src: galleryImage, title: "Elevated Dining Experience" },
          { src: tallImage, title: "Waterfront Tower" },
          { src: wideImage, title: "Corporate Address" },
          { src: heroImage, title: "Executive Tower Exterior" },
        ]}
      />
      <SiteFooter />
      <ScrollReveal />
    </div>
  );
}
